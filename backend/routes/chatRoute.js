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
// At the top with your other imports
import { doaaProcedures } from "../services/doaaService.js";

const router = express.Router();

/* ---------------------------------------------------
   CLEAN FACULTY NAME
---------------------------------------------------- */
function cleanFacultyName(input) {
  return input
    .toLowerCase()
    .replace(
      /\b(tell|details|detail|faculty|information|info|about|for|give|show|show me|find|office)\b/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
}

/* ---------------------------------------------------
   NORMALIZE ENTITY (pick best name field)
---------------------------------------------------- */
function normalizeFacultyEntity(entities, message) {
  const candidates = [
    entities?.faculty_name,
    entities?.person_name,
    entities?.name,
    entities?.query,
    entities?.faculty,
    entities?.person,
    entities?.personName,
  ];

  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) return c.trim();
  }

  const trimmed = message?.trim();
  if (trimmed && trimmed.split(/\s+/).length <= 4) return trimmed;

  return null;
}

router.get("/doaa-procedures", (req, res) => {
  // Just send the imported array as a JSON response
  res.json(doaaProcedures);
});
/* ---------------------------------------------------
   CHAT ROUTE
---------------------------------------------------- */

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const { intent, entities } = await analyzeMessage(message);

    console.log("Intent:", intent);
    console.log("Entities:", entities);

    switch (intent) {
      /* ---------------------------------------------------
         CAFETERIA MENU
      ---------------------------------------------------- */
      case "cafeteria_menu": {
        const cafeName = entities.cafeteria;
        if (!cafeName) {
          return res.json({
            type: "simple_message",
            response:
              "Please tell me the cafeteria name.\n\nAvailable options:\n" +
              cafeteriaService
                .listAllCafes()
                .map((c) => `• ${c}`)
                .join("\n"),
          });
        }
        const cafe = cafeteriaService.findCafeteria(cafeName);
        if (!cafe) {
          return res.json({
            type: "simple_message",
            response:
              `I couldn’t find any cafeteria named "${cafeName}".\n\n` +
              "Available options:\n" +
              cafeteriaService
                .listAllCafes()
                .map((c) => `• ${c}`)
                .join("\n"),
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
            response: "Please provide a valid section like 2C24.",
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
            response: `Sorry, I couldn't find subject information for "${query}".`,
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
              "Sorry, I couldn't find certificate information related to your query.",
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
            response: "Sorry, I couldn't find any related DoAA procedure.",
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
         FACULTY INFO (UPDATED)
      ---------------------------------------------------- */
      case "faculty_info": {
        let rawName = normalizeFacultyEntity(entities, message);

        if (!rawName) {
          return res.json({
            type: "simple_message",
            response:
              "Please provide the faculty name (e.g., 'Dr. Raj Kumar Gupta').",
          });
        }

        const name = cleanFacultyName(rawName);

        console.log("Cleaned faculty search:", name);

        /* ---------------------------------------------------------
     FIX: If the given name matches a subject → return subject
  ---------------------------------------------------------- */
        const subjectMatch = subjectService.findSubject(name);
        if (subjectMatch) {
          return res.json({
            type: "subject_info",
            data: subjectMatch,
          });
        }

        /* ---------------------------------------------------------
     Continue normal faculty search
  ---------------------------------------------------------- */
        const results = await facultyService.searchFaculty(name);

        if (!results || results.length === 0) {
          return res.json({
            type: "simple_message",
            response: `I couldn't find any faculty matching "${name}". Try a different spelling or add department/email.`,
          });
        }

        return res.json({
          type: "faculty_info",
          data: results,
        });
      }

      /* ---------------------------------------------------
         DEFAULT
      ---------------------------------------------------- */
      default:
        return res.json({
          type: "simple_message",
          response: "Sorry, I didn't understand that.",
        });
    }
  } catch (error) {
    console.error("Chat route error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
