import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import promptRoute from "./routes/promptRoute.js";
import chatRoute from "./routes/chatRoute.js";
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

// Legacy prompt route
app.use("/api/prompt", promptRoute);

// Primary NLP-powered chat route
app.use("/api/chat", chatRoute);

const PORT = process.env.PORT || 5001;

// Only listen directly when not running in serverless environment (like Vercel)
if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`\n====================================`);
    console.log(`✅ CampusGPT Server running on port ${PORT}`);
    console.log(`====================================\n`);
  });
}

export default app;
