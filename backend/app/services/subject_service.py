import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional

subjects: List[Dict[str, Any]] = []

def load_subject_data():
    global subjects
    current_dir = Path(__file__).resolve().parent
    possible_paths = [
        current_dir.parent.parent / "subjects.json",
        current_dir.parent.parent.parent / "subjects.json",
        Path("subjects.json"),
        Path("backend/subjects.json"),
    ]

    for p in possible_paths:
        if p.exists():
            try:
                print(f"▶ Loading subject data from: {p}")
                with open(p, "r", encoding="utf-8") as f:
                    parsed_data = json.load(f)

                if isinstance(parsed_data, list):
                    subject_array = parsed_data
                elif isinstance(parsed_data, dict):
                    subject_array = list(parsed_data.values())
                else:
                    subject_array = []

                subjects = []
                for s in subject_array:
                    code = (s.get("subjectCode") or s.get("code") or "").strip().upper()
                    name = (s.get("name") or s.get("subject_name") or "").strip()
                    subjects.append({
                        **s,
                        "code": code,
                        "subjectCode": code,
                        "name": name,
                        "credit": str(s.get("credit") or s.get("credits") or "4.0"),
                        "isCore": s.get("isCore") or ("Yes" if s.get("is_core") else "No") or "Yes",
                        "ltp": s.get("ltp") or "3-0-2",
                        "description": s.get("description") or "Subject curriculum and syllabus information.",
                        "searchCode": re.sub(r"[^A-Za-z0-9]", "", code),
                        "searchName": name.lower(),
                    })

                print(f"[OK] Successfully loaded {len(subjects)} subject entries.")
                return
            except Exception as err:
                print(f"[ERROR] Error parsing subject file at {p}: {err}")

    print("[WARN] Could not find 'subjects.json'. Default subject list will be empty.")

def find_subject(query: str) -> Optional[Dict[str, Any]]:
    global subjects
    if not query:
        return None
    if not subjects:
        load_subject_data()
    if not subjects:
        return None

    clean_query = query.strip()
    upper_query = clean_query.upper()
    lower_query = clean_query.lower()
    alphanumeric_query = re.sub(r"[^A-Za-z0-9]", "", upper_query)

    # 1. Exact match on normalized code (e.g. UCS312, UCS 312)
    for s in subjects:
        if s["searchCode"] == alphanumeric_query:
            return s

    # 2. Partial match on code inside query (e.g. "tell me about UCS303")
    for s in subjects:
        if len(s["searchCode"]) > 3 and (s["searchCode"] in upper_query or s["searchCode"] in alphanumeric_query):
            return s

    # 3. Exact match on name
    for s in subjects:
        if s["searchName"] == lower_query:
            return s

    # 4. Partial substring match on name
    filtered_words = re.sub(
        r"\b(subject|course|syllabus|details|info|tell|me|about|what|is|the|credit|credits)\b",
        "",
        lower_query,
        flags=re.IGNORECASE,
    ).strip()

    if len(filtered_words) >= 3:
        for s in subjects:
            if filtered_words in s["searchName"] or s["searchName"] in filtered_words:
                return s

    # 5. Multi-token match
    tokens = [w for w in re.split(r"\s+", filtered_words) if len(w) > 2]
    if tokens:
        best_match = None
        max_matches = 0
        for s in subjects:
            match_count = sum(1 for t in tokens if t in s["searchName"])
            if match_count > max_matches:
                max_matches = match_count
                best_match = s
        if max_matches > 0:
            return best_match

    return None

def list_all_subjects() -> List[str]:
    global subjects
    if not subjects:
        load_subject_data()
    return [f"{s['code']} - {s['name']}" for s in subjects]
