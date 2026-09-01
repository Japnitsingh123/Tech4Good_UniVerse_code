// campusgpt-frontend/src/components/Sidebar.js
import React from "react";
import "./Sidebar.css";
import {
  FaRobot,
  FaMapMarkedAlt,
  FaUniversity,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaUtensils,
  FaGraduationCap
} from "react-icons/fa";

const Sidebar = ({ activeTab, onTabClick }) => {
  const menuItems = [
    { id: "chat", label: "AI Assistant", icon: <FaRobot />, badge: "AI" },
    { id: "timetable", label: "Timetables", icon: <FaCalendarAlt /> },
    { id: "faculty", label: "Faculty Directory", icon: <FaChalkboardTeacher /> },
    { id: "cafeteria", label: "Cafeterias", icon: <FaUtensils /> },
    { id: "doaa", label: "DOAA Procedures", icon: <FaUniversity /> },
    { id: "navigation", label: "Campus Map", icon: <FaMapMarkedAlt /> },
  ];

  return (
    <aside className="sidebar-container">
      <div className="sidebar-brand">
        <div className="brand-logo-icon">
          <FaGraduationCap />
        </div>
        <div>
          <h2>UniVerse</h2>
          <span className="brand-tagline">Campus Assistant</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        <ul className="sidebar-menu-list">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`menu-pill-btn ${activeTab === item.id ? "active" : ""}`}
                onClick={() => onTabClick(item.id)}
              >
                <span className="menu-icon-wrapper">{item.icon}</span>
                <span className="menu-item-text">{item.label}</span>
                {item.badge && <span className="menu-ai-badge">{item.badge}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer-card">
        <div className="footer-status-indicator">
          <span className="status-dot"></span>
          <span>System Online</span>
        </div>
        <p className="footer-copyright">Thapar University</p>
      </div>
    </aside>
  );
};

export default Sidebar;
