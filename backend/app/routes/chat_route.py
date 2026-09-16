import re
from typing import Dict, Any, Optional
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.models.schemas import ChatRequest
from app.nlp.gemini_nlp import analyze_message
import app.services.timetable_service as timetable_service
import app.services.cafeteria_service as cafeteria_service
import app.services.subject_service as subject_service
import app.services.certificate_service as certificate_service
import app.services.doaa_service as doaa_service
import app.services.faculty_service as faculty_service
from app.services.dispensary_service import get_dispensary_info

router = APIRouter(tags=["Chat"])

def clean_faculty_name(input_str: Optional[str]) -> str:
    if not input_str:
        return ""
    cleaned = re.sub(
        r"\b(tell|details|detail|faculty|information|info|about|for|give|show|show me|find|office|email|profile|who is|dr|prof|professor|teacher|sir|madam)\.?\b",
        "",
        input_str,
        flags=re.IGNORECASE
    )
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned

def normalize_faculty_entity(entities: Dict[str, Any], message: Optional[str]) -> Optional[str]:
    candidates = [
        entities.get("faculty_name"),
        entities.get("person_name"),
        entities.get("name"),
        entities.get("query"),
        entities.get("faculty"),
        entities.get("person"),
    ]

    for c in candidates:
        if isinstance(c, str) and c.strip():
            return c.strip()

    if message:
        trimmed = message.strip()
        if len(trimmed.split()) <= 4:
            return trimmed

    return None

@router.get("/api/chat/doaa-procedures")
@router.get("/chat/doaa-procedures")
@router.get("/doaa-procedures")
async def get_doaa_procedures():
    return doaa_service.doaa_procedures

@router.post("/api/chat")
@router.post("/api/chat/")
@router.post("/chat")
@router.post("/chat/")
@router.post("")
@router.post("/")
async def handle_chat(req: ChatRequest):
    try:
        message = req.message or ""
        trimmed = message.strip()
        if not trimmed:
            return {
                "type": "simple_message",
                "response": "Hello! How can I assist you with campus information today?",
            }

        analysis = await analyze_message(trimmed)
        intent = analysis.get("intent", "general_query")
        entities = analysis.get("entities", {})

        print(f"\n💬 Received Query: \"{trimmed}\"")
        print(f"🔍 Detected Intent: {intent}", entities)

        # ---------------- GREETING ----------------
        if intent == "greeting":
            return {
                "type": "simple_message",
                "response": (
                    "👋 **Hello! I'm CampusGPT, your AI campus assistant.**\n\nHere are things you can ask me:\n"
                    "• **Timetables:** *'2C24 schedule'* or *'1A11 timetable for Tuesday'*\n"
                    "• **Cafeteria & Menus:** *'Pizza Nation menu'* or *'Nescafe'* or *'Jaggi juice'*\n"
                    "• **Subjects & Syllabus:** *'UCS312'* or *'Operating Systems credits'*\n"
                    "• **Academic Procedures:** *'How to change group?'*, *'How to drop subject?'*, *'Makeup MST'*\n"
                    "• **Certificates:** *'SC certificate format'*, *'Gap year affidavit'*, *'Income certificate'*\n"
                    "• **Faculty Info:** *'Dr. Raj Kumar Gupta'* or *'Dr. Prashant Rana office'*\n"
                    "• **Dispensary:** *'Dispensary hours'* or *'Emergency medical'*\n"
                    "• **Campus Map:** Click the 🗺️ icon in the input bar for navigation."
                ),
            }

        # ---------------- CAFETERIA MENU ----------------
        elif intent == "cafeteria_menu":
            cafe_query = entities.get("cafeteria") or trimmed
            cafe = cafeteria_service.find_cafeteria(cafe_query)

            if not cafe:
                all_cafes_str = "\n".join([f"• **{c}**" for c in cafeteria_service.list_all_cafes()])
                return {
                    "type": "simple_message",
                    "response": (
                        "🍔 **Campus Cafeterias & Outlets:**\n\n"
                        + all_cafes_str
                        + "\n\n*Type the name of any cafe above (e.g. 'Pizza Nation' or 'Nescafe') to view its menu and payment QR code.*"
                    ),
                }

            return {
                "type": "cafeteria_info",
                "data": {
                    "name": cafe["name"],
                    "menuImageUrl": cafe["menuImageUrl"],
                    "scannerImageUrl": cafe.get("scannerImageUrl") or None,
                },
            }

        # ---------------- TIMETABLE ----------------
        elif intent == "timetable_info":
            section = entities.get("section")
            day = entities.get("day")

            if not section:
                return {
                    "type": "simple_message",
                    "response": (
                        "📅 **Please provide your Batch / Section code.**\n\nExamples:\n"
                        "• *'2C24 schedule'*\n"
                        "• *'1A11 timetable Monday'*\n"
                        "• *'COE21 timetable'*\n"
                        "• *'3C24'*"
                    ),
                }

            result = timetable_service.get_schedule_for_batch(section, day)
            if "error" in result:
                return {
                    "type": "simple_message",
                    "response": result["error"],
                }

            return {
                "type": "timetable_display",
                "data": {
                    "title": result["title"],
                    "schedule": result["schedule"],
                },
            }

        # ---------------- SUBJECT INFO ----------------
        elif intent == "subject_info":
            query = entities.get("subject") or trimmed
            subject = subject_service.find_subject(query)

            if not subject:
                return {
                    "type": "simple_message",
                    "response": f'Sorry, I couldn\'t find course details for "{query}". Please check the subject code (e.g. UCS312, UCS301, UCS303, UMA010).',
                }

            return {
                "type": "subject_info",
                "data": subject,
            }

        # ---------------- CERTIFICATE INFO ----------------
        elif intent == "certificate_info":
            reply = certificate_service.find_certificate_info(trimmed)
            if not reply:
                return {
                    "type": "simple_message",
                    "response": "Sorry, I couldn't find certificate information related to your query. Please specify if you need SC/ST/BC certificate, Gap affidavit, NRI sponsorship, or Medical format.",
                }
            return {"type": "simple_message", "response": reply}

        # ---------------- DOAA INFO ----------------
        elif intent == "doaa_info":
            reply = doaa_service.find_doaa_procedure(trimmed)
            if not reply:
                return {
                    "type": "simple_message",
                    "response": "Sorry, I couldn't find a matching DoAA academic procedure. You can ask about **Group Change**, **Add/Drop Subject**, **Elective Change**, **Fee Delay**, **Make-up MST**, or **Bonafide Certificate**.",
                }
            return {"type": "simple_message", "response": reply}

        # ---------------- DISPENSARY INFO ----------------
        elif intent == "dispensary_info":
            return {
                "type": "dispensary_info",
                "data": get_dispensary_info(),
            }

        # ---------------- FACULTY INFO ----------------
        elif intent == "faculty_info":
            raw_name = normalize_faculty_entity(entities, trimmed)

            if not raw_name:
                return {
                    "type": "simple_message",
                    "response": "Please provide the faculty member's name (e.g. *'Dr. Raj Kumar Gupta'* or *'Dr. Prashant Rana'*).",
                }

            name = clean_faculty_name(raw_name)

            # Sanity Check: If query actually matches a Subject code
            subject_match = subject_service.find_subject(name)
            if subject_match:
                return {
                    "type": "subject_info",
                    "data": subject_match,
                }

            # Sanity Check: If query matches DOAA procedure
            doaa_match = doaa_service.find_doaa_procedure(trimmed)
            if doaa_match and not name:
                return {
                    "type": "simple_message",
                    "response": doaa_match,
                }

            results = await faculty_service.search_faculty(name or raw_name)

            if not results:
                return {
                    "type": "simple_message",
                    "response": f'I couldn\'t find any faculty matching "{raw_name}". Try searching with first/last name or department (e.g. Dr. Bhatia, Dr. Seema, Dr. Rana).',
                }

            return {
                "type": "faculty_info",
                "data": results,
            }

        # ---------------- DEFAULT / FALLBACK ----------------
        else:
            # Try DOAA fallback
            doaa_check = doaa_service.find_doaa_procedure(trimmed)
            if doaa_check:
                return {"type": "simple_message", "response": doaa_check}

            # Try Certificate fallback
            cert_check = certificate_service.find_certificate_info(trimmed)
            if cert_check:
                return {"type": "simple_message", "response": cert_check}

            # Try Cafeteria fallback
            cafe_check = cafeteria_service.find_cafeteria(trimmed)
            if cafe_check:
                return {
                    "type": "cafeteria_info",
                    "data": {
                        "name": cafe_check["name"],
                        "menuImageUrl": cafe_check["menuImageUrl"],
                        "scannerImageUrl": cafe_check.get("scannerImageUrl") or None,
                    },
                }

            return {
                "type": "simple_message",
                "response": (
                    "I'm not sure I understood that completely. Here are some things you can ask:\n\n"
                    "• **Timetables:** *'2C24 schedule'*\n"
                    "• **Cafeteria:** *'Pizza Nation menu'* or *'Show cafes'*\n"
                    "• **Subjects:** *'UCS312'* or *'Data Structures'*\n"
                    "• **Academic Procedures:** *'How to change section?'*, *'How to drop subject?'*\n"
                    "• **Certificates:** *'Bonafide certificate'*, *'Gap affidavit'*\n"
                    "• **Faculty:** *'Dr. Raj Kumar Gupta'* or *'Dr. Prashant Rana'*\n"
                    "• **Dispensary:** *'Dispensary hours'*"
                ),
            }

    except Exception as error:
        print(f"❌ Chat route error: {error}")
        return JSONResponse(status_code=500, content={"error": "Internal server error"})
