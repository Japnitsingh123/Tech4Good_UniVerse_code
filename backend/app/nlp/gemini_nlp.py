import os
import re
import json
from typing import Dict, Any

SYSTEM_PROMPT = """
You are an NLP engine for a University Campus Assistant (Thapar University CampusGPT).
Output ONLY valid JSON in format: {"intent":"...","entities":{...}}

INTENTS:
- greeting
- timetable_info
- cafeteria_menu
- subject_info
- certificate_info
- doaa_info
- dispensary_info
- faculty_info
- general_query

RULES:
1. If user greets (hi, hello, hey, who are you, help) -> "greeting"
2. If subject code (UCS312, UCS301, UMA010) or subject/syllabus/course inquiry -> "subject_info" (extract entity: "subject")
3. If message contains a section/batch code (e.g. 1A11, 2C24, COE21) or asks for class schedule -> "timetable_info" (extract entities: "section", "day")
4. If cafeteria/canteen/food/menu/shop mentioned -> "cafeteria_menu" (extract entity: "cafeteria")
5. If certificate/affidavit/undertaking/quota mentioned -> "certificate_info"
6. If academic procedures (group change, add/drop subject, elective change, fee delay, auxiliary exam, makeup mst, attendance shortage, detention, bonafide, hostel booking) -> "doaa_info"
7. If doctor, health center, medical, dispensary, sick -> "dispensary_info"
8. If faculty/professor/teacher name inquiry -> "faculty_info" (extract entity: "faculty_name" containing ONLY the name)
9. Else -> "general_query"

Output ONLY raw JSON.
"""

CAFE_KEYWORDS = [
    "pizza nation", "dessert club", "chilli chitkara", "chilli chatkara",
    "g block", "g-block", "jaggi samosa", "jaggi juice", "sips and bite",
    "sips and bites", "cos all shops", "cos shops", "tslas back canteen",
    "tslas canteen", "nascafe", "nescafe", "campus bite", "campusbite",
    "amritsari naan", "amritsari kulcha", "aahar", "ahaar", "cold coffee",
    "academic calendar", "academic calander", "canteen", "cafeteria",
    "cafes", "food", "snack", "juice", "samosa", "pizza"
]

CERTIFICATE_KEYWORDS = [
    "certificate", "affidavit", "obc", "backward class", "gap period",
    "gap year", "income certificate", "nri sponsorship", "nri affidavit",
    "punjab residency", "punjab quota", "undertaking", "drug abuse",
    "anti drug", "anti alcohol", "principal certificate", "st certificate",
    "sc certificate", "caste certificate", "domicile", "medical certificate"
]

DISPENSARY_KEYWORDS = [
    "dispensary", "medical center", "doctor", "health center",
    "health clinic", "clinic", "sick", "injury", "health issue",
    "first aid", "ambulance", "medicine", "hospital"
]

DOAA_KEYWORDS = [
    "group change", "subgroup", "sub-group", "sub group", "change section",
    "change group", "switch group", "switch section", "section change",
    "add subject", "additional subject", "add course", "backlog",
    "backlog registration", "drop subject", "withdraw subject",
    "remove subject", "drop course", "registration issue", "elective change",
    "generic elective", "free elective", "professional elective",
    "missed filling", "choice filling", "auxiliary exam", "auxiliary",
    "makeup test", "make-up test", "missed mst", "absence", "attendance",
    "attendence", "shortage", "detention", "semester drop", "drop semester",
    "bonafide", "migration", "hostel room", "room booking", "fee delay",
    "scholarship", "doaa"
]

GREETING_KEYWORDS = [
    "hi", "hello", "hey", "greetings", "good morning", "good afternoon",
    "good evening", "who are you", "what can you do", "help", "commands"
]

DAYS = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
]

# Configure Gemini AI if key exists
_genai_model = None
gemini_key = os.getenv("GEMINI_API_KEY")
if gemini_key:
    try:
        import google.generativeai as genai
        genai.configure(api_key=gemini_key)
        _genai_model = genai.GenerativeModel("gemini-1.5-flash")
    except Exception as e:
        print(f"⚠️ GoogleGenerativeAI init warning: {e}")

async def analyze_message(message: str) -> Dict[str, Any]:
    if not message or not isinstance(message, str):
        return {"intent": "general_query", "entities": {}}

    trimmed = message.strip()
    lower = trimmed.lower()
    parsed: Dict[str, Any] = {"intent": "general_query", "entities": {}}

    # 1. GEMINI LLM PASS (if API key configured)
    if _genai_model:
        try:
            response = _genai_model.generate_content(f"{SYSTEM_PROMPT}\nUser: {trimmed}")
            text = response.text.strip()
            text = re.sub(r"```(json)?", "", text, flags=re.IGNORECASE).strip()
            json_parsed = json.loads(text)
            if json_parsed and json_parsed.get("intent"):
                parsed = json_parsed
                if "entities" not in parsed or not isinstance(parsed["entities"], dict):
                    parsed["entities"] = {}
                if parsed["intent"] != "general_query":
                    return parsed
        except Exception:
            pass

    # 2. DETERMINISTIC RULE-BASED NLP

    # A. GREETING
    if any(lower == g or lower.startswith(g + " ") for g in GREETING_KEYWORDS):
        return {"intent": "greeting", "entities": {}}

    # B. SUBJECT CODE (e.g. UCS312, UMA010, UEE001)
    subject_code_match = re.search(r"\b([A-Za-z]{3}\d{3})\b", trimmed)
    if subject_code_match:
        return {
            "intent": "subject_info",
            "entities": {"subject": subject_code_match.group(1).upper()}
        }

    # C. DOAA PROCEDURES
    if any(k in lower for k in DOAA_KEYWORDS):
        return {
            "intent": "doaa_info",
            "entities": {"query": trimmed}
        }

    # D. TIMETABLE
    batch_regex = r"\b([1-4][A-Za-z]{1,2}[0-9]{1,2}|COE[0-9]{1,2}|ENC[0-9]{1,2}|G[0-9]{1,2})\b"
    batch_match = re.search(batch_regex, trimmed, re.IGNORECASE)
    day_match = next((d for d in DAYS if d in lower), None)

    if batch_match and (
        "timetable" in lower
        or "schedule" in lower
        or "class" in lower
        or len(trimmed.split()) <= 4
    ):
        entities = {"section": re.sub(r"\s+", "", batch_match.group(1).upper())}
        if day_match:
            entities["day"] = day_match
        return {"intent": "timetable_info", "entities": entities}

    if "timetable" in lower or "class schedule" in lower or "schedule today" in lower:
        entities = {}
        if batch_match:
            entities["section"] = batch_match.group(1).upper()
        if day_match:
            entities["day"] = day_match
        return {"intent": "timetable_info", "entities": entities}

    # E. CAFETERIA
    matched_cafe_kw = next((k for k in CAFE_KEYWORDS if k in lower), None)
    if matched_cafe_kw:
        entities = {}
        if matched_cafe_kw not in ["canteen", "cafeteria", "cafes", "food", "snack", "menu"]:
            entities["cafeteria"] = matched_cafe_kw
        return {"intent": "cafeteria_menu", "entities": entities}

    # F. SUBJECT BY NAME
    subject_name_keywords = [
        "subject", "syllabus", "credits", "credit", "course details",
        "database management", "data structures", "operating systems",
        "computer networks", "discrete math", "software engineering",
        "applied physics", "computer programming"
    ]
    if any(k in lower for k in subject_name_keywords):
        return {
            "intent": "subject_info",
            "entities": {"subject": trimmed}
        }

    # G. CERTIFICATE INFO
    if any(k in lower for k in CERTIFICATE_KEYWORDS):
        return {"intent": "certificate_info", "entities": {}}

    # H. DISPENSARY
    if any(k in lower for k in DISPENSARY_KEYWORDS):
        return {"intent": "dispensary_info", "entities": {}}

    # I. FACULTY DETECTION
    faculty_keyword_regex = r"\b(faculty|professor|prof|teacher|who teaches|who is|dr|sir|madam|hod|head of department)\b"
    is_human_name = bool(re.match(r"^(dr\.?|prof\.?|mr\.?|ms\.?)?\s*([a-zA-Z]{2,15}\s+){1,3}[a-zA-Z]{2,15}$", trimmed, re.IGNORECASE))

    if re.search(faculty_keyword_regex, lower, re.IGNORECASE) or is_human_name:
        extracted = re.sub(
            r"\b(tell|me|about|details|of|give|info|information|for|who|is|teaches|faculty|professor|prof|teacher|sir|madam|hod|head of department|dr|mr|ms|mrs)\b\.?",
            "",
            trimmed,
            flags=re.IGNORECASE
        )
        extracted = re.sub(r"^[.\s]+", "", extracted).strip()
        return {
            "intent": "faculty_info",
            "entities": {"faculty_name": extracted or trimmed}
        }

    return {"intent": "general_query", "entities": {}}
