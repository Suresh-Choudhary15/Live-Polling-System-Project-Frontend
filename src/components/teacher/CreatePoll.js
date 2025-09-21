import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { POLL_CONFIG, VALIDATION_PATTERNS } from "../../utils/constants";

const CreatePoll = ({ onCreatePoll, loading = false }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [timeLimit, setTimeLimit] = useState(POLL_CONFIG.DEFAULT_TIME_LIMIT);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validate question
    if (!question.trim()) {
      newErrors.question = "Question is required";
    } else if (question.trim().length < POLL_CONFIG.MIN_QUESTION_LENGTH) {
      newErrors.question = `Question must be at least ${POLL_CONFIG.MIN_QUESTION_LENGTH} characters`;
    } else if (question.trim().length > POLL_CONFIG.MAX_QUESTION_LENGTH) {
      newErrors.question = `Question must be less than ${POLL_CONFIG.MAX_QUESTION_LENGTH} characters`;
    }

    // Validate options
    const validOptions = options.filter((opt) => opt.trim());
    if (validOptions.length < POLL_CONFIG.MIN_OPTIONS) {
      newErrors.options = `At least ${POLL_CONFIG.MIN_OPTIONS} options are required`;
    }

    options.forEach((option, index) => {
      if (
        option.trim() &&
        option.trim().length > POLL_CONFIG.MAX_OPTION_LENGTH
      ) {
        newErrors[
          `option_${index}`
        ] = `Option must be less than ${POLL_CONFIG.MAX_OPTION_LENGTH} characters`;
      }
    });

    // Validate time limit
    if (
      timeLimit < POLL_CONFIG.MIN_TIME_LIMIT ||
      timeLimit > POLL_CONFIG.MAX_TIME_LIMIT
    ) {
      newErrors.timeLimit = `Time limit must be between ${POLL_CONFIG.MIN_TIME_LIMIT} and ${POLL_CONFIG.MAX_TIME_LIMIT} seconds`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
    if (errors.question) {
      setErrors((prev) => ({ ...prev, question: "" }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);

    if (errors.options || errors[`option_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors.options;
      delete newErrors[`option_${index}`];
      setErrors(newErrors);
    }
  };

  const addOption = () => {
    if (options.length < POLL_CONFIG.MAX_OPTIONS) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > POLL_CONFIG.MIN_OPTIONS) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleTimeLimitChange = (e) => {
    const value = parseInt(e.target.value);
    setTimeLimit(value);
    if (errors.timeLimit) {
      setErrors((prev) => ({ ...prev, timeLimit: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const validOptions = options
      .filter((opt) => opt.trim())
      .map((opt) => opt.trim());

    const pollData = {
      question: question.trim(),
      options: validOptions,
      timeLimit,
    };

    onCreatePoll(pollData);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="create-poll-form">
      <h2>Let's Get Started</h2>
      <p>
        You'll have the ability to create and manage polls, ask questions, and
        monitor your students' responses in real-time.
      </p>

      <form onSubmit={handleSubmit} className="mt-30">
        {/* Question Input */}
        <Input
          label="Enter your question"
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Which planet is known as the Red Planet?"
          required
          error={errors.question}
          disabled={loading}
        />

        {/* Character Count */}
        <div className="text-right mb-10">
          <small className="text-gray-500">
            {question.length}/{POLL_CONFIG.MAX_QUESTION_LENGTH}
          </small>
        </div>

        {/* Time Limit */}
        <div className="time-limit-section">
          <label className="input-label">Time Limit</label>
          <div className="time-limit-controls">
            <select
              value={timeLimit}
              onChange={handleTimeLimitChange}
              className="input time-input"
              disabled={loading}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
              <option value={120}>2 minutes</option>
              <option value={180}>3 minutes</option>
              <option value={300}>5 minutes</option>
            </select>
            <span className="text-gray-500">({formatTime(timeLimit)})</span>
          </div>
          {errors.timeLimit && (
            <div className="error-message">{errors.timeLimit}</div>
          )}
        </div>

        {/* Options */}
        <div className="edit-options">
          <label className="input-label">Edit Options</label>

          {options.map((option, index) => (
            <div key={index} className="option-input-group">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className={`input option-input ${
                  errors[`option_${index}`] ? "input-error" : ""
                }`}
                disabled={loading}
              />

              {options.length > POLL_CONFIG.MIN_OPTIONS && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="remove-option"
                  disabled={loading}
                  title="Remove option"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {/* Add Option Button */}
          {options.length < POLL_CONFIG.MAX_OPTIONS && (
            <button
              type="button"
              onClick={addOption}
              className="add-option-btn"
              disabled={loading}
            >
              + Add More option
            </button>
          )}

          {errors.options && (
            <div className="error-message mt-10">{errors.options}</div>
          )}
        </div>

        {/* Is it Correct Section */}
        <div className="correct-answer-section">
          <h3>Is it Correct?</h3>
          <p className="text-gray-500 mb-10">
            Mark the correct answer(s) for reference
          </p>

          {options.map(
            (option, index) =>
              option.trim() && (
                <div key={index} className="flex items-center gap-10 mb-10">
                  <input
                    type="radio"
                    id={`correct_${index}`}
                    name="correctAnswer"
                    className="radio-input"
                  />
                  <label htmlFor={`correct_${index}`} className="text-sm">
                    {option.trim() || `Option ${index + 1}`}
                  </label>
                </div>
              )
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-30">
          <Button
            type="submit"
            size="large"
            loading={loading}
            disabled={
              !question.trim() || options.filter((opt) => opt.trim()).length < 2
            }
            className="w-full"
          >
            Ask Question
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePoll;
