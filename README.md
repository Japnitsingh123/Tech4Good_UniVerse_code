# 🎓 UniVerse — CampusGPT

**An intelligent, AI-powered campus assistant and interactive navigation platform for Thapar Institute of Engineering & Technology (TIET).**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Production-success?style=flat-square&logo=vercel)](https://tech4good-universe.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20(Python%203.11)-blue?style=flat-square&logo=fastapi)](https://tech4good-universe.vercel.app/api/chat)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Leaflet-61DAFB?style=flat-square&logo=react)](https://tech4good-universe.vercel.app)
[![AI / NLP](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%20Flash-orange?style=flat-square&logo=google)](https://ai.google.dev/)

UniVerse centralizes all everyday campus utilities into a single unified conversational interface. Students can query **batch timetables, 540+ faculty contacts, course syllabi, cafeteria menus with payment QR codes, DoAA academic regulations, and health center timings**, alongside an interactive **Leaflet campus navigation map** with Dijkstra shortest-path calculations.

---

## 🌐 Live Production Links

| Service | URL | Status |
| :--- | :--- | :--- |
| **🚀 Main Web App** | **[https://tech4good-universe.vercel.app](https://tech4good-universe.vercel.app)** | ✅ Active (Vercel) |
| **📡 NLP Chat API** | **[https://tech4good-universe.vercel.app/api/chat](https://tech4good-universe.vercel.app/api/chat)** | ✅ Active (FastAPI Serverless) |
| **💻 GitHub Repository** | **[https://github.com/Japnitsingh123/Tech4Good_UniVerse_code](https://github.com/Japnitsingh123/Tech4Good_UniVerse_code)** | ✅ Synchronized (`main`) |

---

## 🚀 Key Features

### 🤖 1. NLP-Driven Conversational Assistant
- **Gemini NLP Engine**: Extracts intent and structured entities from natural language queries.
- **Rich Interactive UI Cards**: Renders specialized cards for timetable slots, faculty contacts, cafeteria menus, and emergency numbers instead of plain text blobs.
- **Fail-Safe Fallbacks**: Multi-tier intent router with keyword heuristics to ensure reliable answers even during network degradation.

### 📅 2. Comprehensive Timetable Intelligence (425 Batches)
- **11,000+ Class Slots**: Real-time lookup for lectures, practical labs, and tutorials across all engineering departments.
- **Day & Slot Filtering**: Instant schedule breakdowns for any day (e.g., *"what is the 2C24 timetable on Tuesday?"*).
- **Dedicated Timetable Explorer Tab**: Dropdown selector to browse schedules across any batch and weekday.

### 👨‍🏫 3. Exhaustive Faculty Directory (546 Professors)
- **Complete Campus Coverage**: Faculty records across Computer Science, Electrical, Mechanical, Mathematics, Civil, Biotechnology, and more.
- **Instant Search & Contact**: Office numbers, official email links, research specializations, and academic profile links.
- **Hybrid Database**: Queries live MySQL database first with seamless fallback to offline JSON dataset.

### 🍔 4. Campus Dining & Cafeterias
- **Menus & Hours**: Complete menu cards for Pizza Nation, Dessert Club, Chilli Chitkara, G-Block Canteen, Jaggi Samosa, Nescafe, and Campus Bite.
- **UPI QR Code Integration**: In-app scanner cards for frictionless mobile payments.

### 📜 5. DoAA Procedures & Certificate Guidelines
- Step-by-step guides for group/sub-group changes, backlog/additional course registration, elective modifications, fee extensions, make-up MST exams, and official affidavits.

### 🏥 6. Health & Emergency Support
- Health Centre operating hours, doctor shifts, location guidance, and direct-dial emergency hotlines.

### 🗺️ 7. Interactive Campus Map & Navigation
- Full Leaflet map with campus buildings, hostels, cafeterias, and gates.
- Shortest-path navigation using **Dijkstra's Algorithm** with **Haversine distance** calculation and browser geolocation tracking.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│               React 19 Frontend (SPA)                  │
│   • Chat Assistant UI       • Dedicated Feature Tabs   │
│   • Leaflet Navigation Map  • Lightbox & Modals        │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP POST /api/chat
                            ▼
┌────────────────────────────────────────────────────────┐
│            Python FastAPI Backend (REST API)           │
│   • CORS Middleware         • Schema Validation        │
│   • Vercel Serverless API   • Multi-Route Handling     │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
              ▼                           ▼
┌───────────────────────────┐   ┌────────────────────────┐
│     Google Gemini NLP     │   │      Service Layer     │
│   • Intent Classification │   │ • Timetable (425)      │
│   • Entity Extraction     │   │ • Faculty (546)        │
│   • Rule-based Fallbacks  │   │ • Cafeteria & Menus    │
└───────────────────────────┘   │ • DoAA & Certificates  │
                                │ • Dispensary & Health  │
                                └───────────┬────────────┘
                                            │
                                            ▼
                                ┌────────────────────────┐
                                │      Data Sources      │
                                │ • MySQL Pool (PyMySQL) │
                                │ • Local JSON Datasets  │
                                └────────────────────────┘
```

---

## 📁 Repository Structure

```text
Tech4Good_UniVerse_code/
├── api/
│   └── index.py                    # Vercel serverless entrypoint for FastAPI
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic request & response models
│   │   ├── nlp/
│   │   │   └── gemini_nlp.py       # Google Gemini intent & entity extractor
│   │   ├── routes/
│   │   │   └── chat_route.py       # Unified /api/chat endpoint & DoAA routes
│   │   ├── services/
│   │   │   ├── cafeteria_service.py    # Cafeteria menus & payment QR lookup
│   │   │   ├── certificate_service.py  # Certificate & affidavit instructions
│   │   │   ├── dispensary_service.py   # Health center timings & hotlines
│   │   │   ├── doaa_service.py         # Academic procedures & guidelines
│   │   │   ├── faculty_service.py      # 546+ faculty directory search
│   │   │   ├── subject_service.py      # Course syllabi & credit lookup
│   │   │   └── timetable_service.py    # 425 batch schedules & slot planner
│   │   ├── config.py               # App configuration & environment parsing
│   │   ├── db.py                   # MySQL connection pool with auto-fallback
│   │   └── main.py                 # FastAPI application definition & lifespan
│   ├── data/
│   │   └── faculty.json            # 546 scraped faculty records
│   ├── requirements.txt            # Python dependencies for backend
│   ├── run.py                      # Local development launcher (port 5001)
│   ├── scrape_faculty.py           # Scraping pipeline for faculty directory
│   ├── subjects.json               # 1,215 academic subject descriptions & credits
│   ├── test_backend.py             # Integration test suite for API endpoints
│   └── timetable-data.json         # 11,027 class slots across 425 batches
├── campusgpt-frontend/
│   ├── public/                     # Static HTML & public assets
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.js          # Navigation sidebar
│   │   ├── App.css                 # Dark Glassmorphism UI styling
│   │   ├── App.js                  # Main chat interface & tab controllers
│   │   ├── MapComponent.js         # Leaflet campus map & Dijkstra routing
│   │   └── UserManualModal.js      # User guide modal
│   ├── package.json                # Frontend scripts & dependencies
│   └── serve.cjs                   # Static production server for local preview
├── .gitignore                      # Git exclusion rules
├── package.json                    # Root build orchestration script
├── requirements.txt                # Root requirements for Vercel build
├── vercel.json                     # Vercel deployment & rewrite configuration
└── README.md                       # Documentation
```

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 19, JavaScript (ES6+), React-Markdown, Leaflet, React-Leaflet, Framer Motion, React-Icons, CSS Glassmorphism |
| **Backend** | Python 3.11, FastAPI, Uvicorn, Pydantic v2, PyMySQL, Cryptography, python-dotenv |
| **AI / NLP** | Google Generative AI (`gemini-2.5-flash` / `gemini-1.5-flash`) with JSON mode schema extraction |
| **Database** | MySQL (Connection Pooling) + Local JSON Datasets (546 Faculty, 11,027 Timetable Slots, 1,215 Subjects) |
| **Deployment** | Vercel (Python Serverless Function Runtime + Static React SPA) |

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- **Node.js** (v18 or v20+)
- **Python** (v3.10 or v3.11+)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/Japnitsingh123/Tech4Good_UniVerse_code.git
cd Tech4Good_UniVerse_code
```

### 3. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5001

# Optional MySQL Configuration (falls back to local JSON if omitted):
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=campusgpt
DB_PORT=3306
```

Start the backend server:
```bash
python run.py
```
> The API will be live at `http://localhost:5001`. You can visit `http://localhost:5001/docs` for interactive Swagger UI documentation.

### 4. Frontend Setup (React)
Open a new terminal window:
```bash
cd campusgpt-frontend
npm install
npm start
```
> The React web app will open at `http://localhost:3000`.

---

## 🧪 Testing Backend Services

Run the automated integration test suite:
```bash
cd backend
python test_backend.py
```

Expected output:
```text
==================================================
🧪 Starting CampusGPT Backend Integration Tests...
==================================================
✅ Health Check passed
✅ Greeting Intent passed
✅ Timetable (2C24) passed: Schedule for 2C24
✅ Faculty Search (Dr. Deepak Garg) passed: Found 1 records
✅ Dispensary Info passed: Thapar University Health Centre
✅ Cafeteria Info (Pizza Nation) passed: Pizza Nation
✅ DOAA Procedures passed
==================================================
🎉 ALL TESTS PASSED SUCCESSFULLY!
==================================================
```

---

## 🎯 Example Prompts to Try

- 📅 **Timetables**: *"What is the schedule for 2C24 on Monday?"*, *"1A11 timetable"*
- 👨‍🏫 **Faculty Directory**: *"Where is Dr. Raj Kumar Gupta's office?"*, *"Tell me about Dr. Deepak Garg"*
- 📚 **Course Syllabi**: *"Tell me about UCS312"*, *"Operating Systems course credits"*
- 🍔 **Food & Cafes**: *"Show me Pizza Nation menu"*, *"Nescafe hours and scanner"*
- 🏛️ **Academic Policies**: *"How to change subgroup?"*, *"How to apply for makeup MST?"*
- 🏥 **Health & Dispensary**: *"What are the dispensary timings?"*, *"Emergency medical helpline"*

---

## 👥 Authors & Acknowledgements
- Developed for **Tech4Good (UniVerse Campus Assistant)**
- Designed for the students, faculty, and community of **Thapar Institute of Engineering & Technology (TIET)**.
