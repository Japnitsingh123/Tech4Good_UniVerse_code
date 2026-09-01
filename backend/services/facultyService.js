// backend/services/facultyService.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let fallbackFaculty = [];

const possibleFacultyPaths = [
  path.resolve(__dirname, '../data/faculty.json'),
  path.resolve(__dirname, '../faculty.json'),
  path.resolve('./backend/data/faculty.json'),
  path.resolve('./data/faculty.json'),
  path.resolve('./faculty.json'),
];

function loadFallbackFaculty() {
  if (fallbackFaculty.length > 0) return;
  for (const p of possibleFacultyPaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf8');
        fallbackFaculty = JSON.parse(raw);
        console.log(`✅ Loaded ${fallbackFaculty.length} local faculty records from ${p}`);
        break;
      } catch (e) {
        console.error(`Error loading local faculty from ${p}:`, e.message);
      }
    }
  }
}

// Initial load
loadFallbackFaculty();

export async function searchFaculty(rawQuery) {
  if (!rawQuery) return null;

  const query = rawQuery.trim().toLowerCase();
  const cleanedSearchTerms = query
    .replace(/\b(dr|prof|professor|mr|ms|mrs|sir|madam|faculty|teacher)\.?\b/gi, '')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 1);

  // 1. Try MySQL Database first if available
  try {
    const like = `%${query}%`;
    const sql = `
      SELECT *
      FROM \`Faculty\`
      WHERE LOWER(Name) LIKE ?
         OR LOWER(Department) LIKE ?
         OR LOWER(Email) LIKE ?
         OR LOWER(Office) LIKE ?
         OR LOWER(Link) LIKE ?
      LIMIT 25
    `;

    const [rows] = await db.promise().query(sql, [like, like, like, like, like]);
    if (rows && rows.length > 0) {
      return rows;
    }
  } catch (err) {
    console.warn("ℹ️ MySQL query skipped or failed, using local faculty knowledge base:", err.message);
  }

  // 2. Fallback to local faculty database
  loadFallbackFaculty();
  if (fallbackFaculty.length === 0) return null;

  // Search local faculty
  const matches = fallbackFaculty.filter((f) => {
    const nameLower = (f.Name || '').toLowerCase();
    const deptLower = (f.Department || '').toLowerCase();
    const specLower = (f.Specialization || '').toLowerCase();
    const emailLower = (f.Email || '').toLowerCase();
    const officeLower = (f.Office || '').toLowerCase();

    // Check full query
    if (
      nameLower.includes(query) ||
      deptLower.includes(query) ||
      specLower.includes(query) ||
      emailLower.includes(query) ||
      officeLower.includes(query)
    ) {
      return true;
    }

    // Check terms
    if (cleanedSearchTerms.length > 0) {
      return cleanedSearchTerms.every(
        (term) =>
          nameLower.includes(term) ||
          deptLower.includes(term) ||
          specLower.includes(term) ||
          emailLower.includes(term) ||
          officeLower.includes(term)
      );
    }

    return false;
  });

  if (matches.length > 0) {
    return matches;
  }

  // If no strict all-terms match, try any-term match
  if (cleanedSearchTerms.length > 1) {
    const partialMatches = fallbackFaculty.filter((f) => {
      const nameLower = (f.Name || '').toLowerCase();
      return cleanedSearchTerms.some((term) => nameLower.includes(term));
    });
    if (partialMatches.length > 0) return partialMatches;
  }

  return null;
}
