import React from "react";

const ResultsView = ({ results, questionText, isWaitingForNext = false }) => {
  const totalVotes =
    results?.reduce((sum, option) => sum + (option.votes || 0), 0) || 0;

  const getResultIcon = (index) => {
    const letters = ["A", "B", "C", "D", "E", "F"];
    return letters[index] || index + 1;
  };

  return (
    <div className="results-container">
      <div className="question-timer mb-20">
        <span>Question 1</span>
        <span className="timer" style={{ color: "#4F0DCE" }}>
          00:15
        </span>
      </div>

      {questionText && (
        <div className="question-header mb-20">{questionText}</div>
      )}

      <div className="results-list">
        {results?.map((option, index) => (
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

      <div className="mt-20 text-center">
        {totalVotes > 0 && (
          <p className="text-gray-500">Total responses: {totalVotes}</p>
        )}

        {isWaitingForNext ? (
          <div className="mt-20">
            <p className="text-gray-600">
              Wait for the teacher to ask a new question..
            </p>
          </div>
        ) : (
          <div className="mt-20">
            <div className="loading">
              <div className="spinner"></div>
            </div>
            <p className="text-gray-500">
              Waiting for all students to answer...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsView;
