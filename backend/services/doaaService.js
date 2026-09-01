// backend/services/doaaService.js

export const doaaProcedures = [
  {
    id: 1,
    task: "Group / Sub-group Change",
    keywords: ["group", "subgroup", "sub-group", "change group", "switch group", "change section", "section change", "group change", "switch section"],
    steps:
      "1. Write an application.\n2. Mention your current group/sub-group.\n3. Give details of the group/sub-group you want to switch to.\n4. Take approval from the DoAA Office.\n5. Collect the signed application and take it to Webkiosk/SSSP Admin (Dr. SK Guleria / Mr. Vinod Kumar / Mr. Rupinder Singh – 1st Floor, Near Registrar Office).\nNote: Max count for a sub-group is 30. If feasible, the Admin will update Webkiosk; otherwise, your group remains the same.",
  },
  {
    id: 2,
    task: "Add Additional Subject / Backlog Registration",
    keywords: [
      "add subject",
      "additional subject",
      "add course",
      "backlog",
      "backlog registration",
      "register backlog",
      "additional course",
      "extra subject",
    ],
    steps:
      "1. Use the form floated by DoAA Office/Academic Section (usually before semester starts).\n2. Mention details of the subject to be added.\n3. Make your current semester time table.\n4. Mention the sub-group number for each LTP component in the form.\n5. Ensure no clashes with your current time table.\n6. Get it vetted/verified by your departmental time table coordinator (they must write 'No Clashes').\n7. If no clash, pay the required fee.\n8. Get the form approved by the DoAA Office.\n9. Submit the form to the designated office mentioned in the notification.",
  },
  {
    id: 3,
    task: "Drop Subject",
    keywords: ["drop", "drop subject", "remove subject", "withdraw subject", "withdraw course", "drop course"],
    steps:
      "1. Use the Add/Drop form floated by DoAA Office/Academic Section (usually before semester starts).\n2. Mention details of the subject to be dropped.\n3. Get the form approved by the DoAA Office.\n4. Submit the form to the designated office mentioned in the notification.",
  },
  {
    id: 4.1,
    task: "Free / Generic Elective Change/Amendment/Missed Filling",
    keywords: [
      "free elective",
      "generic elective",
      "elective change",
      "elective",
      "preference",
      "amendment",
      "missed elective",
      "choice filling",
    ],
    steps:
      "**For Changes/Amendments:**\n1. List of electives is displayed on Web-kiosk/SSSP (Contact Admin if issues).\n2. Fill choices; choices get locked.\n3. For changes: Write an application, get approval from DoAA, submit to Web-kiosk Admin (Mr Rupinder Singh).\n**If Missed Filling:**\n1. Write an application to DoAA for approval.\n2. If approved, submit the application to Web-kiosk Admin (Mr Rupinder Singh).",
  },
  {
    id: 4.2,
    task: "Professional Elective Change/Amendment/Missed Filling",
    keywords: [
      "professional elective",
      "pe change",
      "branch elective",
      "department elective",
      "change elective",
      "elective choice",
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
      "fee delay",
      "delay fee",
      "education loan",
      "installment",
      "financial",
    ],
    steps:
      "1. Pay fees as per Finance Section notification (on Web-kiosk/SSSP).\n2. For delays (due to Loan/Family/Health issues): Write an application, attach relevant proofs, take approval from DoAA for the delay.\n3. Submit the approved application to the Finance Section.\n4. For other concerns, contact Finance Officer (Mr Pankaj Sinha): financeofficer@thapar.edu",
  },
  {
    id: 6,
    task: "Auxiliary Examination (E to C, I Grade, Extra Subjects)",
    keywords: [
      "auxiliary",
      "auxiliary exam",
      "aux exam",
      "E grade",
      "I grade",
      "incomplete grade",
      "reappear",
    ],
    steps:
      "This is a 100 marks exam; weightage replaces previous EST marks.\n**For taking more subjects than specified:**\n1. Write an application to DoAA.\n2. If approved, pay the fee.\n3. Submit the form to the office mentioned in the notification (Academic Section/DoAA Office).",
  },
  {
    id: 7,
    task: "Make-up Test for Missed MST",
    keywords: [
      "makeup test",
      "make-up test",
      "missed mst",
      "missed test",
      "mst medical",
      "makeup exam",
      "mst absence",
    ],
    steps:
      "1. Obtain the Medical / Genuine Reason certificate and application form.\n2. Apply to DoAA Office within the specified timeline (usually within 3 days of missing the test).\n3. Attach medical fitness certificate from TIET Dispensary / hospital discharge summary.\n4. Upon DoAA approval, contact your course coordinator for the scheduled make-up test date.",
  },
  {
    id: 8,
    task: "Attendance, Shortage & Detention",
    keywords: [
      "attendance",
      "attendence",
      "shortage",
      "detention",
      "detained",
      "75 attendance",
      "medical leave attendance",
    ],
    steps:
      "1. Minimum 75% attendance is mandatory in each component (Lecture, Tutorial, Practical).\n2. For medical leave: Submit medical certificate endorsed by Institute Chief Medical Officer within 7 days of returning.\n3. Medical leave can provide relaxation up to a maximum of 10% (i.e. minimum 65% attendance).\n4. Students falling below the minimum threshold will be detained and awarded an 'I' grade.",
  },
  {
    id: 9,
    task: "Bonafide Certificate, Migration & NOC",
    keywords: [
      "bonafide",
      "bonafide certificate",
      "migration certificate",
      "noc",
      "visa letter",
      "character certificate",
      "passport noc",
    ],
    steps:
      "1. Apply online through the WebKiosk portal under Student Services / Certificates.\n2. For Bonafide / Fee Estimation: Instant generation or 1-2 working days at Academic Section.\n3. For Migration / Official Transcript: Apply to Examination Cell (near Library).\n4. For Visa / Passport NOC: Submit written application with admission letter to Registrar / DoAA office.",
  },
  {
    id: 10,
    task: "Semester Drop / Gap Year",
    keywords: [
      "semester drop",
      "drop semester",
      "gap year",
      "withdraw semester",
      "leave semester",
    ],
    steps:
      "1. Write a formal application addressed to Dean of Academic Affairs (DoAA).\n2. Attach parent consent letter and supporting medical/personal documents.\n3. Clear all pending institute and hostel dues.\n4. Submit the approved application to Academic Section for record update.",
  },
  {
    id: 11,
    task: "Hostel Room Booking / Change",
    keywords: [
      "hostel",
      "room booking",
      "hostel change",
      "hostel room",
      "hostel allocation",
      "hostel warden",
    ],
    steps:
      "1. Hostel room allocation is processed via Webkiosk during the designated hostel registration window.\n2. For mid-semester room change: Submit application to Chief Warden / Warden of respective hostel.\n3. Obtain clearance and update room records with Hostel Caretaker.",
  },
  {
    id: 12,
    task: "Scholarship & Merit Awards",
    keywords: [
      "scholarship",
      "merit scholarship",
      "freeship",
      "fee waiver",
      "financial aid",
    ],
    steps:
      "1. Institute Merit Scholarships (Merit-I, Merit-II, Merit-III) are awarded based on AGPA/CGPA announced after EST results.\n2. Means-cum-Merit scholarships: Submit income certificate (below income threshold) to DoAA / Student Affairs Office during notice window.\n3. Government scholarships (NSP, State portals): Submit verification documents to Academic Section.",
  },
];

const OFFICIAL_DOAA_LINK = "https://docs.google.com/document/d/18kHw-1pyXyKauhNwv6QlePw2JVbgUszVbgQN5fa2Ons/edit?tab=t.0";

export function getDoaaProcedureById(id) {
  const procedure = doaaProcedures.find((p) => String(p.id) === String(id));
  if (procedure) {
    return `**Regarding "${procedure.task}":**\n\n${procedure.steps}\n\n**For official DoAA guidelines and circulars:**\n[Official DoAA Document](${OFFICIAL_DOAA_LINK})`;
  }
  return null;
}

/**
 * Searches DoAA procedures with smart scoring.
 */
export function findDoaaProcedure(prompt) {
  if (!prompt) return null;

  const lowerPrompt = prompt.toLowerCase();
  const promptTokens = new Set(
    lowerPrompt
      .split(/\s+/)
      .filter((word) => word.length > 2 && !["the", "for", "and", "how", "what", "can", "tell", "about", "get"].includes(word))
  );

  let bestMatch = null;
  let maxScore = 0;

  doaaProcedures.forEach((proc) => {
    let currentScore = 0;

    // Check exact keyword matches (highest weight)
    proc.keywords.forEach((kw) => {
      const kwLower = kw.toLowerCase();
      if (lowerPrompt.includes(kwLower)) {
        currentScore += kwLower.split(/\s+/).length >= 2 ? 5 : 3;
      }
    });

    // Check task name token overlap
    const taskTokens = new Set(
      proc.task
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );
    const intersection = new Set([...promptTokens].filter((x) => taskTokens.has(x)));
    currentScore += intersection.size * 2;

    if (currentScore > maxScore) {
      maxScore = currentScore;
      bestMatch = proc;
    }
  });

  if (maxScore >= 2 && bestMatch) {
    return `**Regarding "${bestMatch.task}":**\n\n${bestMatch.steps}\n\n**Official DoAA Reference:**\n[View Official DoAA Guidelines](${OFFICIAL_DOAA_LINK})`;
  }

  return null;
}
