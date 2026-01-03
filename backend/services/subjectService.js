// backend/services/subjectService.js
import fs from 'fs';
import path from 'path';

let subjects = []; // This will store the data from subjects.json
const SUBJECTS_PATH = path.resolve('./subjects.json'); // Points to the file in your backend folder

/**
 * Loads the subjects.json data into memory.
 * Called once when the server starts.
 */
// REPLACE your loadSubjectData function with this one

/**
 * Loads the subjects.json data into memory.
 * Called once when the server starts.
 */
export function loadSubjectData() {
  console.log(`▶ Loading subject data from local file: ${SUBJECTS_PATH}`);
  try {
    const fileContent = fs.readFileSync(SUBJECTS_PATH, 'utf8');
    const parsedData = JSON.parse(fileContent);

    let subjectArray;

    // --- FIX: Check if parsed data is an array or an object ---
    if (Array.isArray(parsedData)) {
      // It's already an array, use it directly
      subjectArray = parsedData;
    } else if (typeof parsedData === 'object' && parsedData !== null) {
      // It's an object. Let's assume the subjects are the *values* of this object.
      // e.g., { "UCS312": { "name": ... }, "UCS411": { "name": ... } }
      console.log("ℹ️ subjects.json is an object, converting values to an array.");
      subjectArray = Object.values(parsedData);
    } else {
      // It's something else (e.g., just a string or number), which is wrong.
      throw new Error("JSON data is not an array or a valid object.");
    }
    // --- END FIX ---
    
    // Pre-process data for easier searching
    subjects = subjectArray.map(subject => ({
        ...subject,
        // Create searchable versions
        searchCode: subject.code ? subject.code.toUpperCase() : '', 
        searchName: subject.name ? subject.name.toLowerCase() : ''
    }));

    console.log(`✅ Successfully loaded ${subjects.length} subject entries.`);
  } catch (err) {
    console.error('❌ ERROR: Could not load subjects.json.', err.message);
    console.error("   Make sure 'subjects.json' exists in your 'backend' folder and is a valid JSON array or object.");
  }
}

/**
 * Finds a single subject by code or name.
 */
export function findSubject(query) {
  if (!query || subjects.length === 0) {
    return null;
  }

  const cleanQuery = query.trim();
  const upperQuery = cleanQuery.toUpperCase();
  const lowerQuery = cleanQuery.toLowerCase();

  // Try to find by exact code first
  let subject = subjects.find(s => s.searchCode === upperQuery);
  if (subject) return subject;

  // Try to find by partial name
  subject = subjects.find(s => s.searchName.includes(lowerQuery));
  if (subject) return subject;

  return null; // No match found
}