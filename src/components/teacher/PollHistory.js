import React from "react";

const PollHistory = ({ history = [] }) => {
  const getResultIcon = (index) => {
    const letters = ["A", "B", "C", "D", "E", "F"];
    return letters[index] || index + 1;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (history.length === 0) {
    return (
      <div className="history-container">
        <h2>View Poll History</h2>
        <div className="empty-state">
          <p className="text-gray-500 text-center py-40">
            No poll history available yet. Create your first poll to see results
            here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>View Poll History</h2>

      <div className="history-list">
        {history.map((poll, pollIndex) => (
          <div key={poll.id || pollIndex} className="history-item">
            <div className="history-header">
              <div className="history-question">Question {pollIndex + 1}</div>
              <div className="question-text">{poll.question}</div>
              <div className="history-meta">
                <span>📊 {poll.totalVotes} votes</span>
                <span>👥 {poll.totalParticipants} participants</span>
                <span>⏱ {formatDuration(poll.duration || 60)}</span>
                <span>📅 {formatDate(poll.createdAt || new Date())}</span>
              </div>
            </div>

            <div className="history-results">
              {poll.options?.map((option, index) => (
                <div key={index} className="result-item">
                  <div className="result-header">
                    <div className="result-icon">{getResultIcon(index)}</div>
                    <span className="result-text">{option.text}</span>
                    <span className="result-percentage">
                      {option.percentage || 0}%
                    </span>
                  </div>
                  <div className="result-bar">
                    <div
                      className="result-fill"
                      style={{ width: `${option.percentage || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollHistory;
