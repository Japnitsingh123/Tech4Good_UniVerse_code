# 🎓 UniVerse — CampusGPT

**An AI-powered campus assistant for Thapar Institute of Engineering & Technology (TIET).**

UniVerse centralizes common campus information into a single conversational interface. Students can ask about **timetables, faculty, subjects, cafeterias, certificates, DoAA procedures, and campus facilities**, while an interactive map provides campus navigation and route visualization.

---

## 🚀 Features

### 🤖 AI Campus Assistant

Ask natural-language questions about campus services and information.

The system uses **Google Gemini** for intent detection and entity extraction, then routes the request to the appropriate backend service.

### 📚 Academic Information

* Faculty details and contact information
* Subject information
* Course credits and prerequisites
* Batch-wise timetables
* Day-specific timetable queries

### 📝 Student Services

Provides information about:

* DoAA procedures
* Subject addition/drop
* Group and subgroup changes
* Elective changes
* Make-up tests
* Fee-related procedures
* Certificates and required documentation

### 🍔 Campus Cafeteria Information

Provides cafeteria-specific information including:

* Menu
* Cafeteria name
* QR/scanner information where available

### 🏥 Health Centre

Provides information about the campus dispensary/health centre including:

* Location
* Operating hours
* Contact information

### 🗺️ Interactive Campus Navigation

* Interactive Leaflet map
* Campus buildings and facilities
* Current-location tracking
* Route visualization
* Shortest-path calculation
* Walking distance estimation

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │                     │
                    │  Chat + Campus Map  │
                    └──────────┬──────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Gemini NLP Layer  │
                    │ Intent + Entities   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼─────────────────┐
              │                │                 │
              ▼                ▼                 ▼
        Academic Data    Student Services   Campus Services
              │                │                 │
              ▼                ▼                 ▼
           MySQL /          JSON Data       Local Services
        Local Data Sources
```

---

## 🧠 How the AI Assistant Works

When a student sends a message:

```text
User Query
    ↓
Gemini NLP
    ↓
Intent Detection + Entity Extraction
    ↓
Backend Service
    ↓
Retrieve Relevant Information
    ↓
Structured API Response
    ↓
React UI
```

For example:

```text
"Show me the timetable for 2C24 on Monday"
                    ↓
          Gemini Intent Detection
                    ↓
             timetable_info
                    ↓
        Timetable Service
                    ↓
          Batch + Day Schedule
                    ↓
             React Interface
```

The NLP layer identifies intents such as:

* `timetable_info`
* `cafeteria_menu`
* `subject_info`
* `certificate_info`
* `doaa_info`
* `dispensary_info`
* `faculty_info`
* `general_query`

---

## 🗺️ Campus Navigation

The frontend contains an interactive **Leaflet** map with campus locations such as academic blocks, hostels, library, sports complex, cafeterias, gates, and other facilities.

The navigation system:

```text
Start Location
      ↓
Destination
      ↓
Campus Location Graph
      ↓
Distance Calculation
      ↓
Shortest Path
      ↓
Route Visualization
```

The project uses **Haversine distance** between campus coordinates and a weighted graph to calculate shortest paths using **Dijkstra's algorithm**.

The application also supports browser-based geolocation to display and track the user's current position.

---

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript
* Leaflet
* React Leaflet
* Framer Motion
* React Markdown
* React Icons
* CSS

### Backend

* Node.js
* Express.js
* REST APIs
* MySQL
* MySQL2

### AI / NLP

* Google Gemini API
* Gemini-based intent classification
* Entity extraction

### Algorithms & Services

* Dijkstra's Shortest Path Algorithm
* Haversine Distance
* Graph-based campus navigation
* Browser Geolocation API

---

## 📁 Project Structure

```text
UniVerse/
│
├── backend/
│   ├── data/
│   ├── nlp/
│   │   └── geminiNLP.js
│   │
│   ├── routes/
│   │   ├── chatRoute.js
│   │   └── promptRoute.js
│   │
│   ├── services/
│   │   ├── cafeteriaService.js
│   │   ├── certificateService.js
│   │   ├── dispensaryService.js
│   │   ├── doaaService.js
│   │   ├── facultyService.js
│   │   ├── subjectService.js
│   │   └── timetableService.js
│   │
│   ├── db.js
│   └── server.js
│
└── campusgpt-frontend/
    ├── public/
    └── src/
        ├── components/
        ├── App.js
        ├── MapComponent.js
        └── ...
```

---

## ⚙️ Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file with the required Gemini and MySQL configuration:

```env
GEMINI_API_KEY=your_gemini_api_key

DB_HOST=your_database_host
DB_USER=your_database_user
DB_PORT=your_database_port
DB_PASS=your_database_password
DB_NAME=your_database_name
```

Start the backend:

```bash
node server.js
```

The backend runs on the configured port, with `5001` as the default.

### Frontend

```bash
cd campusgpt-frontend
npm install
npm start
```

The React development server runs on:

```text
http://localhost:3000
```

---

## 🎯 Example Queries

```text
"What is the timetable for 2C24?"

"Show me Dr. Raj Kumar Gupta's details"

"What are the credits for UCS303?"

"How do I change my subgroup?"

"How can I apply for an additional subject?"

"Show me the Pizza Nation menu"

"Where is the dispensary?"
```

The assistant detects the user's intent and returns the appropriate structured information.

---

## 💡 Key Design Decisions

### Gemini for Intent Detection

Instead of treating every query as a generic chatbot prompt, Gemini converts natural-language queries into a structured **intent + entity** representation.

This allows the backend to route each request to a specialized service.

### Service-Based Backend

Different campus functionalities are separated into individual services, making the backend modular and easier to maintain.

### Graph-Based Navigation

Campus locations are represented as nodes with distance-based edges, allowing shortest routes to be calculated using Dijkstra's algorithm.

### Structured Responses

The backend returns different response types such as:

```text
faculty_info
subject_info
timetable_display
cafeteria_info
dispensary_info
simple_message
```

The React frontend then renders each response appropriately.

---

## 🔮 Future Improvements

* Replace keyword/rule-heavy intent handling with a more robust intent-routing architecture.
* Add authentication and personalized student profiles.
* Integrate real-time campus announcements and events.
* Improve navigation using real road/path data instead of distance-based graph edges.
* Add a scalable database and caching layer for frequently accessed campus information.
* Expand the assistant to support more student services.

##
