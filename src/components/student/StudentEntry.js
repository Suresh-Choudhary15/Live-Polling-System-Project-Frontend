import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { VALIDATION_PATTERNS } from "../../utils/constants";

const StudentEntry = ({ onNameSubmit, loading = false }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const validateName = (inputName) => {
    if (!inputName.trim()) {
      return "Name is required";
    }

    if (inputName.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }

    if (inputName.trim().length > 50) {
      return "Name must be less than 50 characters";
    }

    if (!VALIDATION_PATTERNS.NAME.test(inputName.trim())) {
      return "Name can only contain letters and spaces";
    }

    return "";
  };

  const handleNameChange = (e) => {
    const inputName = e.target.value;
    setName(inputName);

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const validationError = validateName(trimmedName);

    if (validationError) {
      setError(validationError);
      return;
    }

    onNameSubmit(trimmedName);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="student-entry">
      <div className="badge badge-purple mb-20">Interactive Poll</div>

      <h1>Let's Get Started</h1>
      <p>
        If you're a student, you'll be able to{" "}
        <strong>submit your answers</strong>, participate in live polls, and see
        how your responses compare with your classmates
      </p>

      <form onSubmit={handleSubmit} className="mt-30">
        <Input
          label="Enter your Name"
          type="text"
          value={name}
          onChange={handleNameChange}
          onKeyPress={handleKeyPress}
          placeholder="Rahul Bajaj"
          required
          error={error}
          disabled={loading}
          className="text-center"
          autoFocus
        />

        <div className="mt-20">
          <Button
            type="submit"
            size="large"
            disabled={!name.trim() || loading}
            loading={loading}
            className="w-full"
          >
            Continue
          </Button>
        </div>
      </form>

      <div className="mt-20 text-center">
        <small className="text-gray-500">
          Your name will be visible to the teacher and other participants
        </small>
      </div>
    </div>
  );
};

export default StudentEntry;
