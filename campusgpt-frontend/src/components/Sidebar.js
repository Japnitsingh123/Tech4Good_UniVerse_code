// src/components/Sidebar.js
import React from "react";
import "./Sidebar.css"; // We will create this next
import {
  FaRobot,
  FaMapMarkedAlt,
  FaUniversity,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaUtensils,
} from "react-icons/fa";

// This component receives the 'activeTab' and a function to change it
const Sidebar = ({ activeTab, onTabClick }) => {
  // A list of all your app's features
  const menuItems = [
    { id: "chat", label: "AI Assistant", icon: <FaRobot /> },
    { id: "navigation", label: "Campus Map", icon: <FaMapMarkedAlt /> },
    { id: "faculty", label: "Faculty Search", icon: <FaChalkboardTeacher /> },
    { id: "doaa", label: "Document Info", icon: <FaUniversity /> },
    { id: "timetable", label: "Timetables", icon: <FaCalendarAlt /> },
    { id: "cafeteria", label: "Cafeteria", icon: <FaUtensils /> },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>UniVerse</h2>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.id} className="menu-item-container">
            <button
              // Set 'active' class if this item's ID matches the activeTab state
              className={`menu-item ${activeTab === item.id ? "active" : ""}`}
              // When clicked, tell App.js to change the state to this item's ID
              onClick={() => onTabClick(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <p>Public Campus Tool</p>
      </div>
    </nav>
  );
};

export default Sidebar;
