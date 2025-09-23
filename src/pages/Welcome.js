import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components.css";

const Welcome = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/${selectedRole}`);
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="badge badge-purple mb-20">Interactive Poll</div>

        <h1>Welcome to the Live Polling System</h1>
        <p>
          Please select the role that best describes you to begin using the live
          polling system
        </p>

        <div className="role-selection">
          <div
            className={`role-card ${
              selectedRole === "student" ? "selected" : ""
            }`}
            onClick={() => handleRoleSelect("student")}
          >
            <h3>I'm a Student</h3>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </p>
          </div>

          <div
            className={`role-card ${
              selectedRole === "teacher" ? "selected" : ""
            }`}
            onClick={() => handleRoleSelect("teacher")}
          >
            <h3>I'm a Teacher</h3>
            <p>Submit answers and view live poll results in real-time.</p>
          </div>
        </div>

        <button
          className={`btn btn-lg ${
            selectedRole ? "btn-primary" : "btn-secondary"
          }`}
          onClick={handleContinue}
          disabled={!selectedRole}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Welcome;
