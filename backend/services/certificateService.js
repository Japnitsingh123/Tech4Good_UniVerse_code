// backend/services/certificateService.js

const certificateInfo = [
  {
    id: "SC",
    category: "Scheduled Caste (SC) Certificate",
    keywords: ["sc certificate", "scheduled caste", "sc category", "caste certificate"],
    info: "**Competent Authorities to Issue SC Certificate:**\n1. District Magistrate / Addl. DM / Collector / Deputy Commissioner / 1st Class Stipendary Magistrate / City Magistrate / SDM / Executive Magistrate.\n2. Chief Presidency Magistrate / Presidency Magistrate.\n3. Revenue Officer (not below Tehsildar).\n4. Sub-Divisional Officer (SDO) of the area.\n\n**Format:** See Annexure-II in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "ST",
    category: "Scheduled Tribe (ST) Certificate",
    keywords: ["st certificate", "scheduled tribe", "st category", "tribe certificate"],
    info: "**Competent Authorities to Issue ST Certificate:** Same as for Scheduled Caste (SC) category.\n\n**Format:** See Annexure-II in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "BC",
    category: "Backward Class (BC/OBC) Certificate",
    keywords: ["bc certificate", "backward class", "obc certificate", "obc", "other backward class"],
    info: "**Competent Authorities to Issue BC/OBC Certificate:**\n1. Sub-Divisional Magistrate (SDM)\n2. Executive Magistrate\n3. Tehsildar / Naib Tehsildar\n4. District Revenue Officer\n\n**Important:** Must not be dated more than one year before the first day of counselling.\n**Format:** See Annexure-II in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "PH",
    category: "Physically Handicapped (PH/PwD) Certificate",
    keywords: ["ph certificate", "physically handicapped", "disability certificate", "disabled", "pwd", "cmo certificate"],
    info: "**Requirement:** Certificate issued by the Chief Medical Officer (CMO) of the concerned district, indicating the extent of disability.\n**Eligibility:** Minimum 40% disability required.\n\n**Format:** See Annexure in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "MED",
    category: "Medical Certificate Format",
    keywords: ["medical certificate", "fitness certificate", "health certificate", "doctor certificate"],
    info: "**Purpose:** General medical fitness certificate for admissions.\n**Authority:** Registered Medical Practitioner / Civil Hospital / Institute Dispensary.\n**Format:** See Annexure-III in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "NRI",
    category: "Sponsorship Affidavit (NRI/FN)",
    keywords: ["nri affidavit", "nri sponsorship", "foreign national", "sponsor affidavit", "nri quota"],
    info: "**Requirement:** For candidates applying under NRI/Foreign National Category.\n**Content:** Sponsor declares responsibility for fee payment in US Dollars.\n**Attestation:** Must be attested by a Notary Public or First Class Magistrate / Indian Embassy abroad.\n\n**Format:** See Annexure-IV in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "SPON_ME",
    category: "Sponsorship Certificate (ME/MTech/PhD)",
    keywords: ["sponsored certificate", "mtech sponsorship", "study leave certificate", "employer certificate"],
    info: "**Requirement:** For candidates applying for ME/MTech/PhD programs under sponsorship.\n**Content:** Employer certifies employment, grants study leave, and confirms bearing expenses.\n\n**Format:** See Annexure-V in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "PRINCIPAL",
    category: "Certificate from Principal (Last Attended)",
    keywords: ["principal certificate", "character certificate", "school character", "last attended certificate"],
    info: "**Requirement:** Certifies student's moral character, conduct, and confirms Date of Birth as per school/college records.\n\n**Format:** See Annexure-VI in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "INCOME",
    category: "Income Certificate / Declaration",
    keywords: ["income certificate", "parent income", "salary certificate", "income affidavit", "income proof"],
    info: "**Requirement:** Proof of parent/guardian annual income for scholarship or fee category.\n**Types:**\n1. Certificate from Head of Office (if employed).\n2. Notarized Declaration (if self-employed/business).\n3. Pension Certificate (if retired).\n\n**Format:** See Annexure-VII in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "PUNJAB_GOVT",
    category: "Certificate for Children of Punjab Govt. Employees (Outside Punjab)",
    keywords: ["punjab govt employee", "punjab government certificate", "outside punjab", "deputed outside punjab"],
    info: "**Requirement:** For children of Punjab Govt. employees posted/deputed outside Punjab.\n**Content:** Head of Office certifies employment details and current posting outside Punjab.\n\n**Format:** See Annexure-VIII in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "GAP",
    category: "Gap Period Affidavit",
    keywords: ["gap affidavit", "gap certificate", "gap year", "study break affidavit", "year gap"],
    info: "**Requirement:** Notarized affidavit on non-judicial stamp paper declaring non-involvement in any unlawful activities during the gap period.\n\n**Format:** See Annexure-IX in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "RESULT_PENDING",
    category: "Undertaking for Result Not Declared",
    keywords: ["result pending", "result not declared", "qualifying exam pending", "undertaking result"],
    info: "**Requirement:** For candidates whose qualifying exam result is awaiting declaration.\n**Content:** Candidate declares no pending backlogs and assures submission by institute deadline.\n\n**Format:** See Annexure-X in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "ANTI_DRUG_PARENT",
    category: "Anti-Alcohol/Drug Abuse Affidavit (Parent/Guardian)",
    keywords: ["anti drug parent", "drug affidavit parent", "anti alcohol parent", "parent undertaking drug"],
    info: "**Requirement:** Notarized affidavit from parent/guardian acknowledging the Institute's zero-tolerance Anti-Alcohol/Drug Abuse policy.\n\n**Format:** See Annexure-XI in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "ANTI_DRUG_STUDENT",
    category: "Anti-Alcohol/Drug Abuse Affidavit (Student)",
    keywords: ["anti drug student", "drug abuse affidavit", "anti alcohol student", "anti drug affidavit", "student undertaking drug"],
    info: "**Requirement:** Notarized affidavit from the student acknowledging the Institute's Anti-Alcohol/Drug Abuse policy and strict disciplinary actions.\n\n**Format:** See Annexure-XII in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "PUNJAB_RESIDENCY",
    category: "Affidavit for Punjab Quota (Residency, 10+2 Outside)",
    keywords: ["punjab quota", "punjab residency", "domicile", "punjab domicile", "10+2 outside punjab"],
    info: "**Requirement:** Notarized affidavit for candidates claiming Punjab State Quota based on Punjab Residency Certificate but did 10+2 outside Punjab.\n**Content:** Declares non-claiming of state quota benefit from any other State/UT.\n\n**Format:** See Annexure-XIII in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  },
  {
    id: "STUDENT_UNDERTAKING",
    category: "Undertaking from Student and Guardian (General Discipline)",
    keywords: ["student undertaking", "general undertaking", "discipline undertaking", "rules and regulations"],
    info: "**Requirement:** General undertaking regarding accuracy of submitted records, abiding by campus rules, vehicle policy, and code of conduct.\n\n**Format:** See Annexure-XIV in the provided PDF.",
    pdfLink: "https://drive.google.com/file/d/1_hnvjoEocjsFK8J5ISrt_4FefePtj0mA/view?usp=sharing"
  }
];

export function findCertificateInfo(prompt) {
  if (!prompt) return null;
  const lowerPrompt = prompt.toLowerCase();
  const promptTokens = new Set(
    lowerPrompt.split(/\s+/).filter((word) => word.length > 2 && !["the", "for", "and", "how", "what", "where", "get", "give", "need"].includes(word))
  );

  let bestMatch = null;
  let maxScore = 0;

  certificateInfo.forEach((cert) => {
    let currentScore = 0;

    cert.keywords.forEach((kw) => {
      const kwLower = kw.toLowerCase();
      if (lowerPrompt.includes(kwLower)) {
        currentScore += kwLower.split(/\s+/).length >= 2 ? 5 : 3;
      }
    });

    const categoryTokens = new Set(cert.category.toLowerCase().split(/\s+/).filter((w) => w.length > 2));
    const intersection = new Set([...promptTokens].filter((x) => categoryTokens.has(x)));
    currentScore += intersection.size * 2;

    if (currentScore > maxScore) {
      maxScore = currentScore;
      bestMatch = cert;
    }
  });

  if (maxScore >= 2 && bestMatch) {
    return `**Regarding "${bestMatch.category}":**\n\n${bestMatch.info}\n\n**Download Official PDF Formats:**\n[Download Formats PDF](${bestMatch.pdfLink})`;
  }

  return null;
}