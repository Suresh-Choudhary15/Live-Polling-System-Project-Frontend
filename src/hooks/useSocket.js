import { useEffect, useRef, useState } from "react";
import socketService from "../services/socketService";
import { SOCKET_EVENTS } from "../utils/constants";

// Custom hook for socket management
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    try {
      socketRef.current = socketService.connect();

      // Connection event handlers
      socketService.on(SOCKET_EVENTS.CONNECT, () => {
        setIsConnected(true);
        setError(null);
      });

      socketService.on(SOCKET_EVENTS.DISCONNECT, () => {
        setIsConnected(false);
      });

      socketService.on("connect_error", (err) => {
        setError(err.message);
        setIsConnected(false);
      });
    } catch (err) {
      setError(err.message);
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
      setIsConnected(false);
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    error,
    socketService,
  };
};

// Custom hook for teacher socket events
export const useTeacherSocket = () => {
  const { socketService, isConnected } = useSocket();
  const [polls, setPolls] = useState([]);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [students, setStudents] = useState([]);
  const [pollResults, setPollResults] = useState(null);
  const [pollHistory, setPollHistory] = useState([]);

  useEffect(() => {
    if (!isConnected) return;

    // Join as teacher
    socketService.joinAsTeacher();

    // Poll events
    socketService.onPollCreated((data) => {
      setCurrentPoll(data);
      setPollResults(null);
    });

    socketService.onPollResultsUpdate((data) => {
      setPollResults(data);
    });

    socketService.onPollCompleted((data) => {
      setPollResults(data);
      setCurrentPoll(null);
    });

    socketService.onPollStatus((data) => {
      if (data) {
        setCurrentPoll(data.poll);
        setPollResults(data.results);
      }
    });

    socketService.onPollHistory((data) => {
      setPollHistory(data.history || []);
    });

    // Student events
    socketService.onStudentsUpdate((data) => {
      setStudents(data.students || []);
    });

    socketService.onStudentJoined((student) => {
      setStudents((prev) => [...prev, student]);
    });

    // Cleanup listeners
    return () => {
      socketService.removeAllListeners(SOCKET_EVENTS.POLL_CREATED);
      socketService.removeAllListeners(SOCKET_EVENTS.POLL_RESULTS_UPDATE);
      socketService.removeAllListeners(SOCKET_EVENTS.POLL_COMPLETED);
      socketService.removeAllListeners(SOCKET_EVENTS.POLL_STATUS);
      socketService.removeAllListeners(SOCKET_EVENTS.POLL_HISTORY);
      socketService.removeAllListeners(SOCKET_EVENTS.STUDENTS_UPDATE);
      socketService.removeAllListeners(SOCKET_EVENTS.STUDENT_JOINED);
    };
  }, [isConnected, socketService]);

  const createPoll = (pollData) => {
    socketService.createPoll(pollData);
  };

  const removeStudent = (studentSocketId) => {
    socketService.removeStudent(studentSocketId);
  };

  const getPollHistory = () => {
    socketService.getPollHistory();
  };

  return {
    isConnected,
    currentPoll,
    students,
    pollResults,
    pollHistory,
    createPoll,
    removeStudent,
    getPollHistory,
  };
};

// Custom hook for student socket events
export const useStudentSocket = () => {
  const { socketService, isConnected } = useSocket();
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [isRemoved, setIsRemoved] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!isConnected) return;

    // Poll events
    socketService.onNewPoll((data) => {
      setCurrentPoll(data);
      setPollResults(null);
      setHasAnswered(false);
      setIsWaiting(false);
      setTimeRemaining(data.timeRemaining || data.timeLimit || 60);
    });

    socketService.onPollCompleted((data) => {
      setPollResults(data.results);
      setCurrentPoll(null);
      setIsWaiting(true);
    });

    socketService.onPollTimeUp((data) => {
      setPollResults(data.results);
      setCurrentPoll(null);
      setIsWaiting(true);
      setTimeRemaining(0);
    });

    socketService.onAnswerSubmitted((data) => {
      setHasAnswered(true);
      setPollResults(data.results);
      if (data.isCompleted) {
        setCurrentPoll(null);
        setIsWaiting(true);
      }
    });

    socketService.onWaitingForPoll(() => {
      setIsWaiting(true);
      setCurrentPoll(null);
      setPollResults(null);
      setHasAnswered(false);
    });

    socketService.onStudentRemoved(() => {
      setIsRemoved(true);
    });

    // Cleanup listeners
    return () => {
      socketService.removeAllListeners(SOCKET_EVENTS.NEW_POLL);
      socketService.removeAllListeners(SOCKET_EVENTS.POLL_COMPLETED);
      socketService.removeAllListeners(SOCKET_EVENTS.POLL_TIME_UP);
      socketService.removeAllListeners(SOCKET_EVENTS.ANSWER_SUBMITTED);
      socketService.removeAllListeners(SOCKET_EVENTS.WAITING_FOR_POLL);
      socketService.removeAllListeners(SOCKET_EVENTS.STUDENT_REMOVED);
    };
  }, [isConnected, socketService]);

  // Timer effect
  useEffect(() => {
    if (currentPoll && timeRemaining > 0 && !hasAnswered) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentPoll, timeRemaining, hasAnswered]);

  const joinAsStudent = (name) => {
    socketService.joinAsStudent(name);
  };

  const submitAnswer = (pollId, optionIndex) => {
    if (!hasAnswered && timeRemaining > 0) {
      socketService.submitAnswer(pollId, optionIndex);
    }
  };

  return {
    isConnected,
    currentPoll,
    pollResults,
    hasAnswered,
    isWaiting,
    isRemoved,
    timeRemaining,
    joinAsStudent,
    submitAnswer,
  };
};

// Custom hook for error handling
export const useSocketError = () => {
  const [error, setError] = useState(null);
  const { socketService } = useSocket();

  useEffect(() => {
    socketService.onError((errorData) => {
      setError(errorData.message || "An unknown error occurred");
    });

    return () => {
      socketService.removeAllListeners(SOCKET_EVENTS.ERROR);
    };
  }, [socketService]);

  const clearError = () => {
    setError(null);
  };

  return { error, clearError };
};

// Custom hook for connection status
export const useConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const { socketService } = useSocket();

  useEffect(() => {
    socketService.on(SOCKET_EVENTS.CONNECT, () => {
      setConnectionStatus("connected");
    });

    socketService.on(SOCKET_EVENTS.DISCONNECT, () => {
      setConnectionStatus("disconnected");
    });

    socketService.on("connect_error", () => {
      setConnectionStatus("error");
    });

    socketService.on("reconnect", () => {
      setConnectionStatus("reconnected");
    });

    socketService.on("reconnecting", () => {
      setConnectionStatus("reconnecting");
    });

    return () => {
      socketService.removeAllListeners(SOCKET_EVENTS.CONNECT);
      socketService.removeAllListeners(SOCKET_EVENTS.DISCONNECT);
      socketService.removeAllListeners("connect_error");
      socketService.removeAllListeners("reconnect");
      socketService.removeAllListeners("reconnecting");
    };
  }, [socketService]);

  return connectionStatus;
};
