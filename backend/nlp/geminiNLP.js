// backend/nlp/geminiNLP.js
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (e) {
    console.warn("⚠️ GoogleGenerativeAI init warning:", e.message);
  }
}

const SYSTEM_PROMPT = `
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
`;

const CAFE_KEYWORDS = [
  "pizza nation",
  "dessert club",
  "chilli chitkara",
  "chilli chatkara",
  "g block",
  "g-block",
  "jaggi samosa",
  "jaggi juice",
  "sips and bite",
  "sips and bites",
  "cos all shops",
  "cos shops",
  "tslas back canteen",
  "tslas canteen",
  "nascafe",
  "nescafe",
  "campus bite",
  "campusbite",
  "amritsari naan",
  "amritsari kulcha",
  "aahar",
  "ahaar",
  "cold coffee",
  "academic calendar",
  "academic calander",
  "canteen",
  "cafeteria",
  "cafes",
  "food",
  "snack",
  "juice",
  "samosa",
  "pizza",
];

const CERTIFICATE_KEYWORDS = [
  "certificate",
  "affidavit",
  "obc",
  "backward class",
  "gap period",
  "gap year",
  "income certificate",
  "nri sponsorship",
  "nri affidavit",
  "punjab residency",
  "punjab quota",
  "undertaking",
  "drug abuse",
  "anti drug",
  "anti alcohol",
  "principal certificate",
  "st certificate",
  "sc certificate",
  "caste certificate",
  "domicile",
  "medical certificate",
];

const DISPENSARY_KEYWORDS = [
  "dispensary",
  "medical center",
  "doctor",
  "health center",
  "health clinic",
  "clinic",
  "sick",
  "injury",
  "health issue",
  "first aid",
  "ambulance",
  "medicine",
  "hospital",
];

const DOAA_KEYWORDS = [
  "group change",
  "subgroup",
  "sub-group",
  "sub group",
  "change section",
  "change group",
  "switch group",
  "switch section",
  "section change",
  "add subject",
  "additional subject",
  "add course",
  "backlog",
  "backlog registration",
  "drop subject",
  "withdraw subject",
  "remove subject",
  "drop course",
  "registration issue",
  "elective change",
  "generic elective",
  "free elective",
  "professional elective",
  "missed filling",
  "choice filling",
  "auxiliary exam",
  "auxiliary",
  "makeup test",
  "make-up test",
  "missed mst",
  "absence",
  "attendance",
  "attendence",
  "shortage",
  "detention",
  "semester drop",
  "drop semester",
  "bonafide",
  "migration",
  "hostel room",
  "room booking",
  "fee delay",
  "scholarship",
  "doaa",
];

const GREETING_KEYWORDS = [
  "hi",
  "hello",
  "hey",
  "greetings",
  "good morning",
  "good afternoon",
  "good evening",
  "who are you",
  "what can you do",
  "help",
  "commands",
];

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export async function analyzeMessage(message) {
  if (!message || typeof message !== "string") {
    return { intent: "general_query", entities: {} };
  }

  const trimmed = message.trim();
  const lower = trimmed.toLowerCase();
  let parsed = { intent: "general_query", entities: {} };

  // --------------------------- 1. GEMINI LLM PASS ---------------------------
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT + "\nUser: " + trimmed }],
          },
        ],
      });

      let text = result.response.text().trim();
      text = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const jsonParsed = JSON.parse(text);
      if (jsonParsed && jsonParsed.intent) {
        parsed = jsonParsed;
        if (!parsed.entities) parsed.entities = {};
        if (parsed.intent !== "general_query") {
          return parsed;
        }
      }
    } catch (e) {}
  }

  // --------------------------- 2. DETERMINISTIC RULE-BASED NLP ---------------------------

  // A. GREETING
  if (GREETING_KEYWORDS.some((g) => lower === g || lower.startsWith(g + " "))) {
    parsed.intent = "greeting";
    return parsed;
  }

  // B. SUBJECT CODE CHECK (High priority: 3 letters + 3 digits, e.g. UCS312, UMA010, UEE001)
  const subjectCodeMatch = trimmed.match(/\b([A-Za-z]{3}\d{3})\b/i);
  if (subjectCodeMatch) {
    parsed.intent = "subject_info";
    parsed.entities.subject = subjectCodeMatch[0].toUpperCase();
    return parsed;
  }

  // C. DOAA PROCEDURES (High priority academic procedures)
  if (DOAA_KEYWORDS.some((k) => lower.includes(k))) {
    parsed.intent = "doaa_info";
    parsed.entities.query = trimmed;
    return parsed;
  }

  // D. TIMETABLE
  // Match batch code pattern: 1A11, 2C24, 3C24, COE1, COE21, ENC1, G1
  const batchRegex = /\b([1-4][A-Za-z]{1,2}[0-9]{1,2}|COE[0-9]{1,2}|ENC[0-9]{1,2}|G[0-9]{1,2})\b/i;
  const batchMatch = trimmed.match(batchRegex);
  const dayMatch = DAYS.find((d) => lower.includes(d));

  if (batchMatch && (lower.includes("timetable") || lower.includes("schedule") || lower.includes("class") || lower.split(/\s+/).length <= 4)) {
    parsed.intent = "timetable_info";
    parsed.entities.section = batchMatch[0].toUpperCase().replace(/\s+/g, "");
    if (dayMatch) parsed.entities.day = dayMatch;
    return parsed;
  }

  if (lower.includes("timetable") || lower.includes("class schedule") || lower.includes("schedule today")) {
    parsed.intent = "timetable_info";
    if (batchMatch) parsed.entities.section = batchMatch[0].toUpperCase();
    if (dayMatch) parsed.entities.day = dayMatch;
    return parsed;
  }

  // E. CAFETERIA
  if (CAFE_KEYWORDS.some((k) => lower.includes(k))) {
    parsed.intent = "cafeteria_menu";
    const matchedCafe = CAFE_KEYWORDS.find((k) => lower.includes(k));
    if (matchedCafe && !["canteen", "cafeteria", "cafes", "food", "snack", "menu"].includes(matchedCafe)) {
      parsed.entities.cafeteria = matchedCafe;
    }
    return parsed;
  }

  // F. SUBJECT BY NAME
  if (
    lower.includes("subject") ||
    lower.includes("syllabus") ||
    lower.includes("credits") ||
    lower.includes("credit") ||
    lower.includes("course details") ||
    lower.includes("database management") ||
    lower.includes("data structures") ||
    lower.includes("operating systems") ||
    lower.includes("computer networks") ||
    lower.includes("discrete math") ||
    lower.includes("software engineering") ||
    lower.includes("applied physics") ||
    lower.includes("computer programming")
  ) {
    parsed.intent = "subject_info";
    parsed.entities.subject = trimmed;
    return parsed;
  }

  // G. CERTIFICATE INFO
  if (CERTIFICATE_KEYWORDS.some((k) => lower.includes(k))) {
    parsed.intent = "certificate_info";
    return parsed;
  }

  // H. DISPENSARY
  if (DISPENSARY_KEYWORDS.some((k) => lower.includes(k))) {
    parsed.intent = "dispensary_info";
    return parsed;
  }

  // I. FACULTY DETECTION
  const facultyKeywordRegex = /\b(faculty|professor|prof|teacher|who teaches|who is|dr|sir|madam|hod|head of department)\b/i;
  const isHumanName = /^(dr\.?|prof\.?|mr\.?|ms\.?)?\s*([a-zA-Z]{2,15}\s+){1,3}[a-zA-Z]{2,15}$/i.test(trimmed);

  if (facultyKeywordRegex.test(lower) || isHumanName) {
    let extracted = trimmed
      .replace(/\b(tell|me|about|details|of|give|info|information|for|who|is|teaches|faculty|professor|prof|teacher|sir|madam|hod|head of department|dr|mr|ms|mrs)\b\.?/gi, "")
      .replace(/^[.\s]+/, "")
      .trim();

    parsed.intent = "faculty_info";
    parsed.entities.faculty_name = extracted || trimmed;
    return parsed;
  }

  return parsed;
}
