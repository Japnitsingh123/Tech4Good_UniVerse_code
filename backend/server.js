import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import promptRoute from "./routes/promptRoute.js";
import chatRoute from "./routes/chatRoute.js"; // FIXED CASE
import { loadTimetableData } from "./services/timetableService.js";
import { loadSubjectData } from "./services/subjectService.js";

dotenv.config();
const app = express();

// Load data on startup
loadTimetableData();
loadSubjectData();

app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "CampusGPT Backend Running 🚀" });
});

// OLD ROUTE — needed by your UI
app.use("/api/prompt", promptRoute);

// NEW NLP-Gemini powered chat route
app.use("/api/chat", chatRoute);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`\n====================================`);
  console.log(`✅ CampusGPT Server running on port ${PORT}`);
  console.log(`====================================\n`);
});
