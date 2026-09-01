import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";
import "leaflet/dist/leaflet.css";
import MapComponent from "./MapComponent";
import "./UserManualModal.css";
import UserManualModal from "./UserManualModal";
import Sidebar from "./components/Sidebar";
import {
  FaRobot,
  FaPaperPlane,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaUtensils,
  FaInfoCircle,
  FaSearch,
  FaRegCopy,
  FaCheck,
  FaTrashAlt,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaEnvelope,
  FaExternalLinkAlt,
  FaQrcode,
  FaTimes,
  FaChevronRight,
  FaHospitalAlt
} from "react-icons/fa";

// Embedded data for instant dedicated tab browsing
const ALL_FACULTY = [
  {
    FacultyID: 1,
    Name: "Dr. Raj Kumar Gupta",
    Department: "Computer Science & Engineering",
    Specialization: "Distributed Systems, Cloud Computing, HPC",
    Office: "A-211 CSED",
    Email: "rkgupta@thapar.edu",
    link: "https://med.thapar.edu/faculty"
  },
  {
    FacultyID: 2,
    Name: "Dr. Prashant Singh Rana",
    Department: "Computer Science & Engineering",
    Specialization: "Machine Learning, Deep Learning, AI",
    Office: "B-105 CSED",
    Email: "psrana@thapar.edu",
    link: "https://med.thapar.edu/faculty"
  },
  {
    FacultyID: 3,
    Name: "Dr. S.S. Bhatia",
    Department: "School of Mathematics",
    Specialization: "Pure & Applied Mathematics, Functional Analysis",
    Office: "D-302 Mathematics Block",
    Email: "ssbhatia@thapar.edu",
    link: "https://som.thapar.edu/faculty"
  },
  {
    FacultyID: 4,
    Name: "Dr. Seema Bawa",
    Department: "Computer Science & Engineering",
    Specialization: "Software Engineering, Cloud Computing",
    Office: "A-201 CSED",
    Email: "seema@thapar.edu",
    link: "https://med.thapar.edu/faculty"
  },
  {
    FacultyID: 5,
    Name: "Dr. Maninder Singh",
    Department: "Computer Science & Engineering",
    Specialization: "Cyber Security, Network Vulnerability",
    Office: "A-205 CSED",
    Email: "msingh@thapar.edu",
    link: "https://med.thapar.edu/faculty"
  },
  {
    FacultyID: 6,
    Name: "Dr. Rajesh Kumar",
    Department: "Electrical & Instrumentation Engineering",
    Specialization: "Power Systems, Renewable Energy, Smart Grids",
    Office: "E-101 EIED",
    Email: "rkumar@thapar.edu",
    link: "https://eied.thapar.edu/faculty"
  },
  {
    FacultyID: 7,
    Name: "Dr. Inderveer Chhabra",
    Department: "Computer Science & Engineering",
    Specialization: "Natural Language Processing, IR",
    Office: "B-204 CSED",
    Email: "inderveer@thapar.edu",
    link: "https://med.thapar.edu/faculty"
  },
  {
    FacultyID: 8,
    Name: "Dr. Neeraj Kumar",
    Department: "Computer Science & Engineering",
    Specialization: "IoT, Mobile Cloud, Security",
    Office: "A-208 CSED",
    Email: "neeraj.kumar@thapar.edu",
    link: "https://med.thapar.edu/faculty"
  },
  {
    FacultyID: 9,
    Name: "Dr. Sharad Saxena",
    Department: "Computer Science & Engineering",
    Specialization: "Image Processing, Pattern Recognition",
    Office: "B-108 CSED",
    Email: "sharad.saxena@thapar.edu",
    link: "https://med.thapar.edu/faculty"
  },
  {
    FacultyID: 10,
    Name: "Dr. Anju Bala",
    Department: "Computer Science & Engineering",
    Specialization: "Cloud Computing, Big Data, Green Computing",
    Office: "B-202 CSED",
    Email: "anju.bala@thapar.edu",
    link: "https://med.thapar.edu/faculty"
  }
];

const ALL_CAFES = [
  {
    id: 1,
    name: "Pizza Nation",
    category: "Fast Food & Pizza",
    timing: "10:00 AM - 11:00 PM",
    menuImageUrl: "https://i.ibb.co/LzWrk0NY/pizza-Nation-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/JFHbQHtX/pizza-Nation-scanner.jpg"
  },
  {
    id: 2,
    name: "Dessert Club",
    category: "Ice Cream, Waffles & Shakes",
    timing: "11:00 AM - 11:30 PM",
    menuImageUrl: "https://i.ibb.co/4ZHyv39Y/dessert-Club-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/sp2kWRgN/dessert-Club-scanner.jpg"
  },
  {
    id: 3,
    name: "Chilli Chitkara",
    category: "Chinese & Asian Fast Food",
    timing: "10:30 AM - 10:30 PM",
    menuImageUrl: "https://i.ibb.co/xqPNmDy1/chilli-Chitkara-menu.jpg",
    scannerImageUrl: ""
  },
  {
    id: 4,
    name: "G-Block Canteen",
    category: "North Indian, Thali & Snacks",
    timing: "8:00 AM - 10:00 PM",
    menuImageUrl: "https://i.ibb.co/S4d8Px6b/GBlock-Canteen-menu.jpg",
    scannerImageUrl: ""
  },
  {
    id: 5,
    name: "Jaggi Samosa Shop",
    category: "Traditional Samosa & Snacks",
    timing: "9:00 AM - 9:00 PM",
    menuImageUrl: "https://i.ibb.co/tMXZhL4b/Jaggi-Samosa-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/d4D6LQC1/jaggi-Samosa-scanner.jpg"
  },
  {
    id: 6,
    name: "Jaggi Juice & Shakes",
    category: "Fresh Fruit Juices & Shakes",
    timing: "8:30 AM - 10:30 PM",
    menuImageUrl: "https://i.ibb.co/27KVvyws/jaggi-Juice-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/d0G2MQbQ/jaggi-Juice-scanner.jpg"
  },
  {
    id: 7,
    name: "Nescafe Outlet",
    category: "Hot & Cold Coffee, Maggi, Snacks",
    timing: "8:00 AM - 11:00 PM",
    menuImageUrl: "https://i.ibb.co/WNqDTVPJ/Nescafe-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/GvkkgVrQ/Nescafe-scannar.jpg"
  },
  {
    id: 8,
    name: "Campus Bite",
    category: "Burgers, Sandwiches & Rolls",
    timing: "10:00 AM - 10:00 PM",
    menuImageUrl: "https://i.ibb.co/HWWtx26/Campusbite-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/Swwh301L/Campusbite-scanner.jpg"
  },
  {
    id: 9,
    name: "Amritsari Naan & Kulcha",
    category: "Amritsari Kulche, Chole & Lassi",
    timing: "9:00 AM - 9:30 PM",
    menuImageUrl: "https://i.ibb.co/23ZLKsgv/Amritsari-kulcha-naan-Menu.jpg",
    scannerImageUrl: "https://i.ibb.co/q3KYXHP0/Amritsari-kulcha-naan-scannar.jpg"
  },
  {
    id: 10,
    name: "Jaggi Cold Coffee",
    category: "Special Cold Coffee & Ice Cream",
    timing: "10:00 AM - 11:00 PM",
    menuImageUrl: "https://i.ibb.co/mrLnpShQ/Jaggi-cold-coffee-menu.jpg",
    scannerImageUrl: "https://i.ibb.co/wFsdcDGG/Jaggi-cold-coffee-scanner.jpg"
  }
];

const ALL_DOAA_PROCEDURES = [
  {
    id: 1,
    task: "Group / Sub-group Change",
    summary: "Switch assigned class group or tutorial/practical sub-group.",
    steps: "1. Write a formal application stating reason.\n2. Mention current group and requested target group.\n3. Obtain approval from DoAA Office.\n4. Submit approved form to WebKiosk/SSSP Admin (Dr. SK Guleria / Mr. Vinod Kumar - 1st Floor, Near Registrar Office)."
  },
  {
    id: 2,
    task: "Add Additional Subject / Backlog Registration",
    summary: "Register for an extra course or clear a previous backlog.",
    steps: "1. Fill the Add/Backlog form floated before semester start.\n2. Draft your current weekly schedule ensuring no slot clashes.\n3. Get verification from Departmental Timetable Coordinator ('No Clashes').\n4. Pay applicable fee and submit approved form to Academic Section."
  },
  {
    id: 3,
    task: "Drop Subject",
    summary: "Withdraw or drop an registered course within the allowed add/drop window.",
    steps: "1. Use official Add/Drop form during open window.\n2. State course details and obtain DoAA approval.\n3. Submit to Academic Section for portal update."
  },
  {
    id: 4,
    task: "Free / Generic / Professional Elective Change",
    summary: "Modify elective choice or rectify missed choice filling.",
    steps: "1. Check available elective vacancies on WebKiosk.\n2. For changes: Write application to HoD/DoAA.\n3. Submit signed approval to WebKiosk Admin (Mr. Rupinder Singh)."
  },
  {
    id: 5,
    task: "Fee Related Concerns & Delayed Payment",
    summary: "Apply for fee payment extension due to education loan or genuine difficulty.",
    steps: "1. Draft application with supporting proofs (loan letter, medical cert).\n2. Obtain approval from DoAA Office for extension.\n3. Submit approved form to Finance Section (Mr. Pankaj Sinha)."
  },
  {
    id: 6,
    task: "Make-up Test for Missed MST",
    summary: "Apply for compensatory mid-semester test on medical or genuine grounds.",
    steps: "1. Obtain Medical/Genuine Reason Certificate within 3 days of missed test.\n2. Submit formal application to DoAA with hospital/Dispensary slip.\n3. Coordinate with respective Course Coordinator once approved."
  }
];

const QUICK_ACTIONS = [
  { label: "2C24 Schedule", query: "what is the timetable for 2C24?" },
  { label: "1A11 Timetable", query: "1A11 timetable for Tuesday" },
  { label: "Pizza Nation Menu", query: "pizza nation menu" },
  { label: "UCS312 DBMS", query: "tell me about UCS312" },
  { label: "Change Group", query: "how to change group" },
  { label: "Drop Subject", query: "how to drop subject" },
  { label: "Missed MST Makeup", query: "makeup test for missed mst" },
  { label: "Dr. Raj Kumar Gupta", query: "Dr. Raj Kumar Gupta" },
  { label: "Dispensary Timings", query: "dispensary timing" }
];

function App() {
  const [activeTab, setActiveTab] = useState("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      type: "simple_message",
      text: "👋 **Welcome to UniVerse Campus Assistant!**\n\nI can assist you with:\n• 📅 **Timetables & Class Schedules** (e.g. *'2C24 schedule'*)\n• 🍔 **Cafeteria Menus & QR Codes** (e.g. *'Pizza Nation menu'*)\n• 📚 **Course Syllabi & Credits** (e.g. *'UCS312'*)\n• 🏛️ **DoAA Academic Procedures & Forms**\n• 👨‍🏫 **Faculty Directory & Contacts**\n• 🏥 **Dispensary & Campus Navigation**\n\nClick any quick suggestion below or ask me anything!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  // Tab State
  const [facultySearch, setFacultySearch] = useState("");
  const [cafeSearch, setCafeSearch] = useState("");
  const [doaaSearch, setDoaaSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("2C24");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [batchSchedule, setBatchSchedule] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const mapCompRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const isLocalDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const API_URL = isLocalDev ? (process.env.REACT_APP_API_URL || "http://localhost:5001") : "";

  const fetchTimetableTab = useCallback(async (batch, day) => {
    setBatchLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `${batch} timetable ${day}` }),
      });
      const data = await res.json();
      if (data.type === "timetable_display" && data.data) {
        setBatchSchedule(data.data);
      } else {
        setBatchSchedule({ title: `Schedule for ${batch}`, schedule: [] });
      }
    } catch (e) {
      setBatchSchedule(null);
    } finally {
      setBatchLoading(false);
    }
  }, [API_URL]);

  // Fetch batch timetable when batch or day changes in Timetable tab
  useEffect(() => {
    if (activeTab === "timetable") {
      fetchTimetableTab(selectedBatch, selectedDay);
    }
  }, [selectedBatch, selectedDay, activeTab, fetchTimetableTab]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMessage = { from: "user", text: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", rawData: data }]);
    } catch (err) {
      console.error("Backend request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          type: "simple_message",
          text: "⚠️ **Connection Error:** Could not connect to the campus server. Please ensure backend is running at `" + API_URL + "`.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(typeof text === "string" ? text : JSON.stringify(text, null, 2));
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        from: "bot",
        type: "simple_message",
        text: "🧹 Conversation cleared. How can I help you today?",
      },
    ]);
  };

  // Filtered Lists for Dedicated Tabs
  const filteredFaculty = useMemo(() => {
    if (!facultySearch.trim()) return ALL_FACULTY;
    const q = facultySearch.toLowerCase();
    return ALL_FACULTY.filter(
      (f) =>
        f.Name.toLowerCase().includes(q) ||
        f.Department.toLowerCase().includes(q) ||
        f.Specialization.toLowerCase().includes(q) ||
        f.Office.toLowerCase().includes(q)
    );
  }, [facultySearch]);

  const filteredCafes = useMemo(() => {
    if (!cafeSearch.trim()) return ALL_CAFES;
    const q = cafeSearch.toLowerCase();
    return ALL_CAFES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [cafeSearch]);

  const filteredDoaa = useMemo(() => {
    if (!doaaSearch.trim()) return ALL_DOAA_PROCEDURES;
    const q = doaaSearch.toLowerCase();
    return ALL_DOAA_PROCEDURES.filter(
      (p) => p.task.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)
    );
  }, [doaaSearch]);

  // Card Renderers for Chat Message
  const renderBotContent = (msg, index) => {
    if (msg.type === "simple_message" || msg.text) {
      return (
        <div className="markdown-content">
          <ReactMarkdown>{msg.text || msg.response}</ReactMarkdown>
        </div>
      );
    }

    const data = msg.rawData;
    if (!data) return "Empty response.";

    if (data.type === "simple_message") {
      return (
        <div className="markdown-content">
          <ReactMarkdown>{data.response}</ReactMarkdown>
        </div>
      );
    }

    if (data.type === "timetable_display" && data.data) {
      const { title, schedule } = data.data;
      return (
        <div className="rich-timetable-card">
          <div className="card-header-badge">
            <FaCalendarAlt /> <ReactMarkdown>{title}</ReactMarkdown>
          </div>
          {schedule.length === 0 || schedule[0].type === "Free" ? (
            <div className="empty-schedule-alert">
              🎉 <strong>No classes scheduled!</strong> Enjoy your free day.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="modern-timetable-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Course / Subject</th>
                    <th>Type</th>
                    <th>Venue</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((slot, i) => (
                    <tr key={i}>
                      <td className="time-cell">{slot.time}</td>
                      <td className="subject-cell">{slot.subject}</td>
                      <td>
                        <span className={`badge-type ${slot.type === 'L' ? 'lecture' : slot.type === 'P' ? 'practical' : 'tutorial'}`}>
                          {slot.type === 'L' ? 'Lecture' : slot.type === 'P' ? 'Practical' : slot.type === 'T' ? 'Tutorial' : slot.type}
                        </span>
                      </td>
                      <td className="room-cell">📍 {slot.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    if (data.type === "faculty_info" && Array.isArray(data.data)) {
      return (
        <div className="rich-faculty-container">
          <div className="faculty-grid">
            {data.data.map((f, i) => (
              <div key={i} className="modern-faculty-card">
                <div className="faculty-card-top">
                  <div className="faculty-avatar-circle">
                    {f.Name.replace(/Dr\.|Prof\./gi, "").trim().charAt(0)}
                  </div>
                  <div>
                    <h4 className="faculty-name">{f.Name}</h4>
                    <span className="faculty-dept-badge">{f.Department}</span>
                  </div>
                </div>
                {f.Specialization && (
                  <p className="faculty-specialization">
                    <strong>Focus:</strong> {f.Specialization}
                  </p>
                )}
                <div className="faculty-details-row">
                  {f.Office && (
                    <div className="detail-chip">
                      <FaMapMarkerAlt /> {f.Office}
                    </div>
                  )}
                  {f.Email && (
                    <a href={`mailto:${f.Email}`} className="detail-chip link-chip">
                      <FaEnvelope /> {f.Email}
                    </a>
                  )}
                </div>
                {f.link && (
                  <a href={f.link} target="_blank" rel="noreferrer" className="profile-btn">
                    View Academic Profile <FaExternalLinkAlt size={11} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.type === "subject_info" && data.data) {
      const s = data.data;
      return (
        <div className="rich-subject-card">
          <div className="subject-card-header">
            <div>
              <span className="subject-code-tag">{s.code || s.subjectCode}</span>
              <h3 className="subject-title">{s.name}</h3>
            </div>
            <div className="subject-credits-pill">
              <span className="credits-number">{s.credit}</span>
              <span className="credits-label">Credits</span>
            </div>
          </div>
          <div className="subject-meta-grid">
            <div className="meta-box">
              <span className="meta-label">Structure (L-T-P)</span>
              <span className="meta-val">{s.ltp || "3-0-2"}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Course Type</span>
              <span className="meta-val">{s.isCore === "Yes" ? "Core Mandatory" : "Elective"}</span>
            </div>
          </div>
          {s.description && (
            <div className="subject-desc-box">
              <p>{s.description}</p>
            </div>
          )}
        </div>
      );
    }

    if (data.type === "cafeteria_info" && data.data) {
      const c = data.data;
      return (
        <div className="rich-cafe-card">
          <div className="cafe-header-strip">
            <FaUtensils /> <h4>{c.name}</h4>
          </div>
          <div className="cafe-actions-grid">
            {c.menuImageUrl && (
              <button
                className="cafe-btn menu-btn"
                onClick={() => setFullScreenImage(c.menuImageUrl)}
              >
                📜 View Full Menu Card
              </button>
            )}
            {c.scannerImageUrl && (
              <button
                className="cafe-btn qr-btn"
                onClick={() => setFullScreenImage(c.scannerImageUrl)}
              >
                <FaQrcode /> Scan & Pay (UPI)
              </button>
            )}
          </div>
        </div>
      );
    }

    if (data.type === "dispensary_info" && data.data) {
      const d = data.data;
      return (
        <div className="rich-dispensary-card">
          <div className="dispensary-top">
            <FaHospitalAlt size={24} className="dispensary-icon" />
            <div>
              <h3>{d.name || "University Health & Medical Center"}</h3>
              <p><FaMapMarkerAlt /> {d.location || "Near Sports Complex, Central Campus"}</p>
            </div>
          </div>
          <div className="dispensary-body">
            <div className="dispensary-hours">
              <h4><FaClock /> Operating Hours</h4>
              <ul>
                {d.hours && Array.isArray(d.hours) ? (
                  d.hours.map((h, i) => <li key={i}>{h}</li>)
                ) : (
                  <li>24x7 Emergency Services Available</li>
                )}
              </ul>
            </div>
            <div className="dispensary-contact">
              <h4><FaPhoneAlt /> Emergency Hotline</h4>
              <p className="phone-highlight">{d.phone || "+91-175-2393100"}</p>
            </div>
          </div>
        </div>
      );
    }

    return <pre className="json-raw">{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <div className="app-layout">
      {/* 1. SIDEBAR */}
      <Sidebar activeTab={activeTab} onTabClick={setActiveTab} />

      {/* 2. MAIN WORKSPACE */}
      <main className="main-viewport">
        {/* ==============================================
            TAB 1: AI CHAT ASSISTANT
            ============================================== */}
        {activeTab === "chat" && (
          <div className="chat-interface">
            <header className="workspace-header">
              <div className="header-info">
                <div className="header-badge">AI Assistant</div>
                <h1>CampusGPT</h1>
                <p>Real-time university timetable, faculty directory, cafeterias & DOAA guidance</p>
              </div>
              <div className="header-actions">
                <button
                  className="glass-btn"
                  onClick={clearChat}
                  title="Clear Chat History"
                >
                  <FaTrashAlt /> Clear
                </button>
                <button
                  className="glass-btn"
                  onClick={() => setIsModalOpen(true)}
                  title="Prompt Guide"
                >
                  <FaInfoCircle /> Guide
                </button>
                <button
                  className="glass-btn primary"
                  onClick={() => setActiveTab("navigation")}
                  title="Campus Map"
                >
                  <FaMapMarkedAlt /> Map
                </button>
              </div>
            </header>

            {/* Quick Action Suggestion Chips */}
            <div className="quick-chips-bar">
              <span className="chips-title">Suggested:</span>
              <div className="chips-scroller">
                {QUICK_ACTIONS.map((chip, idx) => (
                  <button
                    key={idx}
                    className="chip-btn"
                    onClick={() => handleSendMessage(chip.query)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Thread */}
            <div className="messages-thread">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-row ${msg.from === "user" ? "user-row" : "bot-row"}`}
                >
                  {msg.from === "bot" && (
                    <div className="bot-avatar">
                      <FaRobot />
                    </div>
                  )}
                  <div className={`message-bubble ${msg.from === "user" ? "user-bubble" : "bot-bubble"}`}>
                    {renderBotContent(msg, index)}
                    {msg.from === "bot" && (
                      <div className="bubble-actions">
                        <button
                          className="action-icon-btn"
                          onClick={() => copyToClipboard(msg.text || msg.rawData?.response || msg.rawData, index)}
                          title="Copy text"
                        >
                          {copiedIndex === index ? <FaCheck color="#10B981" /> : <FaRegCopy />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="message-row bot-row">
                  <div className="bot-avatar">
                    <FaRobot />
                  </div>
                  <div className="message-bubble bot-bubble typing-bubble">
                    <div className="pulse-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="typing-label">CampusGPT is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              className="chat-input-bar"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about batch timetables, professors, cafe menus, or DOAA procedures..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="send-btn"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        )}

        {/* ==============================================
            TAB 2: INTERACTIVE FACULTY DIRECTORY
            ============================================== */}
        {activeTab === "faculty" && (
          <div className="tab-pane-container">
            <header className="pane-header">
              <div>
                <h2>Faculty Directory</h2>
                <p>Browse contact details, office locations, and specializations of institute professors.</p>
              </div>
              <div className="search-box-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search faculty by name, department, or research area..."
                  value={facultySearch}
                  onChange={(e) => setFacultySearch(e.target.value)}
                />
              </div>
            </header>

            <div className="faculty-grid">
              {filteredFaculty.map((f) => (
                <div key={f.FacultyID} className="modern-faculty-card">
                  <div className="faculty-card-top">
                    <div className="faculty-avatar-circle">
                      {f.Name.replace(/Dr\.|Prof\./gi, "").trim().charAt(0)}
                    </div>
                    <div>
                      <h4 className="faculty-name">{f.Name}</h4>
                      <span className="faculty-dept-badge">{f.Department}</span>
                    </div>
                  </div>
                  <p className="faculty-specialization">
                    <strong>Research:</strong> {f.Specialization}
                  </p>
                  <div className="faculty-details-row">
                    <div className="detail-chip">
                      <FaMapMarkerAlt /> {f.Office}
                    </div>
                    <a href={`mailto:${f.Email}`} className="detail-chip link-chip">
                      <FaEnvelope /> {f.Email}
                    </a>
                  </div>
                  <div className="card-footer-actions">
                    <a href={f.link} target="_blank" rel="noreferrer" className="profile-btn">
                      Profile <FaExternalLinkAlt size={11} />
                    </a>
                    <button
                      className="ask-chat-btn"
                      onClick={() => {
                        setActiveTab("chat");
                        handleSendMessage(`tell me about ${f.Name}`);
                      }}
                    >
                      Ask in Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==============================================
            TAB 3: INTERACTIVE TIMETABLE EXPLORER
            ============================================== */}
        {activeTab === "timetable" && (
          <div className="tab-pane-container">
            <header className="pane-header">
              <div>
                <h2>Batch Timetable Explorer</h2>
                <p>Select your batch code and weekday to view scheduled lectures, labs, and venues.</p>
              </div>
              <div className="timetable-filters">
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="batch-select"
                >
                  <option value="2C24">Batch 2C24 (2nd Year)</option>
                  <option value="1A11">Batch 1A11 (1st Year)</option>
                  <option value="1A12">Batch 1A12 (1st Year)</option>
                  <option value="3C24">Batch 3C24 (3rd Year)</option>
                  <option value="COE1">Batch COE1</option>
                  <option value="COE21">Batch COE21</option>
                </select>
              </div>
            </header>

            {/* Day Selector Tabs */}
            <div className="day-pills-bar">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <button
                  key={day}
                  className={`day-pill ${selectedDay === day ? "active" : ""}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>

            {batchLoading ? (
              <div className="loading-state">
                <div className="pulse-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>Loading schedule for {selectedBatch}...</p>
              </div>
            ) : batchSchedule && batchSchedule.schedule && batchSchedule.schedule.length > 0 ? (
              <div className="timetable-sheet-card">
                <div className="sheet-header">
                  <h3>{selectedBatch} — {selectedDay} Schedule</h3>
                  <span className="total-slots-badge">{batchSchedule.schedule.length} Slots</span>
                </div>
                <div className="table-responsive">
                  <table className="modern-timetable-table">
                    <thead>
                      <tr>
                        <th>Time Slot</th>
                        <th>Subject / Course</th>
                        <th>Component</th>
                        <th>Classroom / Lab</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchSchedule.schedule.map((slot, i) => (
                        <tr key={i}>
                          <td className="time-cell">{slot.time}</td>
                          <td className="subject-cell">{slot.subject}</td>
                          <td>
                            <span className={`badge-type ${slot.type === 'L' ? 'lecture' : slot.type === 'P' ? 'practical' : 'tutorial'}`}>
                              {slot.type === 'L' ? 'Lecture' : slot.type === 'P' ? 'Practical' : slot.type === 'T' ? 'Tutorial' : slot.type}
                            </span>
                          </td>
                          <td className="room-cell">📍 {slot.room}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="empty-schedule-card">
                <p>🎉 No classes scheduled for {selectedBatch} on {selectedDay}.</p>
              </div>
            )}
          </div>
        )}

        {/* ==============================================
            TAB 4: CAMPUS CAFETERIA & DINING
            ============================================== */}
        {activeTab === "cafeteria" && (
          <div className="tab-pane-container">
            <header className="pane-header">
              <div>
                <h2>Campus Cafeteria & Menus</h2>
                <p>Explore food outlets across campus, view real-time menu cards and UPI payment QR codes.</p>
              </div>
              <div className="search-box-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search cafe or cuisine..."
                  value={cafeSearch}
                  onChange={(e) => setCafeSearch(e.target.value)}
                />
              </div>
            </header>

            <div className="cafe-grid">
              {filteredCafes.map((cafe) => (
                <div key={cafe.id} className="modern-cafe-card">
                  <div className="cafe-card-top">
                    <div className="cafe-icon-badge">
                      <FaUtensils />
                    </div>
                    <div>
                      <h3>{cafe.name}</h3>
                      <span className="cafe-category">{cafe.category}</span>
                    </div>
                  </div>
                  <div className="cafe-time-row">
                    <FaClock /> <span>{cafe.timing}</span>
                  </div>
                  <div className="cafe-actions-row">
                    {cafe.menuImageUrl && (
                      <button
                        className="cafe-btn menu-btn"
                        onClick={() => setFullScreenImage(cafe.menuImageUrl)}
                      >
                        📜 Menu
                      </button>
                    )}
                    {cafe.scannerImageUrl && (
                      <button
                        className="cafe-btn qr-btn"
                        onClick={() => setFullScreenImage(cafe.scannerImageUrl)}
                      >
                        <FaQrcode /> Scan QR
                      </button>
                    )}
                    <button
                      className="cafe-btn ask-btn"
                      onClick={() => {
                        setActiveTab("chat");
                        handleSendMessage(`${cafe.name} menu`);
                      }}
                    >
                      Chat Info
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==============================================
            TAB 5: DOAA ACADEMIC PROCEDURES
            ============================================== */}
        {activeTab === "doaa" && (
          <div className="tab-pane-container">
            <header className="pane-header">
              <div>
                <h2>DOAA Academic Procedures & Certificates</h2>
                <p>Standard guidelines for group changes, subject add/drop, fee extensions, makeups, and official certificates.</p>
              </div>
              <div className="search-box-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search academic procedure or policy..."
                  value={doaaSearch}
                  onChange={(e) => setDoaaSearch(e.target.value)}
                />
              </div>
            </header>

            <div className="doaa-accordion-list">
              {filteredDoaa.map((item) => (
                <div key={item.id} className="doaa-procedure-card">
                  <div className="procedure-head">
                    <div className="procedure-number-badge">{item.id}</div>
                    <div>
                      <h3>{item.task}</h3>
                      <p className="procedure-summary">{item.summary}</p>
                    </div>
                  </div>
                  <div className="procedure-steps-box">
                    <h4>Procedure Steps:</h4>
                    <pre className="steps-text">{item.steps}</pre>
                  </div>
                  <div className="procedure-footer">
                    <button
                      className="ask-chat-btn"
                      onClick={() => {
                        setActiveTab("chat");
                        handleSendMessage(`how to ${item.task}`);
                      }}
                    >
                      Ask in Chat <FaChevronRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==============================================
            TAB 6: CAMPUS MAP & NAVIGATION
            ============================================== */}
        {activeTab === "navigation" && (
          <div className="map-view-fullscreen">
            <header className="pane-header map-header">
              <div>
                <h2>Campus Map & Navigation</h2>
                <p>Explore buildings, academic blocks, hostels, and sports facilities.</p>
              </div>
            </header>
            <div className="map-wrapper-fullscreen">
              <MapComponent isVisible={true} ref={mapCompRef} />
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {isModalOpen && <UserManualModal onClose={() => setIsModalOpen(false)} />}

      {fullScreenImage && (
        <div
          className="fullscreen-image-overlay"
          onClick={() => setFullScreenImage(null)}
        >
          <div className="image-lightbox-wrapper" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close-btn"
              onClick={() => setFullScreenImage(null)}
            >
              <FaTimes />
            </button>
            <img
              src={fullScreenImage}
              alt="Preview"
              className="fullscreen-image-content"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
