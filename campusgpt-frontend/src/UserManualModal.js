import React from "react"; // This is the correct JavaScript way to import React

// This is the component for the pop-up window
const UserManualModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times; {/* This is a "X" icon */}
        </button>

        <h2>UniVerse Prompt Guide</h2>
        <p>To get the best results, try framing your prompts like this:</p>

        <h3>Finding Faculuty</h3>
        <ul>
          <li>"dr. or dr is required to get the faculty information"</li>
          <li>"Test case : Dr. Rana"</li>
        </ul>

        <h3>Timetables</h3>
        <ul>
          <li>"User need to give subgroup code "</li>
          <li>
            "if prompt has day then it will show timetable for that day else it
            will by default get the current day"
          </li>
          <li>"Test case : 1A21"</li>
          <li>"Test case : 3c24 tuesday"</li>
        </ul>

        <h3>Course information</h3>
        <ul>
          <li>
            "User need to write the name of the course with keyword info or
            credit"
          </li>
          <li>"Test case : data structure info"</li>
        </ul>
        <h3>dispensary</h3>
        <ul>
          <li>"User need to write the keyword dispensary"</li>
          <li>"Test case : dispensary hours"</li>
        </ul>
        <h3>Navigation</h3>
        <ul>
          <li>
            "User need to click the button before the send button and give
            required places"
          </li>
        </ul>
        <h3>Cafeteria Menu</h3>
        <ul>
          <li>"User need to type the name of the cafeteria"</li>
          <li>Pizza Nation</li>
          <li>Dessert Club Menu</li>
          <li>Chilli Chitkara</li>
          <li>G-Block</li>
          <li>Jaggi Samosa Shop</li>
          <li>Jaggi Juice Shop</li>
          <li>Sips and bite</li>
          <li>Cos All Shops</li>
          <li>TSLAS Back Canteen</li>
        </ul>
      </div>
    </div>
  );
};

export default UserManualModal;
