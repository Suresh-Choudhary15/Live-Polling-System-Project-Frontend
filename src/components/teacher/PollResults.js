import React from "react";
import Button from "../common/Button";

const PollResults = ({
  poll,
  results,
  totalStudents,
  answeredStudents,
  onAskNewQuestion,
  canAskNew = false,
}) => {
  const getResultIcon = (index) => {
    const letters = ["A", "B", "C", "D", "E", "F"];
    return letters[index] || index + 1;
  };

  const getCompletionPercentage = () => {
    if (totalStudents === 0) return 0;
    return Math.round((answeredStudents / totalStudents) * 100);
  };

  const isCompleted = answeredStudents >= totalStudents && totalStudents > 0;

  return (
    <div className="results-container">
      {/* Header */}
      <div className="flex-between mb-20">
        <h2>Question</h2>
        <Button
          variant="secondary"
          size="small"
          onClick={() => window.open("/poll-history", "_blank")}
        >
          📊 View Poll history
        </Button>
      </div>

      {/* Question */}
      <div className="question-header mb-20">
        {poll?.question || "Poll Results"}
      </div>

      {/* Results */}
      <div className="results-list mb-30">
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

      {/* Progress Info */}
      <div className="progress-info mb-20">
        <div className="flex-between">
          <span>Response Progress</span>
          <span>
            {answeredStudents}/{totalStudents} ({getCompletionPercentage()}%)
          </span>
        </div>
        <div className="progress-bar mt-5">
          <div
            className="progress-fill"
            style={{
              width: `${getCompletionPercentage()}%`,
              backgroundColor: isCompleted ? "#10B981" : "#4F0DCE",
            }}
          />
        </div>
      </div>

      {/* Status Message */}
      <div className="status-message mb-20">
        {isCompleted ? (
          <div className="alert alert-success">
            ✅ All students have responded! You can now ask a new question.
          </div>
        ) : (
          <div className="alert alert-info">
            ⏳ Waiting for {totalStudents - answeredStudents} more student(s) to
            respond...
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="text-center">
        <Button
          onClick={onAskNewQuestion}
          disabled={!canAskNew && !isCompleted}
          size="large"
          className="w-full"
        >
          + Ask a new question
        </Button>

        {!canAskNew && !isCompleted && (
          <p className="text-sm text-gray-500 mt-10">
            Wait for all students to answer before asking a new question
          </p>
        )}
      </div>
    </div>
  );
};

export default PollResults;
