import React, { useState } from "react";
import Button from "../common/Button";

const ParticipantsList = ({
  students = [],
  onRemoveStudent,
  showChat = true,
  activePoll = null,
}) => {
  const [activeTab, setActiveTab] = useState("participants");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: "User 1",
      message: "Hey there, how can I help?",
      timestamp: new Date(),
    },
    {
      id: 2,
      user: "User 2",
      message: "Nothing bro, just chili!",
      timestamp: new Date(),
    },
  ]);

  const handleRemoveStudent = (student) => {
    if (window.confirm(`Are you sure you want to remove ${student.name}?`)) {
      onRemoveStudent(student.socketId);
    }
  };

  const getStudentStatus = (student) => {
    if (!activePoll) return "Ready";
    return student.hasAnswered ? "Answered" : "Answering...";
  };

  const getStatusColor = (student) => {
    if (!activePoll) return "#10B981"; // Green for ready
    return student.hasAnswered ? "#10B981" : "#F59E0B"; // Green for answered, orange for answering
  };

  return (
    <div className="participants-panel">
      {/* Tab Headers */}
      {showChat && (
        <div className="tab-headers">
          <button
            className={`tab-header ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>
          <button
            className={`tab-header ${
              activeTab === "participants" ? "active" : ""
            }`}
            onClick={() => setActiveTab("participants")}
          >
            Participants
          </button>
        </div>
      )}

      {/* Chat Tab */}
      {showChat && activeTab === "chat" && (
        <div className="chat-panel">
          <div className="chat-messages">
            {chatMessages.map((message) => (
              <div key={message.id} className="chat-message">
                <div className="message-user">{message.user}</div>
                <div>{message.message}</div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              className="input"
            />
            <Button size="small">Send</Button>
          </div>
        </div>
      )}

      {/* Participants Tab */}
      {(!showChat || activeTab === "participants") && (
        <div>
          <div className="panel-header">
            <span>Participants ({students.length})</span>
          </div>

          <div className="participants-list">
            {students.length === 0 ? (
              <div className="empty-state">
                <p className="text-gray-500 text-center py-20">
                  No students connected yet
                </p>
              </div>
            ) : (
              students.map((student) => (
                <div key={student.id} className="participant-item">
                  <div className="participant-info">
                    <div className="participant-name">{student.name}</div>
                    <div
                      className="participant-status"
                      style={{ color: getStatusColor(student) }}
                    >
                      {getStudentStatus(student)}
                    </div>
                  </div>

                  <div className="participant-actions">
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleRemoveStudent(student)}
                      className="kick-btn"
                      title={`Remove ${student.name}`}
                    >
                      Kick out
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {students.length > 0 && activePoll && (
            <div className="participants-summary">
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Total</span>
                  <span className="stat-value">{students.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Answered</span>
                  <span className="stat-value">
                    {students.filter((s) => s.hasAnswered).length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Pending</span>
                  <span className="stat-value">
                    {students.filter((s) => !s.hasAnswered).length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;
