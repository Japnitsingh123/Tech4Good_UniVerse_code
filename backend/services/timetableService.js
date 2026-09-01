// backend/services/timetableService.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const timetable = []; // Flattened, searchable timetable entries

const possiblePaths = [
  path.resolve(__dirname, '../timetable-data.json'),
  path.resolve(__dirname, '../../timetable-data.json'),
  path.resolve('./timetable-data.json'),
  path.resolve('./backend/timetable-data.json'),
];

function parseCourseInfo(courseInfo) {
  const parts = courseInfo.trim().split(' ').filter(Boolean);
  let subject = 'N/A',
    type = 'N/A',
    room = 'N/A';

  if (parts.length === 0) {
    return { subject, type, room };
  }

  room = parts.pop();

  if (parts.length > 0 && ['L', 'P', 'T'].includes(parts[parts.length - 1].toUpperCase())) {
    type = parts.pop().toUpperCase();
  }

  subject = parts.join(' ');

  if (subject === '' && room !== 'N/A') {
    subject = room;
    room = 'N/A';
  }

  if (!subject) {
    subject = 'N/A';
  }

  return { subject, type, room };
}

export function loadTimetableData() {
  timetable.length = 0; // Clear existing
  let loaded = false;

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        console.log(`▶ Loading timetable data from: ${p}`);
        const fileContent = fs.readFileSync(p, 'utf8');
        const allData = JSON.parse(fileContent);

        for (const category in allData) {
          const batches = allData[category];

          for (const batchCode in batches) {
            const grid = batches[batchCode];
            if (!Array.isArray(grid) || grid.length < 2) continue;

            const headerRow = grid[0];
            const days = headerRow.slice(1).map((cell) => cell.course.trim());

            for (let i = 1; i < grid.length; i++) {
              const timeRow = grid[i];
              if (!timeRow || timeRow.length === 0) continue;
              const timeSlot = timeRow[0].course.trim();

              for (let j = 1; j < timeRow.length; j++) {
                const day = days[j - 1];

                if (day && timeRow[j] && timeRow[j].course && timeRow[j].course.trim() !== '') {
                  const courseInfoStr = timeRow[j].course.trim();
                  const { subject, type, room } = parseCourseInfo(courseInfoStr);

                  timetable.push({
                    group: batchCode.trim().toUpperCase().replace(/[^A-Z0-9]/gi, ''),
                    rawGroup: batchCode.trim().toUpperCase(),
                    branch: category.toUpperCase(),
                    day: day.trim(),
                    time: timeSlot,
                    subject: subject,
                    type: type,
                    room: room,
                  });
                }
              }
            }
          }
        }

        console.log(`✅ Successfully loaded and flattened ${timetable.length} timetable entries.`);
        loaded = true;
        break;
      } catch (err) {
        console.error(`❌ Error parsing timetable file at ${p}:`, err.message);
      }
    }
  }

  if (!loaded) {
    console.warn("⚠️ Warning: Could not find 'timetable-data.json'.");
  }
}

/**
 * Gets the schedule for a specific batch.
 */
export function getScheduleForBatch(batchName, targetDay = null) {
  if (timetable.length === 0) {
    loadTimetableData();
  }

  if (timetable.length === 0) {
    return { error: 'Sorry, the timetable database is currently empty.' };
  }

  if (!batchName) {
    return { error: 'Please provide a valid batch code, such as 2C24 or 1A11.' };
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let dayToFetch;
  if (targetDay) {
    const cleanDay = targetDay.trim().toLowerCase();
    const matchedDay = days.find((d) => d.toLowerCase() === cleanDay || d.toLowerCase().startsWith(cleanDay.slice(0, 3)));
    dayToFetch = matchedDay || targetDay.charAt(0).toUpperCase() + targetDay.slice(1).toLowerCase();
  } else {
    const currentDayIndex = new Date().getDay();
    // If Sunday, default to Monday for a better student experience
    dayToFetch = currentDayIndex === 0 ? 'Monday' : days[currentDayIndex];
  }

  const dayString = targetDay ? `on ${dayToFetch}` : `for today (${dayToFetch})`;
  const cleanBatch = batchName.trim().toUpperCase().replace(/[^A-Z0-9]/gi, '');

  const todaysSchedule = timetable.filter(
    (slot) => slot.group === cleanBatch && slot.day.toLowerCase() === dayToFetch.toLowerCase()
  );

  const isValidBatch = timetable.some((slot) => slot.group === cleanBatch);

  if (todaysSchedule.length === 0) {
    if (isValidBatch) {
      return {
        title: `Schedule for **${batchName.toUpperCase()}** ${dayString}`,
        schedule: [
          {
            time: 'All Day',
            subject: 'No classes scheduled / Off day',
            type: 'Free',
            room: 'N/A',
          },
        ],
      };
    } else {
      const sampleBatches = Array.from(new Set(timetable.map((s) => s.rawGroup))).slice(0, 6).join(', ');
      return {
        error: `Sorry, I couldn't find any batch matching "${batchName}". Try one of: ${sampleBatches}`,
      };
    }
  }

  const scheduleSorted = todaysSchedule.sort((a, b) => {
    return a.time.localeCompare(b.time, undefined, { numeric: true, sensitivity: 'base' });
  });

  return {
    title: `Schedule for **${batchName.toUpperCase()}** ${dayString}`,
    schedule: scheduleSorted,
  };
}