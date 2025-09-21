import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentEntry from "../components/student/StudentEntry";
import PollQuestion from "../components/student/PollQuestion";
import WaitingScreen from "../components/student/WaitingScreen";
import ResultsView from "../components/student/ResultsView";
import { useStudentSocket, useSocketError } from "../hooks/useSocket";
import { STORAGE_KEYS, STUDENT_STATES } from "../utils/constants";

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
    if (savedName) {
      setStudentName(savedName);
      setCurrentState(STUDENT_STATES.WAITING_FOR_POLL);
      if (isConnected) {
        joinAsStudent(savedName);
      }
    }
  }, [isConnected, joinAsStudent]);

  // Handle state changes based on socket events
  useEffect(() => {
    if (isRemoved) {
      setCurrentState(STUDENT_STATES.REMOVED);
      localStorage.removeItem(STORAGE_KEYS.STUDENT_NAME);
      return;
    }

    if (!studentName) {
      setCurrentState(STUDENT_STATES.ENTERING_NAME);
      return;
    }

    if (currentPoll && !hasAnswered && timeRemaining > 0) {
      setCurrentState(STUDENT_STATES.ANSWERING_POLL);
    } else if (pollResults || hasAnswered) {
      setCurrentState(STUDENT_STATES.VIEWING_RESULTS);
    } else if (isWaiting) {
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

  const handleNameSubmit = async (name) => {
    setLoading(true);
    try {
      setStudentName(name);
      localStorage.setItem(STORAGE_KEYS.STUDENT_NAME, name);

      if (isConnected) {
        joinAsStudent(name);
      }

      setCurrentState(STUDENT_STATES.WAITING_FOR_POLL);
      clearError();
    } catch (err) {
      console.error("Failed to join as student:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (pollId, optionIndex) => {
    setLoading(true);
    try {
      submitAnswer(pollId, optionIndex);
      clearError();
    } catch (err) {
      console.error("Failed to submit answer:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
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
        return <WaitingScreen studentName={studentName} />;

      case STUDENT_STATES.ANSWERING_POLL:
        return (
          <PollQuestion
            poll={currentPoll}
            timeRemaining={timeRemaining}
            onSubmitAnswer={handleAnswerSubmit}
            disabled={hasAnswered}
            loading={loading}
          />
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
      {/* Connection Status */}
      {!isConnected && (
        <div className="alert alert-error mb-20">
          <strong>Connection Lost:</strong> Trying to reconnect...
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="alert alert-error mb-20">
          <strong>Error:</strong> {error}
          <button
            className="btn btn-sm btn-secondary ml-10"
            onClick={clearError}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content */}
      {renderCurrentState()}

      {/* Footer */}
      {studentName && currentState !== STUDENT_STATES.REMOVED && (
        <div className="mt-30 text-center">
          <button className="btn btn-secondary btn-sm" onClick={handleGoHome}>
            Leave Session
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
