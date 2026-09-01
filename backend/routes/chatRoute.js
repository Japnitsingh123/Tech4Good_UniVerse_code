// backend/routes/chatRoute.js
import express from "express";
import { analyzeMessage } from "../nlp/geminiNLP.js";

import * as timetableService from "../services/timetableService.js";
import * as cafeteriaService from "../services/cafeteriaService.js";
import * as subjectService from "../services/subjectService.js";
import * as certificateService from "../services/certificateService.js";
import * as doaaService from "../services/doaaService.js";
import * as facultyService from "../services/facultyService.js";
import { getDispensaryInfo } from "../services/dispensaryService.js";

const router = express.Router();

function cleanFacultyName(input) {
  if (!input) return "";
  return input
    .toLowerCase()
    .replace(
      /\b(tell|details|detail|faculty|information|info|about|for|give|show|show me|find|office|email|profile|who is|dr|prof|professor|teacher|sir|madam)\.?\b/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeFacultyEntity(entities, message) {
  const candidates = [
    entities?.faculty_name,
    entities?.person_name,
    entities?.name,
    entities?.query,
    entities?.faculty,
    entities?.person,
  ];

  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) return c.trim();
  }

  const trimmed = message?.trim();
  if (trimmed && trimmed.split(/\s+/).length <= 4) return trimmed;

  return null;
}

router.get("/doaa-procedures", (req, res) => {
  res.json(doaaService.doaaProcedures);
});

/* ---------------------------------------------------
   CHAT ROUTE
---------------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.json({
        type: "simple_message",
        response: "Hello! How can I assist you with campus information today?",
      });
    }

    const { intent, entities } = await analyzeMessage(message);

    console.log(`\n💬 Received Query: "${message}"`);
    console.log(`🔍 Detected Intent: ${intent}`, entities);

    switch (intent) {
      /* ---------------------------------------------------
         GREETING
      ---------------------------------------------------- */
      case "greeting": {
        return res.json({
          type: "simple_message",
          response:
            "👋 **Hello! I'm CampusGPT, your AI campus assistant.**\n\nHere are things you can ask me:\n" +
            "• **Timetables:** *'2C24 schedule'* or *'1A11 timetable for Tuesday'*\n" +
            "• **Cafeteria & Menus:** *'Pizza Nation menu'* or *'Nescafe'* or *'Jaggi juice'*\n" +
            "• **Subjects & Syllabus:** *'UCS312'* or *'Operating Systems credits'*\n" +
            "• **Academic Procedures:** *'How to change group?'*, *'How to drop subject?'*, *'Makeup MST'*\n" +
            "• **Certificates:** *'SC certificate format'*, *'Gap year affidavit'*, *'Income certificate'*\n" +
            "• **Faculty Info:** *'Dr. Raj Kumar Gupta'* or *'Dr. Prashant Rana office'*\n" +
            "• **Dispensary:** *'Dispensary hours'* or *'Emergency medical'*\n" +
            "• **Campus Map:** Click the 🗺️ icon in the input bar for navigation.",
        });
      }

      /* ---------------------------------------------------
         CAFETERIA MENU
      ---------------------------------------------------- */
      case "cafeteria_menu": {
        const cafeQuery = entities.cafeteria || message;
        const cafe = cafeteriaService.findCafeteria(cafeQuery);

        if (!cafe) {
          return res.json({
            type: "simple_message",
            response:
              "🍔 **Campus Cafeterias & Outlets:**\n\n" +
              cafeteriaService
                .listAllCafes()
                .map((c) => `• **${c}**`)
                .join("\n") +
              "\n\n*Type the name of any cafe above (e.g. 'Pizza Nation' or 'Nescafe') to view its menu and payment QR code.*",
          });
        }

        return res.json({
          type: "cafeteria_info",
          data: {
            name: cafe.name,
            menuImageUrl: cafe.menuImageUrl,
            scannerImageUrl: cafe.scannerImageUrl || null,
          },
        });
      }

      /* ---------------------------------------------------
         TIMETABLE
      ---------------------------------------------------- */
      case "timetable_info": {
        const section = entities.section;
        const day = entities.day || null;

        if (!section) {
          return res.json({
            type: "simple_message",
            response:
              "📅 **Please provide your Batch / Section code.**\n\nExamples:\n• *'2C24 schedule'*\n• *'1A11 timetable Monday'*\n• *'COE21 timetable'*\n• *'3C24'*",
          });
        }

        const result = timetableService.getScheduleForBatch(section, day);
        if (result.error) {
          return res.json({
            type: "simple_message",
            response: result.error,
          });
        }

        return res.json({
          type: "timetable_display",
          data: {
            title: result.title,
            schedule: result.schedule,
          },
        });
      }

      /* ---------------------------------------------------
         SUBJECT INFO
      ---------------------------------------------------- */
      case "subject_info": {
        const query = entities.subject || message;
        const subject = subjectService.findSubject(query);

        if (!subject) {
          return res.json({
            type: "simple_message",
            response: `Sorry, I couldn't find course details for "${query}". Please check the subject code (e.g. UCS312, UCS301, UCS303, UMA010).`,
          });
        }

        return res.json({
          type: "subject_info",
          data: subject,
        });
      }

      /* ---------------------------------------------------
         CERTIFICATE INFO
      ---------------------------------------------------- */
      case "certificate_info": {
        const reply = certificateService.findCertificateInfo(message);
        if (!reply) {
          return res.json({
            type: "simple_message",
            response:
              "Sorry, I couldn't find certificate information related to your query. Please specify if you need SC/ST/BC certificate, Gap affidavit, NRI sponsorship, or Medical format.",
          });
        }
        return res.json({ type: "simple_message", response: reply });
      }

      /* ---------------------------------------------------
         DOAA INFO
      ---------------------------------------------------- */
      case "doaa_info": {
        const reply = doaaService.findDoaaProcedure(message);
        if (!reply) {
          return res.json({
            type: "simple_message",
            response:
              "Sorry, I couldn't find a matching DoAA academic procedure. You can ask about **Group Change**, **Add/Drop Subject**, **Elective Change**, **Fee Delay**, **Make-up MST**, or **Bonafide Certificate**.",
          });
        }
        return res.json({ type: "simple_message", response: reply });
      }

      /* ---------------------------------------------------
         DISPENSARY INFO
      ---------------------------------------------------- */
      case "dispensary_info": {
        return res.json({
          type: "dispensary_info",
          data: getDispensaryInfo(),
        });
      }

      /* ---------------------------------------------------
         FACULTY INFO
      ---------------------------------------------------- */
      case "faculty_info": {
        let rawName = normalizeFacultyEntity(entities, message);

        if (!rawName) {
          return res.json({
            type: "simple_message",
            response:
              "Please provide the faculty member's name (e.g. *'Dr. Raj Kumar Gupta'* or *'Dr. Prashant Rana'*).",
          });
        }

        const name = cleanFacultyName(rawName);

        // Sanity Check: If query actually matches a Subject code
        const subjectMatch = subjectService.findSubject(name);
        if (subjectMatch) {
          return res.json({
            type: "subject_info",
            data: subjectMatch,
          });
        }

        // Sanity Check: If query matches DOAA procedure
        const doaaMatch = doaaService.findDoaaProcedure(message);
        if (doaaMatch && !name) {
          return res.json({
            type: "simple_message",
            response: doaaMatch,
          });
        }

        const results = await facultyService.searchFaculty(name || rawName);

        if (!results || results.length === 0) {
          return res.json({
            type: "simple_message",
            response: `I couldn't find any faculty matching "${rawName}". Try searching with first/last name or department (e.g. Dr. Bhatia, Dr. Seema, Dr. Rana).`,
          });
        }

        return res.json({
          type: "faculty_info",
          data: results,
        });
      }

      /* ---------------------------------------------------
         DEFAULT / GENERAL QUERY FALLBACK
      ---------------------------------------------------- */
      default: {
        // Try DOAA fallback first
        const doaaCheck = doaaService.findDoaaProcedure(message);
        if (doaaCheck) {
          return res.json({ type: "simple_message", response: doaaCheck });
        }

        // Try Certificate fallback
        const certCheck = certificateService.findCertificateInfo(message);
        if (certCheck) {
          return res.json({ type: "simple_message", response: certCheck });
        }

        // Try Cafeteria fallback
        const cafeCheck = cafeteriaService.findCafeteria(message);
        if (cafeCheck) {
          return res.json({
            type: "cafeteria_info",
            data: {
              name: cafeCheck.name,
              menuImageUrl: cafeCheck.menuImageUrl,
              scannerImageUrl: cafeCheck.scannerImageUrl || null,
            },
          });
        }

        return res.json({
          type: "simple_message",
          response:
            "I'm not sure I understood that completely. Here are some things you can ask:\n\n" +
            "• **Timetables:** *'2C24 schedule'*\n" +
            "• **Cafeteria:** *'Pizza Nation menu'* or *'Show cafes'*\n" +
            "• **Subjects:** *'UCS312'* or *'Data Structures'* \n" +
            "• **Academic Procedures:** *'How to change section?'*, *'How to drop subject?'*\n" +
            "• **Certificates:** *'Bonafide certificate'*, *'Gap affidavit'*\n" +
            "• **Faculty:** *'Dr. Raj Kumar Gupta'* or *'Dr. Prashant Rana'*\n" +
            "• **Dispensary:** *'Dispensary hours'*",
        });
      }
    }
  } catch (error) {
    console.error("❌ Chat route error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
