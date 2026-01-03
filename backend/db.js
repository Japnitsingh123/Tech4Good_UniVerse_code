import mysql from "mysql2";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

let sslConfig = null;

if (process.env.DB_SSL === "true") {
  try {
    sslConfig = {
      ca: fs.readFileSync(process.env.DB_SSL_CA),
      rejectUnauthorized: false,
    };
  } catch (err) {
    console.error("⚠️ Failed to load SSL certificate:", err.message);
  }
}

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL pool connection failed:", err.message);
  } else {
    console.log("✅ MySQL connection pool created successfully!");
    connection.release();
  }
});

export default db;
