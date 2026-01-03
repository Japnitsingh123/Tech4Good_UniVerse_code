export const doaaProcedures = [
  {
    id: 1,
    task: "Group / Sub-group Change",
    keywords: ["group", "subgroup", "sub-group", "change", "switch", "section"],
    steps:
      "1. Write an application.\n2. Mention your current group/sub-group.\n3. Give details of the group/sub-group you want to switch to.\n4. Take approval from the DoAA Office.\n5. Collect the signed application and take it to Webkiosk/SSSP Admin (Dr. SK Guleria/Mr Vinod Kumar/Mr Rupinder Singh – 1st Floor, Near Registrar Office).\nNote: Max count for a sub-group is 30. If feasible, the Admin will update Web-kiosk; otherwise, your group remains the same.",
  },
  {
    id: 2,
    task: "Add Additional Subject / Backlog Registration",
    keywords: [
      "add",
      "additional",
      "subject",
      "backlog",
      "registration",
      "register",
      "course",
    ],
    steps:
      "1. Use the form floated by DoAA Office/Academic Section (usually before semester starts).\n2. Mention details of the subject to be added.\n3. Make your current semester time table.\n4. Mention the sub-group number for each LTP component in the form.\n5. Ensure no clashes with your current time table.\n6. Get it vetted/verified by your departmental time table coordinator (they must write 'No Clashes').\n7. If no clash, pay the required fee.\n8. Get the form approved by the DoAA Office.\n9. Submit the form to the designated office mentioned in the notification.",
  },
  {
    id: 3,
    task: "Drop Subject",
    keywords: ["drop", "subject", "remove", "withdraw", "course"],
    steps:
      "1. Use the Add/Drop form floated by DoAA Office/Academic Section (usually before semester starts).\n2. Mention details of the subject to be dropped.\n3. Get the form approved by the DoAA Office.\n4. Submit the form to the designated office mentioned in the notification.",
  },
  {
    id: 4.1, // Using decimal for sub-parts
    task: "Free / Generic Elective Change/Amendment/Missed Filling",
    keywords: [
      "free",
      "generic",
      "elective",
      "change",
      "preference",
      "amendment",
      "missed",
      "choice filling",
    ],
    steps:
      "**For Changes/Amendments:**\n1. List of electives is displayed on Web-kiosk/SSSP (Contact Admin if issues).\n2. Fill choices; choices get locked.\n3. For changes: Write an application, get approval from DoAA, submit to Web-kiosk Admin (Mr Rupinder Singh).\n**If Missed Filling:**\n1. Write an application to DoAA for approval.\n2. If approved, submit the application to Web-kiosk Admin (Mr Rupinder Singh).",
  },
  {
    id: 4.2,
    task: "Professional Elective Change/Amendment/Missed Filling",
    keywords: [
      "professional",
      "elective",
      "branch",
      "department",
      "change",
      "preference",
      "amendment",
      "missed",
      "choice filling",
    ],
    steps:
      "**For Changes/Amendments:**\n1. List of electives is displayed on Web-kiosk (Contact Admin if issues).\n2. Fill choices; choices get locked.\n3. For changes: Write an application, get approval from your HoD, submit to Web-kiosk/SSSP Admin.\n**If Missed Filling:**\n1. Write an application to your HoD for approval.\n2. If approved, submit the application to Web-kiosk/SSSP Admin.",
  },
  {
    id: 5,
    task: "Fee Related Concerns / Delay Payment",
    keywords: [
      "fee",
      "fees",
      "payment",
      "finance",
      "delay",
      "loan",
      "health",
      "issue",
      "money",
    ],
    steps:
      "1. Pay fees as per Finance Section notification (on Web-kiosk/SSSP).\n2. For delays (due to Loan/Family/Health issues): Write an application, attach relevant proofs, take approval from DoAA for the delay.\n3. Submit the approved application to the Finance Section.\n4. For other concerns, contact Finance Officer (Mr Pankaj Sinha): financeofficer@thapar.edu",
  },
  {
    id: 6,
    task: "Auxiliary Examination (E to C, I Grade, Extra Subjects)",
    keywords: [
      "auxiliary",
      "exam",
      "examination",
      "E grade",
      "I grade",
      "incomplete",
      "extra subject",
      "more subjects",
    ],
    steps:
      "This is a 100 marks exam; weightage replaces previous EST marks.\n**For taking more subjects than specified:**\n1. Write an application to DoAA.\n2. If approved, pay the fee.\n3. Submit the form to the office mentioned in the notification (Academic Section/DoAA Office).",
  },
  {
    id: "6A", // Using string ID
    task: "Make-up Test for Missed MST",
    keywords: [
      "makeup",
      "make-up",
      "missed",
      "mst",
      "mid-semester",
      "test",
      "exam",
      "health",
      "emergency",
      "interview",
    ],
    steps:
      "Eligibility: Critical Health Issues, Family Emergency, Company Interview, SSB Interview/Exam (Valid proofs required).\nWeightage: 60% (Full weightage requires explicit DoAA approval).\nFee: INR 2000 per subject (No waiver).\n**Steps:**\n1. Fill the Make-up Test Application Form (emailed by DoAA office - check inbox).\n2. Attach valid proofs.\n3. Pay the fee.\n4. Submit complete documentation at DoAA office within the deadline mentioned in the email.\n5. Approved list will be released.\n**Note:** Does not apply to sessionals (Quizzes, Labs, Assignments) - contact HoD for those. No need to visit/email DoAA directly for submission.",
  },
  {
    id: 7,
    task: "NOC for Visa",
    keywords: [
      "noc",
      "visa",
      "no objection",
      "certificate",
      "travel",
      "abroad",
    ],
    steps:
      "1. Write an application to DoAA mentioning duration and reason for visa.\n2. Include your email ID and contact number.\n3. Take approval from DoAA.\n4. Collect the signed application from DoAA Office.\n5. Submit the approved application to the Academic Section to get the NOC document.",
  },
  {
    id: 8.1,
    task: "Migration Certificate (Leaving Institute)",
    keywords: ["migration", "certificate", "leaving", "transfer", "withdraw"],
    steps:
      "**If Leaving Before Degree Completion:**\n1. Write an application to DoAA requesting Migration Certificate.\n2. Take approval from DoAA.\n3. Submit to Academic Section and get the certificate.\n(Note: Your name will be struck off).\n**If Degree Completed:**\n1. Go to Academic Section.\n2. Write an application to Deputy Registrar Academics (dr_a@thapar.edu).\n3. Get your certificate.",
  },
  {
    id: 8.2,
    task: "Bonafide Certificate",
    keywords: [
      "bonafide",
      "bonafied",
      "certificate",
      "student status",
      "proof",
    ],
    steps:
      "1. Go to Academic Section.\n2. Write an application to Deputy Registrar Academics (dr_a@thapar.edu).\n3. Get your certificate.",
  },
  {
    id: 9,
    task: "NOC for Internship (Summer/Semester)",
    keywords: [
      "noc",
      "internship",
      "summer",
      "semester",
      "training",
      "no objection",
    ],
    steps:
      "Applies to 2 months summer or 6 months full semester internships.\n1. Write an application to your HoD mentioning duration, place, company name.\n2. Take approval from HoD or departmental internship coordinator.\n3. Get the required NOC document from the department.",
  },
  {
    id: 10,
    task: "NOC/Forms for Internship Requiring Institute Head Signature",
    keywords: [
      "noc",
      "internship",
      "forms",
      "signature",
      "institute head",
      "registrar",
      "director",
    ],
    steps:
      "1. Write an application to HoD mentioning duration, place, company name.\n2. Take recommendation from HoD.\n3. Collect signed application from HoD Office.\n4. Take approval from DoAA at DoAA Office and collect it.\n5. Go to Registrar Office / Academic Section.\n6. Submit the approved application at Academic Section and get the required document/signature.",
  },
  {
    id: 11,
    task: "One Semester Drop",
    keywords: ["semester drop", "one semester", "drop", "medical", "withdraw"],
    steps:
      "1. Write an application to DoAA stating reason and providing valid proofs.\n2. Submit it for DoAA approval.\n3. Collect approved application from DoAA office.\n4. Contact Academic Section.\n5. Submit Continuation Fee Receipt and the DoAA approval at Academic Section.\n6. Receive intimation as proof of the dropped semester.",
  },
  {
    id: 12,
    task: "Drop for Two Semesters (Sequentially)",
    keywords: [
      "two semesters",
      "drop",
      "second semester",
      "consecutive",
      "withdraw",
    ],
    steps:
      "Applies when dropping the second semester after already dropping one.\n1. Show written proof of the previously availed semester drop.\n2. Write an application to DoAA.\n3. This will be routed to the Director for further approval.\n4. Collect the fully approved application from DoAA office.\n5. Contact Academic Section.\n6. Submit Continuation Fee Receipt and the approval (DoAA & Director) at Academic Section.",
  },
  {
    id: 13,
    task: "Two Consecutive Semester Drop (Full Year)",
    keywords: ["two consecutive", "full year", "drop", "year drop", "withdraw"],
    steps:
      "1. Write an application to the Director stating reason and providing valid proofs.\n2. Submit it to the DoAA office.\n3. DoAA Office will send it to the Director after DoAA approval.\n4. Follow up if needed.\n5. Collect the fully approved application from DoAA office.\n6. Contact Academic Section.\n7. Submit Continuation Fee Receipt and the approved application (Director & DoAA) at Academic Section.\n8. Receive intimation as proof.",
  },
  {
    id: 14,
    task: "Detention from EST / Summer Semester",
    keywords: [
      "detention",
      "detained",
      "est",
      "end semester",
      "summer semester",
      "exam",
    ],
    steps:
      "Contact the respective Faculty member only. If issue persists, contact HoD.\n**Do not visit DoAA Office.** (DoAA only displays data received from the department).",
  },
  {
    id: "14A",
    task: "Absence / Attendance Rule (75%) / Missed Sessionals",
    keywords: [
      "absentia",
      "absence",
      "attendance",
      "75%",
      "medical leave",
      "sessional",
      "quiz",
      "lab",
      "evaluation",
    ],
    steps:
      "Up to 25% absence is allowed without permission/information.\n**If a sessional component (Quiz/Lab/Tutorial evaluation) is missed during absence:**\n1. Contact your HoD only.\n2. Show relevant proofs.\n**No need to visit DoAA office.**",
  },
  {
    id: "14B",
    task: "Absence for 1+ Month (Attendance Compensation/Relaxation)",
    keywords: [
      "absence",
      "absentia",
      "1 month",
      "long leave",
      "attendance",
      "compensation",
      "relaxation",
      "medical",
    ],
    steps:
      "Requires special approval from DoAA for attendance relaxation.\n1. Write an application stating the reason for absence.\n2. Attach relevant proofs.\n3. Include your name, roll no, email, contact number.\n4. Submit the consolidated application at the DoAA office.\n5. If DoAA approves, submit the approval to respective faculty member(s).",
  },
  {
    id: 15,
    task: "Time Table Adjustments / Clashes",
    keywords: [
      "time table",
      "timetable",
      "adjustment",
      "clash",
      "schedule change",
    ],
    steps:
      "Contact the Time Table Coordinator of your department. If issue persists, contact HoD.",
  },
  {
    id: 17,
    task: "Booking Rooms (LT except 201/202, LP, B, E, F, D)",
    keywords: [
      "booking",
      "room",
      "lt",
      "lp",
      "b block",
      "e block",
      "f block",
      "d block",
      "venue",
      "event",
    ],
    steps:
      "1. Write an Application to DoAA mentioning date, time, and agenda.\n2. Contact Mr Amit (Technician, DoAA Office) to check room availability.\n3. Get approval from DoAA.\n**For AC:** Show approved application at Electricity Unit (CMS cell - Mr Azharuddin 8427830374).\n**For Audio/Visual/Mic:** Show approved application to Mr Raj Kumar (7696848086).",
  },
  {
    id: 18,
    task: "Booking LT201 / LT202",
    keywords: ["booking", "lt201", "lt202", "lecture theater"],
    steps: "Contact the office of the Deputy Director.",
  },
  {
    id: 19,
    task: "LMS Issues",
    keywords: ["lms", "moodle", "learning management", "issue", "problem"],
    steps: "Contact Dr Harcharan or Mr Aeiman at CITM cell.",
  },
  {
    id: 20,
    task: "Course Content Issues",
    keywords: ["course content", "syllabus", "material", "subject matter"],
    steps: "Contact Respective Faculty. If issue persists, contact HoD.",
  },
  {
    id: 21,
    task: "Apply for academic docs",
    keywords: ["academic", "document", "documents", "online"],
    steps:
      "Pass-out studenst can apply for the academic documents like Transcript/Migration certificate/Dublicate docs by visiting the following the below link: \n https://campus.thapar.edu/psc/public/EMPLOYEE/SA/c/TIET",
  },
  {
    id: 22,
    task: "CGPA Round-off Certificate",
    keywords: ["cgpa", "round off", "rounding", "certificate", "0.05"],
    steps:
      "Provides a temporary certificate giving a leverage of .05 CGPA.\n1. Write an Application to DoAA with subject line 'CGPA round-off'.\n2. State current CGPA and attach screenshot proof from web kiosk.\n3. Submit the application (approved by DoAA) to Academic section.\n4. Get your CGPA round-off certificate.",
  },
  {
    id: "a",
    task: "Transcript / Duplicate Grade Card / Character Certificate",
    keywords: [
      "transcript",
      "duplicate",
      "grade card",
      "marksheet",
      "character certificate",
      "conduct",
    ],
    steps: "Contact Academic Section / Registrar Office (dr_a@thapar.edu).",
  },
  {
    id: "b",
    task: "Exam Conduct/Clashes (MST/EST/Auxiliary/Summer)",
    keywords: [
      "exam conduct",
      "exam clash",
      "mst clash",
      "est clash",
      "auxiliary clash",
      "summer clash",
      "schedule",
      "coe",
    ],
    steps:
      "Contact the CoE (Controller of Examinations) Office Only: coe@thapar.edu",
  },
  {
    id: "c",
    task: "Hostel Issues (Allocation, Mess, Amenities)",
    keywords: [
      "hostel",
      "allocation",
      "room change",
      "mess food",
      "amenities",
      "dosa",
    ],
    steps:
      "Contact the DoSA (Dean of Student Affairs) Office Only: dosaoffice@thapar.edu",
  },
  {
    id: 23,
    task: "Extension of PHD",
    keywords: ["extension", "phd"],
    steps:
      "If you are seeking extension for your PhD beyond permitted time (5Years for male candidate and 7 year for female candidate), submit the following documents along with the application form. \n 1. Copy of Half-yearly/quarterly progress report of last semester \n  2. Proof of published / accepted / communicated articles \n Dr. Bhupendrakumar Chudasama Associate Dean, Research and Development Cell Professor, \n School of Physics & Materials Science \n Thapar Institute of Engineering and Technology Patiala - 147004 PUNJAB, INDIA (M)\n  +91-9781966136",
  },
  {
    id: 24,
    task: "Regulation for PHD thesis submission",
    keywords: ["regulation", "phd","thesis","submission"],
    steps:
      "Please note the Institute's regulations for PhD thesis submission:\n Male students must submit their theses to the Registrar within 5 years, while female/physically handicapped students have a 7-year timeframe, with a minimum of 2.5 years for regular and 3.5 years for part-time students from the date of admission.\nStudents are expected to complete their research within the normal period specified in the regulations. However, in cases of genuine hardship, the Dean, Research and Development Cell (DoRDC), based on the doctoral Committee's recommendations, may grant an extension of up to one year, if, at the end of the extended period, a student has completed a substantial part of the thesis or published research papers in refereed journals, the Chairperson of the Senate, upon DoRD's recommendation, may allow an additional one-year extension, providing detalled reasons for this special extension.\nFailure to submit the thesis within the stipulated period or to apply for an extension will result in automatic cancellation of registration. No extensions beyond seven years (for male students) and nine yoars (for female/physically handicapped students) will be granted under any circumstances. \nPhD students seeking an extension beyond the normal period must provide a detalled explanation for a 1/2-year extension. The Institute/Competent Authority reserves the right to deny extensions without proper/detalled explanations from the student/supervisor.\nNo extension requests will be considered beyond the extended period of seven years (for male students) and nine years (for female/physically handicapped students).",
    },
    {
      task:"Scholarship information",
      keywords:["scholarship info","scholarship","information","info"],
      steps:" vsist this website  https://www.thapar.edu/admissions/pages/scholarships "
    }
];


/**
 * Searches the DoAA procedures based on keywords in the prompt.
 * Returns the steps for the best match.
 */
export function getDoaaProcedureById(id) {
  // Find the procedure with the matching ID
  const procedure = doaaProcedures.find((p) => p.id === id);

  if (procedure) {
    // Return the formatted steps string
    const stepsWithLink = `**For more details, refer to the official DoAA steps:**\nhttps://docs.google.com/document/d/18kHw-1pyXyKauhNwv6QlePw2JVbgUszVbgQN5fa2Ons/edit?tab=t.0`;

    return `**Regarding "${procedure.task}":**\n\n${procedure.steps}\n\n${stepsWithLink}`;
  }
  return null; // Return null if not found
}

/**
 * Searches the *generic* DoAA procedures (excluding ones handled separately).
 * Returns the steps for the best match.
 */
export function findDoaaProcedure(prompt) {
  if (!prompt) return null;

  const lowerPrompt = prompt.toLowerCase();

  const promptTokens = new Set(
    lowerPrompt
      .split(" ")
      .filter(
        (word) =>
          word.length > 2 &&
          !["the", "for", "and", "how", "what"].includes(word)
      )
  );

  let bestMatch = null;
  let maxScore = 0;

  // --- MODIFICATION: Filter out ID 1, which is handled specifically ---
  const genericProcedures = doaaProcedures.filter(
    (p) => p.id !== 1 && p.id !== 2 && p.id !== 3
  );

  // --- MODIFICATION: Loop over the filtered list ---
  genericProcedures.forEach((proc) => {
    let currentScore = 0;
    // ... (rest of the scoring logic remains exactly the same) ...
    proc.keywords.forEach((kw) => {
      if (lowerPrompt.includes(kw)) {
        currentScore += 2;
      }
    });
    const taskTokens = new Set(
      proc.task
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 2)
    );
    const intersection = new Set(
      [...promptTokens].filter((x) => taskTokens.has(x))
    );
    currentScore += intersection.size;

    if (currentScore > maxScore) {
      maxScore = currentScore;
      bestMatch = proc;
    }
  });

  if (maxScore > 1) {
    const stepsWithLink = `**For more details, refer to the official DoAA steps:**\nhttps://docs.google.com/document/d/18kHw-1pyXyKauhNwv6QlePw2JVbgUszVbgQN5fa2Ons/edit?tab=t.0`;
    return `**Regarding "${bestMatch.task}":**\n\n${bestMatch.steps}\n\n${stepsWithLink}`;
  }

  // if (allKeywordsMatch) {
  //   console.log(`✅ Found DoAA match by all keywords: "${proc.task}"`);
  //   const stepsWithLink = `${proc.steps}\n\n---\n**For more details, refer to the official DoAA steps:**\nhttps://docs.google.com/document/d/18kHw-1pyXyKauhNwv6QlePw2JVbgUszVbgQN5fa2Ons/edit?tab=t.0`;
  //   return `**Regarding "${proc.task}":**\n\n${stepsWithLink}`; // Ensure this line is exactly like this
  // }

  return null; // No good match found
}
