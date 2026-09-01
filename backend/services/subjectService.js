// backend/services/subjectService.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let subjects = [];

const possiblePaths = [
  path.resolve(__dirname, '../subjects.json'),
  path.resolve(__dirname, '../../subjects.json'),
  path.resolve('./subjects.json'),
  path.resolve('./backend/subjects.json'),
];

export function loadSubjectData() {
  let loaded = false;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        console.log(`▶ Loading subject data from: ${p}`);
        const fileContent = fs.readFileSync(p, 'utf8');
        const parsedData = JSON.parse(fileContent);

        let subjectArray = [];
        if (Array.isArray(parsedData)) {
          subjectArray = parsedData;
        } else if (typeof parsedData === 'object' && parsedData !== null) {
          subjectArray = Object.values(parsedData);
        }

        subjects = subjectArray.map((subject) => {
          const code = (subject.subjectCode || subject.code || '').trim().toUpperCase();
          const name = (subject.name || subject.subject_name || '').trim();
          return {
            ...subject,
            code: code,
            subjectCode: code,
            name: name,
            credit: subject.credit || subject.credits || '4.0',
            isCore: subject.isCore || (subject.is_core ? 'Yes' : 'No') || 'Yes',
            ltp: subject.ltp || '3-0-2',
            description: subject.description || 'Subject curriculum and syllabus information.',
            searchCode: code.replace(/[^A-Z0-9]/gi, ''),
            searchName: name.toLowerCase(),
          };
        });

        console.log(`✅ Successfully loaded ${subjects.length} subject entries.`);
        loaded = true;
        break;
      } catch (err) {
        console.error(`❌ Error parsing subject file at ${p}:`, err.message);
      }
    }
  }

  if (!loaded) {
    console.warn("⚠️ Warning: Could not find 'subjects.json'. Default subject list will be empty.");
  }
}

/**
 * Finds a single subject by code or name.
 */
export function findSubject(query) {
  if (!query) return null;
  if (subjects.length === 0) loadSubjectData();
  if (subjects.length === 0) return null;

  const cleanQuery = query.trim();
  const upperQuery = cleanQuery.toUpperCase();
  const lowerQuery = cleanQuery.toLowerCase();
  const alphanumericQuery = upperQuery.replace(/[^A-Z0-9]/gi, '');

  // 1. Exact match on normalized code (e.g. UCS312, UCS 312)
  let subject = subjects.find((s) => s.searchCode === alphanumericQuery);
  if (subject) return subject;

  // 2. Partial match on code inside query (e.g. "tell me about UCS303")
  subject = subjects.find((s) => s.searchCode.length > 3 && (upperQuery.includes(s.searchCode) || alphanumericQuery.includes(s.searchCode)));
  if (subject) return subject;

  // 3. Exact match on name
  subject = subjects.find((s) => s.searchName === lowerQuery);
  if (subject) return subject;

  // 4. Partial substring match on name
  const filteredWords = lowerQuery
    .replace(/\b(subject|course|syllabus|details|info|tell|me|about|what|is|the|credit|credits)\b/gi, '')
    .trim();

  if (filteredWords.length >= 3) {
    subject = subjects.find((s) => s.searchName.includes(filteredWords) || filteredWords.includes(s.searchName));
    if (subject) return subject;
  }

  // 5. Multi-token match
  const tokens = filteredWords.split(/\s+/).filter((w) => w.length > 2);
  if (tokens.length > 0) {
    let bestMatch = null;
    let maxMatches = 0;
    for (const s of subjects) {
      const matchCount = tokens.filter((t) => s.searchName.includes(t)).length;
      if (matchCount > maxMatches) {
        maxMatches = matchCount;
        bestMatch = s;
      }
    }
    if (maxMatches > 0) return bestMatch;
  }

  return null;
}

export function listAllSubjects() {
  if (subjects.length === 0) loadSubjectData();
  return subjects.map((s) => `${s.code} - ${s.name}`);
}