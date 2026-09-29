import os
import json
import time
import hmac
import hashlib
import base64
from pathlib import Path
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Header, HTTPException, Depends
from pydantic import BaseModel

import app.db as db
from app.services.faculty_service import load_fallback_faculty
from app.services.timetable_service import load_timetable_data
from app.services.subject_service import load_subject_data

router = APIRouter(prefix="/api/faculty", tags=["Faculty Management"])

# -------------------------------------------------------------
# 1. SIMPLE JWT AUTHENTICATION
# -------------------------------------------------------------
JWT_SECRET = os.getenv("JWT_SECRET", "campusgpt_faculty_secret_key_2026")
FACULTY_PASSCODE = os.getenv("FACULTY_PASSCODE", "thapar@faculty2026")
DATA_DIR = Path(__file__).resolve().parent.parent.parent

def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")

def _b64url_decode(data_str: str) -> bytes:
    padding = 4 - (len(data_str) % 4)
    if padding and padding < 4:
        data_str += "=" * padding
    return base64.urlsafe_b64decode(data_str.encode("utf-8"))

def create_jwt(payload_data: Dict[str, Any], expires_in: int = 7 * 86400) -> str:
    now = int(time.time())
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {**payload_data, "iat": now, "exp": now + expires_in}

    h_b64 = _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    p_b64 = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{h_b64}.{p_b64}".encode("utf-8")
    sig = _b64url_encode(hmac.new(JWT_SECRET.encode("utf-8"), signing_input, hashlib.sha256).digest())
    return f"{h_b64}.{p_b64}.{sig}"

def verify_faculty_token(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Dependency that ensures the caller has a valid Faculty JWT token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    token = authorization.replace("Bearer ", "").strip()
    parts = token.split(".")
    if len(parts) != 3:
        raise HTTPException(status_code=401, detail="Invalid token format")

    h_b64, p_b64, sig_b64 = parts
    signing_input = f"{h_b64}.{p_b64}".encode("utf-8")
    expected_sig = hmac.new(JWT_SECRET.encode("utf-8"), signing_input, hashlib.sha256).digest()

    try:
        actual_sig = _b64url_decode(sig_b64)
        if not hmac.compare_digest(expected_sig, actual_sig):
            raise HTTPException(status_code=401, detail="Invalid token signature")

        payload = json.loads(_b64url_decode(p_b64).decode("utf-8"))
        if payload.get("exp") and int(time.time()) > int(payload["exp"]):
            raise HTTPException(status_code=401, detail="Token has expired")

        if payload.get("role") != "faculty":
            raise HTTPException(status_code=403, detail="Forbidden: Faculty role required")

        return payload
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Token verification failed")

# -------------------------------------------------------------
# 2. REQUEST SCHEMAS
# -------------------------------------------------------------
class LoginRequest(BaseModel):
    email: str
    passcode: str

class FacultyUpdateRequest(BaseModel):
    FacultyID: Optional[int] = None
    Name: str
    Department: Optional[str] = ""
    Email: Optional[str] = ""
    Office: Optional[str] = ""
    Specialization: Optional[str] = ""
    link: Optional[str] = ""

class TimetableUpdateRequest(BaseModel):
    batch: str
    day: str
    time: str
    subject: str
    room: Optional[str] = "TBA"
    type: Optional[str] = "L"

class SubjectUpdateRequest(BaseModel):
    code: str
    credit: Optional[str] = None
    name: Optional[str] = None
    ltp: Optional[str] = None
    description: Optional[str] = None

# -------------------------------------------------------------
# 3. FACULTY LOGIN ENDPOINT
# -------------------------------------------------------------
@router.post("/login")
def faculty_login(req: LoginRequest):
    """Authenticate faculty via master passcode and issue JWT."""
    if req.passcode.strip() != FACULTY_PASSCODE:
        raise HTTPException(status_code=401, detail="Incorrect faculty passcode")

    name = req.email.split("@")[0].replace(".", " ").title() if "@" in req.email else req.email
    token = create_jwt({"sub": req.email, "name": name, "role": "faculty"})

    return {
        "status": "success",
        "token": token,
        "user": {"email": req.email, "name": name, "role": "faculty"},
    }

# -------------------------------------------------------------
# 4. UPDATE FACULTY INFO (DB + LOCAL faculty.json)
# -------------------------------------------------------------
@router.put("/update-profile")
def update_faculty_profile(data: FacultyUpdateRequest, user: dict = Depends(verify_faculty_token)):
    """Updates faculty details in both MySQL database and local faculty.json."""
    updated = False

    # 1. Update MySQL database if reachable and FacultyID provided
    if data.FacultyID:
        db_res = db.update_faculty_db(
            faculty_id=data.FacultyID,
            name=data.Name,
            department=data.Department or "",
            email=data.Email or "",
            office=data.Office or "",
            specialization=data.Specialization or "",
            link=data.link or ""
        )
        if db_res:
            updated = True

    # 2. Update local faculty.json fallback file
    faculty_file = DATA_DIR / "data" / "faculty.json"
    if faculty_file.exists():
        try:
            with open(faculty_file, "r", encoding="utf-8") as f:
                faculty_list = json.load(f)

            found = False
            for item in faculty_list:
                # Match by FacultyID or by Name
                if (data.FacultyID and item.get("FacultyID") == data.FacultyID) or \
                   (item.get("Name", "").strip().lower() == data.Name.strip().lower()):
                    item["Name"] = data.Name
                    if data.Department: item["Department"] = data.Department
                    if data.Email: item["Email"] = data.Email
                    if data.Office: item["Office"] = data.Office
                    if data.Specialization: item["Specialization"] = data.Specialization
                    if data.link: item["link"] = data.link
                    found = True
                    break

            if found:
                with open(faculty_file, "w", encoding="utf-8") as f:
                    json.dump(faculty_list, f, indent=2, ensure_ascii=False)
                # Reload memory cache
                import app.services.faculty_service as fs
                fs.fallback_faculty.clear()
                load_fallback_faculty()
                updated = True
        except Exception as e:
            print(f"[WARN] Failed to write local faculty.json: {e}")

    return {
        "status": "success",
        "message": f"Faculty profile for '{data.Name}' updated successfully in DB & local store.",
        "data": data.model_dump()
    }

# -------------------------------------------------------------
# 5. UPDATE TIMETABLE INFO (LOCAL timetable-data.json)
# -------------------------------------------------------------
@router.put("/update-timetable")
def update_timetable_slot(data: TimetableUpdateRequest, user: dict = Depends(verify_faculty_token)):
    """Updates timetable slot for a specific batch in timetable-data.json."""
    tt_file = DATA_DIR / "timetable-data.json"
    if not tt_file.exists():
        raise HTTPException(status_code=404, detail="timetable-data.json not found")

    try:
        with open(tt_file, "r", encoding="utf-8") as f:
            all_tt = json.load(f)

        target_batch = data.batch.strip().upper()
        target_day = data.day.strip().capitalize()
        target_time = data.time.strip().lower().replace(" ", "")

        updated = False
        course_str = f"{data.subject.strip()} {data.type.strip()} {data.room.strip()}".strip()

        for category, batches in all_tt.items():
            if not isinstance(batches, dict) or target_batch not in batches:
                continue

            grid = batches[target_batch]
            if not grid or len(grid) < 2:
                continue

            # Day column index from header row
            header = grid[0]
            day_idx = None
            for idx, cell in enumerate(header[1:], start=1):
                if cell.get("course", "").strip().lower() == target_day.lower():
                    day_idx = idx
                    break

            if day_idx is None:
                continue

            # Find matching time row
            for row in grid[1:]:
                row_time = row[0].get("course", "").strip().lower().replace(" ", "")
                if target_time in row_time or row_time in target_time:
                    if day_idx < len(row):
                        row[day_idx]["course"] = course_str
                        row[day_idx]["color"] = "danger" if data.type == "L" else "success"
                        updated = True
                        break

            if updated:
                break

        if updated:
            with open(tt_file, "w", encoding="utf-8") as f:
                json.dump(all_tt, f, indent=2, ensure_ascii=False)
            load_timetable_data()
            return {
                "status": "success",
                "message": f"Updated timetable for {target_batch} on {target_day} ({data.time}): {course_str}"
            }
        else:
            raise HTTPException(status_code=404, detail=f"Matching slot for {target_batch} on {target_day} ({data.time}) not found")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update timetable: {str(e)}")

# -------------------------------------------------------------
# 6. UPDATE SUBJECT CREDITS (LOCAL subjects.json)
# -------------------------------------------------------------
@router.put("/update-subject")
def update_subject_info(data: SubjectUpdateRequest, user: dict = Depends(verify_faculty_token)):
    """Updates subject credits and syllabus in local subjects.json."""
    subj_file = DATA_DIR / "subjects.json"
    if not subj_file.exists():
        raise HTTPException(status_code=404, detail="subjects.json not found")

    try:
        with open(subj_file, "r", encoding="utf-8") as f:
            all_subjects = json.load(f)

        code_key = data.code.strip().upper()
        target_subject = None

        if isinstance(all_subjects, dict) and code_key in all_subjects:
            target_subject = all_subjects[code_key]
        elif isinstance(all_subjects, list):
            for s in all_subjects:
                if (s.get("code") or s.get("subjectCode") or "").strip().upper() == code_key:
                    target_subject = s
                    break

        if not target_subject:
            raise HTTPException(status_code=404, detail=f"Subject '{code_key}' not found in subjects.json")

        if data.credit is not None:
            target_subject["credit"] = str(data.credit)
        if data.name:
            target_subject["name"] = data.name
        if data.ltp:
            target_subject["ltp"] = data.ltp
        if data.description:
            target_subject["description"] = data.description

        with open(subj_file, "w", encoding="utf-8") as f:
            json.dump(all_subjects, f, indent=2, ensure_ascii=False)

        load_subject_data()

        return {
            "status": "success",
            "message": f"Subject '{code_key}' updated successfully. Credit is now {target_subject.get('credit')}.",
            "data": target_subject
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update subject: {str(e)}")
