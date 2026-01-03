// scraper.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const GROUP_ID = '1A12'; 

const TIMETABLE_API_URL = `https://timetable.acmthapar.in/api/${GROUP_ID}`; 

const GROUP_NAME = GROUP_ID; 

const TIMETABLE_URL = 'https://timetable.acmthapar.in/schedule/1A12'; 


async function fetchAndParseTimetable() {
  console.log(`▶ Fetching timetable data from API: ${TIMETABLE_API_URL}`);
  try {
    // 1. Call the API directly. Axios will automatically parse the JSON.
    const { data: scheduleMatrix } = await axios.get(TIMETABLE_API_URL);
    
    let timetableData = [];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // 2. The rest of the logic is the same, as the JSON structure is identical to before.
    for (const time in scheduleMatrix) {
      const daySlots = scheduleMatrix[time];
      for (let dayIndex = 0; dayIndex < daySlots.length; dayIndex++) {
        const slot = daySlots[dayIndex];
        
        if (slot && slot[0] && slot[0].trim() !== '') {
          const day = daysOfWeek[dayIndex];
          
          timetableData.push({
            groupName: GROUP_NAME,
            dayOfWeek: day,
            timeSlot: time,
            classType: slot[0],
            courseName: slot[1],
            room: slot[2],
            courseCode: slot[3],
          });
        }
      }
    }

    console.log(`✅ Found and parsed ${timetableData.length} class slots from API.`);
    return timetableData;

  } catch (error) {
    // This will catch errors if the API is down or the group ID is invalid
    console.error('❌ Error fetching data from API:', error.message);
    return [];
  }
}
async function insertDataIntoDB(timetableSlots) {
  if (timetableSlots.length === 0) {
    console.log('No timetable data to insert.');
    return;
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST, user: process.env.DB_USER,
      password: process.env.DB_PASS, database: process.env.DB_NAME,
    });
    console.log('▶ Connected to the database.');


    console.log(`▶ Clearing old data for group: "${GROUP_NAME}"...`);
    await connection.query('DELETE FROM Timetable WHERE GroupName = ?', [GROUP_NAME]);
    console.log(`✅ Old data for "${GROUP_NAME}" cleared.`);

    const sql = `
      INSERT INTO Timetable (GroupName, DayOfWeek, TimeSlot, ClassType, CourseName, Room, CourseCode) 
      VALUES ?
    `;

    const values = timetableSlots.map(slot => [
      slot.groupName, slot.dayOfWeek, slot.timeSlot, slot.classType,
      slot.courseName, slot.room, slot.courseCode
    ]);

    const [result] = await connection.query(sql, [values]);
    console.log(`✅ Successfully inserted ${result.affectedRows} new class slots for "${GROUP_NAME}".`);

  } catch (error) {
    console.error('❌ Error during database operation:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}


async function main() {
  const timetableData = await fetchAndParseTimetable();
  await insertDataIntoDB(timetableData);
}

main();