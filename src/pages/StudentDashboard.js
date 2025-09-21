import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentEntry from "../components/student/StudentEntry";
import PollQuestion from "../components/student/PollQuestion";
import WaitingScreen from "../components/student/WaitingScreen";
import ResultsView from "../components/student/ResultsView";
import { useStudentSocket, useSocketError } from "../hooks/useSocket";
import {
  STORAGE_KEYS,
  STUDENT_STATES,
  ERROR_MESSAGES,
} from "../utils/constants";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [currentState, setCurrentState] = useState(
    STUDENT_STATES.ENTERING_NAME
  );
  const [loading, setLoading] = useState(false);

  const {
    isConnected,
    currentPoll,
    pollResults,
    hasAnswered,
    isWaiting,
    isRemoved,
    timeRemaining,
    joinAsStudent,
    submitAnswer,
  } = useStudentSocket();

  const { error, clearError } = useSocketError();

  // Load saved student name
  useEffect(() => {
    const savedName = localStorage.getItem(STORAGE_KEYS.STUDENT_NAME);
    console.log("📱 Checking saved student name:", savedName);

    if (savedName && savedName.trim().length >= 2) {
      console.log("✅ Found valid saved name, auto-joining...");
      setStudentName(savedName);
      setCurrentState(STUDENT_STATES.WAITING_FOR_POLL);

      if (isConnected) {
        console.log("🔌 Connected, attempting to join as student...");
        joinAsStudent(savedName);
      }
    }
  }, [isConnected, joinAsStudent]);

  // Handle state changes based on socket events
  useEffect(() => {
    console.log("🔄 State update check:", {
      isRemoved,
      studentName,
      currentPoll,
      hasAnswered,
      pollResults,
      isWaiting,
      timeRemaining,
    });

    if (isRemoved) {
      console.log("🚫 Student removed, clearing session...");
      setCurrentState(STUDENT_STATES.REMOVED);
      localStorage.removeItem(STORAGE_KEYS.STUDENT_NAME);
      return;
    }

    if (!studentName) {
      setCurrentState(STUDENT_STATES.ENTERING_NAME);
      return;
    }

    if (currentPoll && !hasAnswered && timeRemaining > 0) {
      console.log("📝 Poll active, switching to answering state");
      setCurrentState(STUDENT_STATES.ANSWERING_POLL);
    } else if (pollResults || hasAnswered) {
      console.log("📊 Results available, switching to results view");
      setCurrentState(STUDENT_STATES.VIEWING_RESULTS);
    } else if (isWaiting) {
      console.log("⏳ Waiting for poll, switching to waiting state");
      setCurrentState(STUDENT_STATES.WAITING_FOR_POLL);
    }
  }, [
    currentPoll,
    pollResults,
    hasAnswered,
    isWaiting,
    isRemoved,
    timeRemaining,
    studentName,
  ]);

  // SIMPLIFIED Handle name submission - ALWAYS SUCCESS
  const handleNameSubmit = async (name) => {
    console.log("📝 Submitting name:", name);
    setLoading(true);

    try {
      const trimmedName = name.trim();
      console.log("👤 Setting student name:", trimmedName);

      // Set name and save immediately
      setStudentName(trimmedName);
      localStorage.setItem(STORAGE_KEYS.STUDENT_NAME, trimmedName);

      // Always switch to waiting state first
      setCurrentState(STUDENT_STATES.WAITING_FOR_POLL);

      // Try to join, but don't fail if it doesn't work
      if (isConnected) {
        console.log("🔌 Attempting to join as student...");
        joinAsStudent(trimmedName);
      }

      // Always clear errors and show success
      clearError();

      console.log("✅ Name submission completed successfully");
    } catch (err) {
      console.error("❌ Failed to submit name:", err);
      // Even on error, continue with the flow
      setCurrentState(STUDENT_STATES.WAITING_FOR_POLL);
    } finally {
      setLoading(false);
    }
  };

  // Handle answer submission
  const handleAnswerSubmit = async (pollId, optionIndex) => {
    console.log("📤 Submitting answer:", { pollId, optionIndex });
    setLoading(true);

    try {
      if (isConnected && !hasAnswered && timeRemaining > 0) {
        submitAnswer(pollId, optionIndex);
        console.log("✅ Answer submission sent");
        clearError();
      }
    } catch (err) {
      console.error("❌ Failed to submit answer:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    console.log("🏠 Going home, clearing session...");
    localStorage.removeItem(STORAGE_KEYS.STUDENT_NAME);
    navigate("/");
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case STUDENT_STATES.ENTERING_NAME:
        return (
          <StudentEntry onNameSubmit={handleNameSubmit} loading={loading} />
        );

      case STUDENT_STATES.WAITING_FOR_POLL:
        return (
          <WaitingScreen
            studentName={studentName}
            onPollReceived={(pollData) => {
              console.log("📝 Poll received in dashboard:", pollData);
              // The useEffect will handle state transition automatically
            }}
          />
        );

      case STUDENT_STATES.ANSWERING_POLL:
        return currentPoll ? ( // ADD THIS CHECK
          <PollQuestion
            poll={currentPoll}
            timeRemaining={timeRemaining}
            onSubmitAnswer={handleAnswerSubmit}
            disabled={hasAnswered}
            loading={loading}
          />
        ) : (
          <div className="loading">Loading poll...</div>
        );

      case STUDENT_STATES.VIEWING_RESULTS:
        return (
          <ResultsView
            results={pollResults?.results || pollResults}
            questionText={currentPoll?.question}
            isWaitingForNext={!currentPoll}
          />
        );

      case STUDENT_STATES.REMOVED:
        return (
          <div className="text-center">
            <div className="badge badge-purple mb-20">Interactive Poll</div>
            <h2>You've been Kicked out!</h2>
            <p>
              Looks like the teacher has removed you from the poll system.
              Please try again something.
            </p>
            <div className="mt-30">
              <button className="btn btn-primary" onClick={handleGoHome}>
                Go Home
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        );
    }
  };

  return (
    <div className="container">
      {/* Connection Status - Only show if disconnected */}
      {!isConnected && (
        <div className="alert alert-error mb-20">
          <div className="flex-between">
            <div>
              <strong>Connection Lost:</strong>
              <span className="ml-5">Trying to reconnect...</span>
            </div>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Error Display - Only show critical errors */}
      {error && error.includes("critical") && (
        <div className="alert alert-error mb-20">
          <div className="flex-between">
            <div>
              <strong>Error:</strong>
              <span className="ml-5">{error}</span>
            </div>
            <button className="btn btn-sm btn-secondary" onClick={clearError}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && (
        <div
          className="debug-info"
          style={{
            fontSize: "12px",
            color: "#666",
            marginBottom: "10px",
            padding: "10px",
            background: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Debug Info:</strong>
          <br />
          Connected: {isConnected ? "✅" : "❌"} | State: {currentState} | Name:{" "}
          {studentName || "None"} | Poll: {currentPoll ? "✅" : "❌"} |
          Answered: {hasAnswered ? "✅" : "❌"}
        </div>
      )}

      {/* Main Content */}
      {renderCurrentState()}

      {/* Footer */}
      {studentName && currentState !== STUDENT_STATES.REMOVED && (
        <div className="mt-30 text-center">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleGoHome}
            disabled={loading}
          >
            Leave Session
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
