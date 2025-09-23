import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreatePoll from "../components/teacher/CreatePoll";
import PollResults from "../components/teacher/PollResults";
import ParticipantsList from "../components/teacher/ParticipantsList";
import PollHistory from "../components/teacher/PollHistory";
import Button from "../components/common/Button";
import { useTeacherSocket, useSocketError } from "../hooks/useSocket";
import { TEACHER_STATES } from "../utils/constants";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState(TEACHER_STATES.CREATING_POLL);
  const [loading, setLoading] = useState(false);

  const {
    isConnected,
    currentPoll,
    students,
    pollResults,
    pollHistory,
    createPoll,
    removeStudent,
    getPollHistory,
  } = useTeacherSocket();

  const { error, clearError } = useSocketError();

  // Update view based on poll state
  useEffect(() => {
    if (currentPoll) {
      setCurrentView(TEACHER_STATES.POLL_ACTIVE);
    } else if (pollResults) {
      setCurrentView(TEACHER_STATES.VIEWING_RESULTS);
    } else {
      setCurrentView(TEACHER_STATES.CREATING_POLL);
    }
  }, [currentPoll, pollResults]);

  const handleCreatePoll = async (pollData) => {
    setLoading(true);
    try {
      createPoll(pollData);
      clearError();
    } catch (err) {
      console.error("Failed to create poll:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (studentSocketId) => {
    try {
      removeStudent(studentSocketId);
      clearError();
    } catch (err) {
      console.error("Failed to remove student:", err);
    }
  };

  const handleViewHistory = () => {
    setCurrentView(TEACHER_STATES.VIEWING_HISTORY);
    getPollHistory();
  };

  const handleBackToPolls = () => {
    setCurrentView(TEACHER_STATES.CREATING_POLL);
  };

  const handleAskNewQuestion = () => {
    setCurrentView(TEACHER_STATES.CREATING_POLL);
  };

  const canAskNewQuestion = () => {
    if (!currentPoll) return true;
    return (
      students.every((student) => student.hasAnswered) && students.length > 0
    );
  };

  const renderMainContent = () => {
    switch (currentView) {
      case TEACHER_STATES.CREATING_POLL:
        return <CreatePoll onCreatePoll={handleCreatePoll} loading={loading} />;

      case TEACHER_STATES.POLL_ACTIVE:
      case TEACHER_STATES.VIEWING_RESULTS:
        return (
          <PollResults
            poll={currentPoll}
            results={pollResults?.results || pollResults}
            totalStudents={students.length}
            answeredStudents={students.filter((s) => s.hasAnswered).length}
            onAskNewQuestion={handleAskNewQuestion}
            canAskNew={canAskNewQuestion()}
          />
        );

      case TEACHER_STATES.VIEWING_HISTORY:
        return <PollHistory history={pollHistory} />;

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
    <div className="container container-full">
      <div className="teacher-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div className="flex-between mb-20">
            <div>
              <div className="badge badge-purple mb-10">Interactive Poll</div>
              <h1>Teacher Dashboard</h1>
            </div>

            <div className="header-actions flex gap-10">
              {currentView === TEACHER_STATES.VIEWING_HISTORY ? (
                <Button variant="secondary" onClick={handleBackToPolls}>
                  ← Back to Polls
                </Button>
              ) : (
                <Button variant="secondary" onClick={handleViewHistory}>
                  📊 View Poll History
                </Button>
              )}

              <Button variant="secondary" onClick={() => navigate("/")}>
                🏠 Home
              </Button>
            </div>
          </div>

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
              <Button
                variant="secondary"
                size="small"
                className="ml-10"
                onClick={clearError}
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="dashboard-content">
          <div className="content-grid">
            {/* Main Content */}
            <div className="main-content">{renderMainContent()}</div>

            {/* Sidebar */}
            {currentView !== TEACHER_STATES.VIEWING_HISTORY && (
              <div className="sidebar">
                <ParticipantsList
                  students={students}
                  onRemoveStudent={handleRemoveStudent}
                  showChat={true}
                  activePoll={currentPoll}
                />
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-items">
            <div className="status-item">
              <span className="status-label">Connection:</span>
              <span
                className={`status-value ${
                  isConnected ? "connected" : "disconnected"
                }`}
              >
                {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
              </span>
            </div>

            <div className="status-item">
              <span className="status-label">Students:</span>
              <span className="status-value">{students.length} online</span>
            </div>

            {currentPoll && (
              <div className="status-item">
                <span className="status-label">Poll Status:</span>
                <span className="status-value">
                  {students.filter((s) => s.hasAnswered).length}/
                  {students.length} answered
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
