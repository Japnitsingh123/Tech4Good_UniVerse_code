// scraper.js
import axios from "axios";
import * as cheerio from "cheerio";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();


const FACULTY_LIST_URL = "https://med.thapar.edu/faculty";
const BASE_URL = "https://med.thapar.edu";



async function fetchFacultyData() {
  console.log(`▶ Fetching data from: ${FACULTY_LIST_URL}`);
  try {
    const { data } = await axios.get(FACULTY_LIST_URL);
    const $ = cheerio.load(data);
    const faculties = [];


    $("div.faculty-elem").each((index, element) => {
      const name = $(element)
        .find(".faculty-design p strong")
        .first()
        .text()
        .trim();


      if (name) {

        const specialization = $(element)
          .find('p:contains("Specialization")')
          .next("p")
          .text()
          .trim();
        const email = $(element)
          .find('p:contains("Email")')
          .next("p")
          .text()
          .trim();
        let profileLink = $(element)
          .find('a:contains("Read More")')
          .attr("href");


        if (profileLink && !profileLink.startsWith("http")) {
          profileLink = new URL(profileLink, BASE_URL).href;
        }

        faculties.push({
          name: name,
          email: email,
          department: 'Mechanical Engineering Department',
          specialization: specialization, // MAPPING: 'Department' column gets the scraped 'Specialization'
          office: "A211 CSED", // MAPPING: 'Office' column gets a default hardcoded value
          link: profileLink, // MAPPING: 'link' column gets the href
        });
      }
    });

    console.log(`✅ Found ${faculties.length} faculty members.`);
    return faculties;
  } catch (error) {
    console.error("❌ Error fetching or parsing data:", error.message);
    return [];
  }
}

/**
 * Inserts the collected faculty data into your existing MySQL table.
 * @param {Array<object>} faculties - An array of faculty objects.
 */
async function insertDataIntoDB(faculties) {
  if (faculties.length === 0) {
    console.log("No faculty data to insert.");
    return;
  }

  let connection;
  try {
    console.log("▶ Connecting to the database...");
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    console.log("✅ Database connected successfully.");

    // Clear the table first to avoid creating duplicate entries on re-runs
    // console.log("▶ Clearing existing data from Faculty table...");
    // await connection.query("TRUNCATE TABLE Faculty");
    // console.log("✅ Faculty table cleared.");

    // SQL query matching your original table structure
    const sql = `
      INSERT INTO Faculty (Name, Email, Department, Office, link) 
      VALUES ?
    `;

    // Map the scraped data to the columns in the correct order for bulk insertion
    const values = faculties.map((f) => [
      f.name,
      f.email,
      f.department,
      f.office,
      f.link,
    ]);

    console.log(
      `▶ Inserting ${values.length} new faculty members into the table...`
    );
    const [result] = await connection.query(sql, [values]);
    console.log(
      `✅ Successfully inserted ${result.affectedRows} faculty members.`
    );
  } catch (error) {
    console.error("❌ Error during database operation:", error.message);
  } finally {
    if (connection) {
      console.log("▶ Closing database connection.");
      await connection.end();
    }
  }
}

/**
 * The main function to run the entire process.
 */
async function main() {
  const facultyData = await fetchFacultyData();
  await insertDataIntoDB(facultyData);
}

// Run the main function
main();
