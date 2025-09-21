import React from "react";

const Timer = ({ timeRemaining, totalTime, showProgress = true }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    if (!totalTime) return 0;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 10) return "#EF4444"; // Red
    if (timeRemaining <= 30) return "#F59E0B"; // Orange
    return "#4F0DCE"; // Purple
  };

  return (
    <div className="timer-container">
      <div className="timer-display" style={{ color: getTimeColor() }}>
        <span className="timer-icon">⏱</span>
        <span className="timer-text">{formatTime(timeRemaining)}</span>
      </div>

      {showProgress && totalTime && (
        <div className="timer-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${getProgressPercentage()}%`,
                backgroundColor: getTimeColor(),
              }}
            />
          </div>
          <div className="progress-text">
            Question {Math.floor(getProgressPercentage())}% complete
          </div>
        </div>
      )}

      {timeRemaining <= 10 && (
        <div className="timer-warning">Time running out!</div>
      )}
    </div>
  );
};

export default Timer;
