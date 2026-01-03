// // backend/services/timetableService.js
// import fs from 'fs';
// import path from 'path';

// const timetable = []; // This will store our flattened, searchable data
// const TIMETABLE_PATH = path.resolve('./full_timetable.json'); // Points to your new file

// /**
//  * Helper function to parse the complex "course" string.
//  * e.g., "UES102 L LP101 " -> { subject: "UES102", type: "L", room: "LP101" }
//  * e.g., "LAB LC27 " -> { subject: "LAB", type: "N/A", room: "LC27" }
//  * e.g., "PROFESSIONAL COMMUNICATION G123 " -> { subject: "PROFESSIONAL COMMUNICATION", type: "N/A", room: "G123" }
//  */
// function parseCourseInfo(courseInfo) {
//   const parts = courseInfo.trim().split(' ').filter(Boolean);
//   let subject = "N/A", type = "N/A", room = "N/A";

//   if (parts.length === 0) {
//     return { subject, type, room };
//   }
  
//   // Assume last part is always the room/location
//   room = parts.pop();
  
//   // Check if second-to-last part is a known type (L, P, T)
//   if (parts.length > 0 && ['L', 'P', 'T'].includes(parts[parts.length - 1].toUpperCase())) {
//     type = parts.pop().toUpperCase();
//   }

//   // Whatever is left is the subject
//   subject = parts.join(' ');
  
//   // Handle cases where the room might have been part of the subject (e.g., "LAB")
//   if (subject === "" && room !== "N/A") {
//     subject = room;
//     room = "N/A"; // Set room to N/A as it was part of the subject
//   }
  
//   if (!subject) {
//       subject = "N/A";
//   }

//   return { subject, type, room };
// }

// /**
//  * Loads and flattens the new, complex timetable data from full_timetable.json.
//  * This function is called once when the server starts.
//  */
// export function loadTimetableData() {
//   console.log(`▶ Loading full timetable data from: ${TIMETABLE_PATH}`);
//   try {
//     const fileContent = fs.readFileSync(TIMETABLE_PATH, 'utf8');
//     const allData = JSON.parse(fileContent);

//     // Loop 1: Categories (e.g., "1st YEAR A")
//     for (const category in allData) {
//       const batches = allData[category];
      
//       // Loop 2: Batch Codes (e.g., "1A11")
//       for (const batchCode in batches) {
//         const grid = batches[batchCode];
        
//         // Get the header row to find the days
//         const headerRow = grid[0]; // e.g., [{"course": "Timings"}, {"course": "Monday"}, ...]
//         // Get days from index 1 onwards
//         const days = headerRow.slice(1).map(cell => cell.course.trim()); // ["Monday", "Tuesday", ...]

//         // Loop 3: Time Rows (skip header row at index 0)
//         for (let i = 1; i < grid.length; i++) {
//           const timeRow = grid[i];
//           const timeSlot = timeRow[0].course.trim(); // e.g., "8:00am"

//           // Loop 4: Cells for each day (start from cell index 1)
//           for (let j = 1; j < timeRow.length; j++) {
//             const day = days[j - 1]; // Get day from header (j=1 -> days[0])
            
//             // Check if a class exists
//             if (day && timeRow[j] && timeRow[j].course && timeRow[j].course.trim() !== "") {
//               const courseInfoStr = timeRow[j].course.trim();
//               const { subject, type, room } = parseCourseInfo(courseInfoStr);

//               timetable.push({
//                 group: batchCode.toUpperCase(), // "1A11"
//                 branch: category.toUpperCase(), // "1ST YEAR A"
//                 day: day, // "Monday"
//                 time: timeSlot, // "9:40:am"
//                 subject: subject, // "PROFESSIONAL COMMUNICATION"
//                 type: type, // "N/A"
//                 room: room // "LP101"
//               });
//             }
//           }
//         }
//       }
//     }
    
//     console.log(`✅ Successfully loaded and flattened ${timetable.length} timetable entries.`);
//   } catch (err) {
//     console.error('❌ ERROR: Could not load full_timetable.json.', err.message);
//   }
// }

// /**
//  * Gets the schedule for a specific batch.
//  * If targetDay is provided, it fetches for that day.
//  * If targetDay is null, it fetches for the current day.
//  */
// export function getScheduleForBatch(batchName, targetDay = null) {
//   if (timetable.length === 0) {
//     return "Sorry, the timetable data is still loading. Please try again in a moment.";
//   }

//   let dayToFetch;
//   const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
//   if (targetDay) {
//     dayToFetch = targetDay.charAt(0).toUpperCase() + targetDay.slice(1).toLowerCase();
//   } else {
//     // Today is Sunday, 2 Nov 2025. Default to Monday for a better demo.
//     // dayToFetch = days[new Date().getDay()]; // This would return "Sunday"
//     dayToFetch = "Monday"; // HACK: Default to Monday. Change this as needed.
//   }
  
//   const dayString = targetDay ? `on ${dayToFetch}` : `for today (${dayToFetch})`;
//   const batchNameClean = batchName.trim().toUpperCase();

//   // Filter using the 'group' property
//   const todaysSchedule = timetable.filter(slot => 
//     slot.group === batchNameClean && slot.day === dayToFetch
//   );

//   if (todaysSchedule.length === 0) {
//     const isValidBatch = timetable.some(slot => slot.group === batchNameClean);
//     return isValidBatch
//       ? `🎉 No classes found for ${batchNameClean} ${dayString}.`
//       : `Sorry, I couldn't find any batch with the code '${batchNameClean}'. Try '1A11'.`;
//   }

//   const scheduleSorted = todaysSchedule.sort((a, b) => {
//     // Sort by time (e.g., "8:00am", "8:50:am", "9:40:am")
//     return a.time.localeCompare(b.time, undefined, { numeric: true, sensitivity: 'base' });
//   });

//   let responseStr = `Here is the schedule for **${batchNameClean}** ${dayString}:\n`;
//   responseStr += "---------------------------------\n";
  
//   for (const row of scheduleSorted) {
//     // Use new property names
//     responseStr += `🕒 **${row.time}:** ${row.subject} (${row.type}) in ${row.room}\n`;
//   }
  
//   return responseStr;
// }
// backend/services/timetableService.js
import fs from 'fs';
import path from 'path';

const timetable = []; // This will store our flattened, searchable data
const TIMETABLE_PATH = path.resolve('./timetable-data.json'); // Points to your new file

/**
 * Helper function to parse the complex "course" string.
 * e.g., "UES102 L LP101 " -> { subject: "UES102", type: "L", room: "LP101" }
 * e.g., "LAB LC27 " -> { subject: "LAB", type: "N/A", room: "LC27" }
 */
function parseCourseInfo(courseInfo) {
  const parts = courseInfo.trim().split(' ').filter(Boolean);
  let subject = "N/A", type = "N/A", room = "N/A";

  if (parts.length === 0) {
    return { subject, type, room };
  }
  
  room = parts.pop(); // Assume last part is always the room/location
  
  if (parts.length > 0 && ['L', 'P', 'T'].includes(parts[parts.length - 1].toUpperCase())) {
    type = parts.pop().toUpperCase();
  }

  subject = parts.join(' ');
  
  if (subject === "" && room !== "N/A") {
    subject = room;
    room = "N/A";
  }
  
  if (!subject) {
      subject = "N/A";
  }

  return { subject, type, room };
}

/**
 * Loads and flattens the new, complex timetable data from timetable-data.json.
 * This function is called once when the server starts.
 */
export function loadTimetableData() {
  console.log(`▶ Loading full timetable data from: ${TIMETABLE_PATH}`);
  try {
    const fileContent = fs.readFileSync(TIMETABLE_PATH, 'utf8');
    const allData = JSON.parse(fileContent);

    // Loop 1: Categories (e.g., "1st YEAR A")
    for (const category in allData) {
      const batches = allData[category];
      
      // Loop 2: Batch Codes (e.g., "1A11")
      for (const batchCode in batches) {
        const grid = batches[batchCode];
        
        const headerRow = grid[0]; // e.g., [{"course": "Timings"}, {"course": "Monday"}, ...]
        const days = headerRow.slice(1).map(cell => cell.course.trim()); // ["Monday", "Tuesday", ...]

        // Loop 3: Time Rows (skip header row at index 0)
        for (let i = 1; i < grid.length; i++) {
          const timeRow = grid[i];
          const timeSlot = timeRow[0].course.trim(); // e.g., "8:00am"

          // Loop 4: Cells for each day (start from cell index 1)
          for (let j = 1; j < timeRow.length; j++) {
            const day = days[j - 1]; // Get day from header (j=1 -> days[0])
            
            if (day && timeRow[j] && timeRow[j].course && timeRow[j].course.trim() !== "") {
              const courseInfoStr = timeRow[j].course.trim();
              const { subject, type, room } = parseCourseInfo(courseInfoStr);

              timetable.push({
                group: batchCode.toUpperCase(), // "1A11"
                branch: category.toUpperCase(), // "1ST YEAR A"
                day: day, // "Monday"
                time: timeSlot, // "9:40:am"
                subject: subject, // "PROFESSIONAL COMMUNICATION"
                type: type, // "N/A"
                room: room // "LP101"
              });
            }
          }
        }
      }
    }
    
    console.log(`✅ Successfully loaded and flattened ${timetable.length} timetable entries.`);
  } catch (err) {
    console.error('❌ ERROR: Could not load timetable-data.json.', err.message);
  }
}

/**
 * Gets the schedule for a specific batch.
 * If targetDay is provided, it fetches for that day.
//  * If targetDay is null, it fetches for the current day.
//  */
// export function getScheduleForBatch(batchName, targetDay = null) {
//   if (timetable.length === 0) {
//     return "Sorry, the timetable data is still loading. Please try again in a moment.";
//   }

//   let dayToFetch;
//   const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
//   if (targetDay) {
//     dayToFetch = targetDay.charAt(0).toUpperCase() + targetDay.slice(1).toLowerCase();
//   } else {
//     dayToFetch = days[new Date().getDay()]; // Gets current day, e.g., "Monday"
//   }
  
//   const dayString = targetDay ? `on ${dayToFetch}` : `for today (${dayToFetch})`;
//   const batchNameClean = batchName.trim().toUpperCase();

//   // Filter using the 'group' property
//   const todaysSchedule = timetable.filter(slot => 
//     slot.group === batchNameClean && slot.day === dayToFetch
//   );

//   if (todaysSchedule.length === 0) {
//     const isValidBatch = timetable.some(slot => slot.group === batchNameClean);
//     return isValidBatch
//       ? `🎉 No classes found for ${batchNameClean} ${dayString}.`
//       : `Sorry, I couldn't find any batch with the code '${batchNameClean}'. Try '1A11'.`;
//   }

//   const scheduleSorted = todaysSchedule.sort((a, b) => {
//     return a.time.localeCompare(b.time, undefined, { numeric: true, sensitivity: 'base' });
//   });

//   let responseStr = `Here is the schedule for **${batchNameClean}** ${dayString}:\n`;
//   responseStr += "---------------------------------\n";
  
//   for (const row of scheduleSorted) {
//     responseStr += `🕒 **${row.time}:** ${row.subject} (${row.type}) in ${row.room}\n`;
//   }
  
//   return responseStr;
// }
// REPLACE your getScheduleForBatch function with this

/**
 * Gets the schedule for a specific batch.
 * If targetDay is provided, it fetches for that day.
 * If targetDay is null, it fetches for the current day.
 */
export function getScheduleForBatch(batchName, targetDay = null) {
  if (timetable.length === 0) {
    // Return an error object
    return { error: "Sorry, the timetable data is still loading. Please try again in a moment." };
  }

  let dayToFetch;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (targetDay) {
    dayToFetch = targetDay.charAt(0).toUpperCase() + targetDay.slice(1).toLowerCase();
  } else {
    // Today is Monday, 3 Nov 2025.
    dayToFetch = days[new Date().getDay()]; // This will be "Monday"
  }

  const dayString = targetDay ? `on ${dayToFetch}` : `for today (${dayToFetch})`;
  const batchNameClean = batchName.trim().toUpperCase();

  const todaysSchedule = timetable.filter(slot => 
    slot.group === batchNameClean && slot.day === dayToFetch
  );

  if (todaysSchedule.length === 0) {
    const isValidBatch = timetable.some(slot => slot.group === batchNameClean);
    const message = isValidBatch
      ? `🎉 No classes found for ${batchNameClean} ${dayString}.`
      : `Sorry, I couldn't find any batch with the code '${batchNameClean}'. Try '1A11'.`;
    // Return an error object
    return { error: message };
  }

  const scheduleSorted = todaysSchedule.sort((a, b) => {
    return a.time.localeCompare(b.time, undefined, { numeric: true, sensitivity: 'base' });
  });

  // --- KEY CHANGE ---
  // Return the data as an object, not a string
  return {
    title: `Schedule for **${batchNameClean}** ${dayString}`, // Send title with markdown
    schedule: scheduleSorted // The array of class objects
  };
}