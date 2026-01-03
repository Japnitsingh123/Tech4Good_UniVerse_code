const certificateInfo = [
  {
    id: "SC",
    category: "Scheduled Caste (SC) Certificate",
    keywords: ["sc", "scheduled caste", "caste certificate", "authority"],
    info: "**Competent Authorities to Issue SC Certificate:**\n1. District Magistrate/Addl. DM/Collector/Deputy Commissioner/Addl. DC/Deputy Collector/1st Class Stipendary Magistrate/City Magistrate/Sub-Divisional Magistrate/Talika Magistrate/Executive Magistrate/Extra Assistant Commissioner (not below 1st Class Stipendary Magistrate).\n2. Chief Presidency Magistrate/Addl. Chief Presidency Magistrate/Presidency Magistrate.\n3. Revenue Officer (not below Tehsildar).\n4. Sub-Divisional Officer (SDO) of the area.\n5. Administrator/Secretary/Development Officer (Lakshadweep).\n6. MLAs of the concerned constituency (as per specific circulars).\n\n**Format:** See Annexure-II in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "ST",
    category: "Scheduled Tribe (ST) Certificate",
    keywords: ["st", "scheduled tribe", "tribe certificate", "authority"],
    info: "**Competent Authorities to Issue ST Certificate:** Same as for Scheduled Caste (SC) category.\n\n**Format:** See PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "BC",
    category: "Backward Class (BC) Certificate",
    keywords: ["bc", "backward class", "obc", "caste certificate", "authority"],
    info: "**Competent Authorities to Issue BC Certificate:**\n1. Sub-Divisional Magistrate (SDM)\n2. Executive Magistrate\n3. Tehsildar\n4. Naib Tehsildar\n5. Block Officer\n6. District Revenue Officer\n\n**Important:** Must not be dated more than one year before the first day of counselling.\n**Format:** See Annexure-II in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "PH",
    category: "Physically Handicapped (PH) Certificate",
    keywords: ["ph", "physically handicapped", "disability", "disabled", "cmo", "certificate"],
    info: "**Requirement:** Certificate issued by the Chief Medical Officer (CMO) of the concerned district, indicating the extent of disability.\n**Eligibility:** Minimum 40% disability required.\n**Note:** Admission is subject to the Admission Committee's decision regarding the candidate's ability to pursue studies.\n\n**Format:** See PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "MED",
    category: "Medical Certificate Format",
    keywords: ["medical", "certificate", "format", "health", "fitness"],
    info: "**Purpose:** General medical fitness certificate.\n**Format:** See Annexure-III in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "NRI",
    category: "Sponsorship Affidavit (NRI/FN)",
    keywords: ["nri", "fn", "foreign national", "sponsor", "sponsorship", "affidavit", "admission"],
    info: "**Requirement:** For candidates applying under NRI/Foreign National Category for various programs (BE/BTech/MCA/MSc/ME/MTech/MPhil/PhD).\n**Content:** Sponsor declares responsibility for fee payment in US$.\n**Attestation:** Must be attested by a Notary Public or First Class Magistrate.\n\n**Format:** See Annexure-IV in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "SPON_ME",
    category: "Sponsorship Certificate (ME/MTech)",
    keywords: ["sponsored", "sponsorship", "certificate", "me", "mtech", "study leave"],
    info: "**Requirement:** For candidates applying for ME/MTech programs under sponsorship.\n**Content:** Employer certifies employment, grants study leave, and confirms bearing expenses.\n\n**Format:** See Annexure-V in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "PRINCIPAL",
    category: "Certificate from Principal (Last Attended)",
    keywords: ["principal", "certificate", "last attended", "character", "date of birth"],
    info: "**Requirement:** Certifies student's moral character and confirms Date of Birth as per school/college records.\n\n**Format:** See Annexure-VI in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "INCOME",
    category: "Income Certificate / Declaration",
    keywords: ["income", "certificate", "salary", "business", "declaration", "father", "guardian", "pension"],
    info: "**Requirement:** Proof of parent/guardian income.\n**Types:**\n1. Certificate from Head of Office (if employed).\n2. Notarized Declaration (if self-employed/business).\n3. Pension Certificate (if retired).\n\n**Format:** See Annexure-VII in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "PUNJAB_GOVT",
    category: "Certificate for Children of Punjab Govt. Employees (Outside Punjab)",
    keywords: ["punjab government", "employee", "outside punjab", "deputed", "posted", "certificate"],
    info: "**Requirement:** For children of Punjab Govt. employees posted/deputed outside Punjab.\n**Content:** Head of Office certifies employment details and current posting outside Punjab.\n\n**Format:** See Annexure-VIII in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "GAP",
    category: "Gap Period Affidavit",
    keywords: ["gap", "period", "affidavit", "year drop", "study break"],
    info: "**Requirement:** Notarized affidavit declaring non-involvement in illegal activities during the gap period.\n\n**Format:** See Annexure-IX in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "RESULT_PENDING",
    category: "Undertaking for Result Not Declared",
    keywords: ["undertaking", "result not declared", "result pending", "qualifying exam", "final result"],
    info: "**Requirement:** For candidates whose final qualifying exam result is pending.\n**Content:** Candidate declares no backlogs and assures result submission by the deadline (e.g., Dec 31, 2025).\n\n**Format:** See Annexure-X in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "ANTI_DRUG_PARENT",
    category: "Anti-Alcohol/Drug Abuse Affidavit (Parent/Guardian)",
    keywords: ["anti drug", "anti alcohol", "drug abuse", "affidavit", "parent", "guardian"],
    info: "**Requirement:** Notarized affidavit from parent/guardian acknowledging the Institute's Anti-Alcohol/Drug Abuse policy and consequences.\n\n**Format:** See Annexure-XI in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "ANTI_DRUG_STUDENT",
    category: "Anti-Alcohol/Drug Abuse Affidavit (Student)",
    keywords: ["anti drug", "anti alcohol", "drug abuse", "affidavit", "student"],
    info: "**Requirement:** Notarized affidavit from the student acknowledging the Institute's Anti-Alcohol/Drug Abuse policy and consequences.\n\n**Format:** See Annexure-XII in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "PUNJAB_RESIDENCY",
    category: "Affidavit for Punjab Quota (Residency, 10+2 Outside)",
    keywords: ["punjab quota", "residency", "affidavit", "outside punjab", "10+2"],
    info: "**Requirement:** Notarized affidavit for candidates claiming Punjab State Quota based on Punjab Residency Certificate but did 10+2 outside Punjab.\n**Content:** Declares non-claiming of state quota benefit from any other State/UT.\n\n**Format:** See Annexure-XIII in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  },
  {
    id: "STUDENT_UNDERTAKING",
    category: "Undertaking from Student and Guardian (General)",
    keywords: ["undertaking", "student", "guardian", "rules", "regulations", "discipline", "vehicle"],
    info: "**Requirement:** General undertaking regarding accuracy of information, abiding by rules, vehicle policy, non-involvement in illegal activities, and health status.\n\n**Format:** See Annexure-XIV in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing" // **Replace with the actual URL to the PDF**
  }
];

// export default certificateInfo;

// Add this function (e.g., in certificateService.js or doaaService.js)

/**
 * Searches the Certificate information based on keywords in the prompt.
 * Uses a scoring mechanism for flexibility.
 */
export function findCertificateInfo(prompt) {
  if (!prompt) return null;
  const lowerPrompt = prompt.toLowerCase();
  const promptTokens = new Set(
    lowerPrompt.split(' ').filter(word => word.length > 2 && !['the', 'for', 'and', 'how', 'what', 'where', 'get'].includes(word))
  );

  let bestMatch = null;
  let maxScore = 0;

  certificateInfo.forEach(cert => {
    let currentScore = 0;
    // Check keywords
    cert.keywords.forEach(kw => {
      if (lowerPrompt.includes(kw.toLowerCase())) {
        currentScore += 2; // Weight keyword match higher
      }
    });
    // Check category title words
    const categoryTokens = new Set(cert.category.toLowerCase().split(' ').filter(w => w.length > 2));
    const intersection = new Set([...promptTokens].filter(x => categoryTokens.has(x)));
    currentScore += intersection.size; // Score based on overlap

    if (currentScore > maxScore) {
      maxScore = currentScore;
      bestMatch = cert;
    }
  });

  // Return the info if the score is reasonably high
  if (maxScore > 1) { // Adjust threshold if needed
    console.log(`✅ Found Certificate Info match (Score: ${maxScore}): "${bestMatch.category}"`);
    // Format the response including the specific PDF link
    return `**Regarding "${bestMatch.category}":**\n\n${bestMatch.info}\n\n**Download Formats PDF:**\n${bestMatch.pdfLink}`;
  }

  console.log("ℹ️ No Certificate Info procedure found matching the prompt well enough.");
  return null;
}