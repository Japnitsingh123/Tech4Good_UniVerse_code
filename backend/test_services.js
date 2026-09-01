// backend/test_services.js
import { analyzeMessage } from "./nlp/geminiNLP.js";
import * as timetableService from "./services/timetableService.js";
import * as cafeteriaService from "./services/cafeteriaService.js";
import * as subjectService from "./services/subjectService.js";
import * as certificateService from "./services/certificateService.js";
import * as doaaService from "./services/doaaService.js";
import * as facultyService from "./services/facultyService.js";
import { getDispensaryInfo } from "./services/dispensaryService.js";

// Load data
timetableService.loadTimetableData();
subjectService.loadSubjectData();

const testQueries = [
  "hello",
  "what is the timetable for 2C24?",
  "1A11 timetable for Tuesday",
  "tell me about UCS312",
  "operating systems credits",
  "pizza nation menu",
  "show me all cafeterias",
  "how to change group",
  "how to drop subject",
  "makeup test for missed mst",
  "sc certificate",
  "gap year affidavit",
  "dispensary timing",
  "Dr. Raj Kumar Gupta",
  "Dr. Prashant Rana office",
  "Dr. S.S. Bhatia",
];

async function runTests() {
  console.log("====================================");
  console.log("RUNNING BACKEND INTENT & SERVICE TESTS");
  console.log("====================================\n");

  for (const q of testQueries) {
    const analysis = await analyzeMessage(q);
    console.log(`\n------------------------------------`);
    console.log(`Query: "${q}"`);
    console.log(`Intent: ${analysis.intent}`, analysis.entities);

    let answer = null;
    switch (analysis.intent) {
      case "greeting":
        answer = "Greeting response OK";
        break;
      case "timetable_info":
        answer = timetableService.getScheduleForBatch(analysis.entities.section, analysis.entities.day);
        break;
      case "cafeteria_menu":
        answer = cafeteriaService.findCafeteria(analysis.entities.cafeteria || q);
        break;
      case "subject_info":
        answer = subjectService.findSubject(analysis.entities.subject || q);
        break;
      case "doaa_info":
        answer = doaaService.findDoaaProcedure(q);
        break;
      case "certificate_info":
        answer = certificateService.findCertificateInfo(q);
        break;
      case "dispensary_info":
        answer = getDispensaryInfo();
        break;
      case "faculty_info":
        answer = await facultyService.searchFaculty(analysis.entities.faculty_name || q);
        break;
      default:
        answer = "Default fallback";
    }

    const success = answer !== null && !answer.error;
    console.log(`Result Found: ${success ? "✅ SUCCESS" : "⚠️ CHECK"}`);
    if (answer) {
      if (typeof answer === "string") console.log(`Output: ${answer.slice(0, 120)}...`);
      else if (Array.isArray(answer)) console.log(`Output: Array with ${answer.length} items`);
      else console.log(`Output: Object with keys [${Object.keys(answer).join(", ")}]`);
    }
  }

  console.log("\n====================================");
  console.log("ALL TESTS COMPLETED");
  console.log("====================================");
}

runTests();
