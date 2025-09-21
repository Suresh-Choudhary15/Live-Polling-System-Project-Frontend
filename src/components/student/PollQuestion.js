import React, { useState } from "react";
import Button from "../common/Button";
import Timer from "../common/Timer";

const PollQuestion = ({
  poll,
  timeRemaining,
  onSubmitAnswer,
  disabled = false,
  loading = false,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (optionIndex) => {
    if (disabled || timeRemaining <= 0) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption !== null && !disabled && timeRemaining > 0) {
      onSubmitAnswer(poll.id, selectedOption);
    }
  };

  const isTimeUp = timeRemaining <= 0;
  const canSubmit = selectedOption !== null && !disabled && !isTimeUp;

  return (
    <div className="poll-question-container">
      <div className="question-timer mb-20">
        <span>Question 1</span>
        <Timer
          timeRemaining={timeRemaining}
          totalTime={poll.timeLimit}
          showProgress={false}
        />
      </div>

      <div className="question-header">{poll.question}</div>

      <div className="options-list">
        {poll.options.map((option, index) => (
          <div
            key={index}
            className={`option-item ${
              selectedOption === index ? "selected" : ""
            } ${disabled ? "disabled" : ""}`}
            onClick={() => handleOptionSelect(index)}
          >
            <div
              className={`option-radio ${
                selectedOption === index ? "checked" : ""
              }`}
            />
            <span>{option.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-20">
        {isTimeUp ? (
          <div className="alert alert-info">
            Time's up! Waiting for results...
          </div>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            loading={loading}
            size="large"
            className="w-full"
          >
            Submit
          </Button>
        )}
      </div>

      {disabled && !isTimeUp && (
        <div className="mt-10 text-center">
          <small className="text-gray-500">
            Answer submitted. Waiting for results...
          </small>
        </div>
      )}
    </div>
  );
};

export default PollQuestion;
