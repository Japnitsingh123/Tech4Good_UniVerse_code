import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are an NLP engine for a University Campus Assistant.
Output ONLY JSON: {"intent":"...","entities":{...}}

INTENTS:
- timetable_info
- cafeteria_menu
- subject_info
- certificate_info
- doaa_info
- dispensary_info
- faculty_info
- general_query

RULES:
When user asks for faculty details:
- Extract only the faculty name, not the whole sentence.
- Remove words like "tell", "details", "faculty", "information", "about".

1. If message contains a section code → timetable_info
2. If cafeteria keyword appears → cafeteria_menu
3. If subject code or subject-related keywords → subject_info
4. Certificate keywords → certificate_info
5. DOAA keywords → doaa_info
6. Dispensary keywords → dispensary_info
7. Faculty-related keywords OR message looks like a human name → faculty_info
8. Else → general_query

Respond ONLY JSON.
`;

// ---------------------------------------------
// CONSTANT KEYWORDS
// ---------------------------------------------

const CAFE_KEYWORDS = [
  "pizza nation",
  "dessert club",
  "chilli chatkara",
  "g block",
  "g-block",
  "jaggi samosa",
  "jaggi juice",
  "sips and bite",
  "cos all shops",
  ,
  "tslas back canteen",
  "nascafe",
  "nescafe",
  "campus bite",
  "bite",
  "campusbite",
  "Amritsari naan",
  "Aahar",
  "ahaar",
  "cold coffee",
  "academic calander",
];

const CERTIFICATE_KEYWORDS = [
  "certificate",
  "affidavit",
  "obc",
  "backward class",
  "gap",
  "income",
  "nri",
  "sponsor",
  "residency",
  "undertaking",
  "drug abuse",
  "anti drug",
  "anti alcohol",
  "punjab",
  "principal certificate",
  "st certificate",
  "sc certificate",
  "NRI",
  "nri",
  "ANTI_DRUG_PARENT",
  ,
  "what is  certificate",
];

const DISPENSARY_KEYWORDS = [
  "dispensary",
  "medical",
  "doctor",
  "health center",
  "clinic",
  "sick",
  "injury",
  "health issue",
];

const DOAA_KEYWORDS = [
  "scholarship",
  "group change",
  "subgroup",
  "sub group",
  "change section",
  "change group",
  "switch group",
  "add subject",
  "additional subject",
  "backlog",
  "drop subject",
  "withdraw subject",
  "registration issue",
  "elective change",
  "generic elective",
  "professional elective",
  "missed filling",
  "choice filling",
  "auxiliary exam",
  "auxiliary",
  "makeup test",
  "mst",
  "absence",
  "attendance",
  "semester drop",
  "noc",
  "visa",
  "bonafide",
  "migration",
  "drop",
  "detention",
  "attendence",
  "phd",
  "Absence",
  "room book",
  "booking",
  "book",
  "PHD",
  "Hostel",
  "CGPA",
  "nri certificate",
];

const SUBJECT_NAME_KEYWORDS = [
  "subject",
  "syllabus",
  "topics",
  "course",
  "explain",
  "details of subject",
  "what is",
  "explain subject",
];

const FACULTY_KEYWORDS = [
  "faculty",
  "professor",
  "teacher",
  "who teaches",
  "sir",
  "madam",
  "hod",
  "head of department",
  "dr",
  "mr ",
  "ms ",
  "mrs ",
];

// ---------------------------------------------
// NLP FUNCTION
// ---------------------------------------------

export async function analyzeMessage(message) {
  const lower = message.toLowerCase();
  let parsed = { intent: "general_query", entities: {} };

  // --------------------------- GEMINI PASS ---------------------------
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-09-2025",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT + "\nUser: " + message }],
        },
      ],
    });

    let text = result.response.text().trim();
    text = text
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    try {
      parsed = JSON.parse(text);
      if (!parsed.entities) parsed.entities = {};
    } catch {}
  } catch {}

  // ---------------------------------------------
  // 1️⃣ TIMETABLE
  // ---------------------------------------------
  const secMatch = message.match(/\b[1-4][A-Za-z]{1,5}[0-9]{1,2}\b/);
  if (secMatch) {
    parsed.intent = "timetable_info";
    parsed.entities.section = secMatch[0].toUpperCase();
    return parsed;
  }

  // ---------------------------------------------
  // 2️⃣ CAFETERIA
  // ---------------------------------------------
  if (CAFE_KEYWORDS.some((k) => lower.includes(k))) {
    parsed.intent = "cafeteria_menu";
    parsed.entities.cafeteria = CAFE_KEYWORDS.find((k) => lower.includes(k));
    return parsed;
  }

  // ---------------------------------------------
  // 3️⃣ DOAA
  // ---------------------------------------------
  if (DOAA_KEYWORDS.some((k) => lower.includes(k))) {
    parsed.intent = "doaa_info";
    parsed.entities.query = message;
    return parsed;
  }

  // ---------------------------------------------
  // 4️⃣ SUBJECT CODE
  // ---------------------------------------------
  const subjectCode = message.match(/[A-Z]{2,4}\d{3}/i);
  if (subjectCode) {
    parsed.intent = "subject_info";
    parsed.entities.subject = subjectCode[0].toUpperCase();
    return parsed;
  }

  // SUBJECT (NATURAL LANGUAGE)
  if (SUBJECT_NAME_KEYWORDS.some((k) => lower.includes(k))) {
    parsed.intent = "subject_info";
    parsed.entities.subject = message;
    return parsed;
  }

  // ---------------------------------------------
  // 5️⃣ CERTIFICATE
  // ---------------------------------------------
  if (CERTIFICATE_KEYWORDS.some((k) => lower.includes(k))) {
    parsed.intent = "certificate_info";
    return parsed;
  }

  // ---------------------------------------------
  // 6️⃣ DISPENSARY
  // ---------------------------------------------
  if (DISPENSARY_KEYWORDS.some((k) => lower.includes(k))) {
    parsed.intent = "dispensary_info";
    return parsed;
  }

  // ---------------------------------------------
  // 7️⃣ FACULTY DETECTION (HUMAN NAME + KEYWORDS)
  // ---------------------------------------------

  // Detect if message looks like a human name: (e.g. "Prashant Rana", "Dr Prashant Rana")
  const isHumanName = /^[a-zA-Z\.]+\s+[a-zA-Z]+(\s+[a-zA-Z]+)?$/.test(
    message.trim()
  );

  const facultyKeywordHit = FACULTY_KEYWORDS.some((k) => lower.includes(k));

  if (isHumanName || facultyKeywordHit) {
    let extracted = message
      .replace(
        /who teaches|faculty|professor|teacher|sir|madam|hod|head of department/gi,
        ""
      )
      .replace(/details of|tell me about|give info|information about/gi, "")
      .replace(/dr\.?/gi, "")
      .replace(/mr\.?/gi, "")
      .replace(/ms\.?/gi, "")
      .replace(/mrs\.?/gi, "")
      .trim();

    parsed.intent = "faculty_info";
    parsed.entities.faculty_name = extracted || message.trim();
    return parsed;
  }

  return parsed;
}
