import io from "socket.io-client";
import { SOCKET_URL, SOCKET_EVENTS } from "../utils/constants";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // FIXED Initialize socket connection
  connect() {
    try {
      console.log("🔄 Attempting to connect to:", SOCKET_URL);

      this.socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        timeout: 10000,
        forceNew: false,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: this.maxReconnectAttempts,
        autoConnect: true,
        withCredentials: true,
        extraHeaders: {
          "Access-Control-Allow-Origin": "*",
        },
      });

      // ENHANCED Connection event handlers
      this.socket.on(SOCKET_EVENTS.CONNECT, () => {
        console.log("✅ Connected to server:", this.socket.id);
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
        console.log("❌ Disconnected from server:", reason);
        this.isConnected = false;

        if (reason === "io server disconnect") {
          // Server disconnected the socket, reconnect manually
          console.log("🔄 Server disconnected, attempting to reconnect...");
          setTimeout(() => this.socket.connect(), 1000);
        }
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ Connection error:", error);
        this.isConnected = false;
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error("❌ Max reconnection attempts reached");
        }
      });

      this.socket.on("reconnect", (attemptNumber) => {
        console.log("✅ Reconnected after", attemptNumber, "attempts");
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      this.socket.on("reconnect_error", (error) => {
        console.error("❌ Reconnection error:", error);
      });

      this.socket.on("reconnect_failed", () => {
        console.error("❌ Reconnection failed after all attempts");
      });

      return this.socket;
    } catch (error) {
      console.error("❌ Failed to initialize socket:", error);
      throw error;
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      console.log("🔌 Disconnecting socket...");
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Add event listener with error handling
  on(event, callback) {
    if (!this.socket) {
      console.warn("⚠️ Socket not initialized for event:", event);
      return;
    }

    try {
      this.socket.on(event, callback);

      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event).add(callback);
    } catch (error) {
      console.error("❌ Error adding listener for event:", event, error);
    }
  }

  // Remove event listener
  off(event, callback) {
    if (!this.socket) return;

    try {
      this.socket.off(event, callback);

      // Remove from stored listeners
      if (this.listeners.has(event)) {
        this.listeners.get(event).delete(callback);
      }
    } catch (error) {
      console.error("❌ Error removing listener for event:", event, error);
    }
  }

  // ENHANCED Emit event to server
  emit(event, data) {
    if (!this.socket) {
      console.warn("⚠️ Socket not initialized for emit:", event);
      return false;
    }

    if (!this.isConnected) {
      console.warn("⚠️ Socket not connected for emit:", event);
      return false;
    }

    try {
      console.log("📤 Emitting event:", event, data);
      this.socket.emit(event, data);
      return true;
    } catch (error) {
      console.error("❌ Error emitting event:", event, error);
      return false;
    }
  }

  // Get socket ID
  getSocketId() {
    return this.socket?.id || null;
  }

  // Check connection status
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  // ENHANCED Student-specific methods with error handling
  joinAsStudent(name) {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      console.error("❌ Invalid name for student join:", name);
      return false;
    }

    console.log("👨‍🎓 Joining as student:", name);
    return this.emit(SOCKET_EVENTS.JOIN_STUDENT, { name: name.trim() });
  }

  submitAnswer(pollId, optionIndex) {
    if (!pollId || optionIndex === undefined || optionIndex === null) {
      console.error("❌ Invalid answer submission data:", {
        pollId,
        optionIndex,
      });
      return false;
    }

    console.log("📝 Submitting answer:", { pollId, optionIndex });
    return this.emit(SOCKET_EVENTS.SUBMIT_ANSWER, { pollId, optionIndex });
  }

  // Teacher-specific methods
  joinAsTeacher() {
    console.log("👩‍🏫 Joining as teacher");
    return this.emit(SOCKET_EVENTS.JOIN_TEACHER);
  }

  createPoll(pollData) {
    if (!pollData || !pollData.question || !pollData.options) {
      console.error("❌ Invalid poll data:", pollData);
      return false;
    }

    console.log("📊 Creating poll:", pollData);
    return this.emit(SOCKET_EVENTS.CREATE_POLL, pollData);
  }

  // ADD THIS NEW METHOD:
  startPoll(pollData) {
    if (!pollData || !pollData.question || !pollData.options) {
      console.error("❌ Invalid poll data:", pollData);
      return false;
    }

    console.log("🚀 Starting poll:", pollData);
    return this.emit("start-poll", pollData); // Note: using "start-poll" to match backend
  }

  removeStudent(studentSocketId) {
    if (!studentSocketId) {
      console.error("❌ Invalid student socket ID:", studentSocketId);
      return false;
    }

    console.log("🚫 Removing student:", studentSocketId);
    return this.emit(SOCKET_EVENTS.REMOVE_STUDENT, { studentSocketId });
  }

  getPollHistory() {
    console.log("📚 Getting poll history");
    return this.emit(SOCKET_EVENTS.GET_POLL_HISTORY);
  }

  // Event listener helpers with automatic error handling
  onNewPoll(callback) {
    this.on(SOCKET_EVENTS.NEW_POLL, (data) => {
      console.log("📢 New poll received:", data);
      callback(data);
    });
  }

  onPollCreated(callback) {
    this.on(SOCKET_EVENTS.POLL_CREATED, (data) => {
      console.log("✅ Poll created:", data);
      callback(data);
    });
  }

  onPollResultsUpdate(callback) {
    this.on(SOCKET_EVENTS.POLL_RESULTS_UPDATE, (data) => {
      console.log("📊 Poll results update:", data);
      callback(data);
    });
  }

  onPollCompleted(callback) {
    this.on(SOCKET_EVENTS.POLL_COMPLETED, (data) => {
      console.log("🏁 Poll completed:", data);
      callback(data);
    });
  }

  onPollTimeUp(callback) {
    this.on(SOCKET_EVENTS.POLL_TIME_UP, (data) => {
      console.log("⏰ Poll time up:", data);
      callback(data);
    });
  }

  onPollStatus(callback) {
    this.on(SOCKET_EVENTS.POLL_STATUS, (data) => {
      console.log("📋 Poll status:", data);
      callback(data);
    });
  }

  onPollHistory(callback) {
    this.on(SOCKET_EVENTS.POLL_HISTORY, (data) => {
      console.log("📚 Poll history:", data);
      callback(data);
    });
  }

  onStudentJoined(callback) {
    this.on(SOCKET_EVENTS.STUDENT_JOINED, (data) => {
      console.log("👋 Student joined:", data);
      callback(data);
    });
  }

  onStudentRemoved(callback) {
    this.on(SOCKET_EVENTS.STUDENT_REMOVED, (data) => {
      console.log("👋 Student removed:", data);
      callback(data);
    });
  }

  onStudentsUpdate(callback) {
    this.on(SOCKET_EVENTS.STUDENTS_UPDATE, (data) => {
      console.log("👥 Students update:", data);
      callback(data);
    });
  }

  onAnswerSubmitted(callback) {
    this.on(SOCKET_EVENTS.ANSWER_SUBMITTED, (data) => {
      console.log("✅ Answer submitted:", data);
      callback(data);
    });
  }

  onWaitingForPoll(callback) {
    this.on(SOCKET_EVENTS.WAITING_FOR_POLL, () => {
      console.log("⏳ Waiting for poll");
      callback();
    });
  }

  onError(callback) {
    this.on(SOCKET_EVENTS.ERROR, (data) => {
      console.error("❌ Socket error:", data);
      callback(data);
    });
  }

  // Cleanup all listeners for a specific event
  removeAllListeners(event) {
    if (!this.socket) return;

    try {
      this.socket.removeAllListeners(event);

      if (this.listeners.has(event)) {
        this.listeners.get(event).clear();
      }
    } catch (error) {
      console.error("❌ Error removing all listeners for event:", event, error);
    }
  }

  // Cleanup all listeners
  removeAllEventListeners() {
    if (!this.socket) return;

    try {
      for (const event of this.listeners.keys()) {
        this.socket.removeAllListeners(event);
      }

      this.listeners.clear();
    } catch (error) {
      console.error("❌ Error removing all event listeners:", error);
    }
  }

  // ENHANCED Reconnect with retry logic
  reconnect(maxRetries = 5) {
    if (this.isSocketConnected()) {
      console.log("✅ Already connected");
      return;
    }

    console.log("🔄 Manual reconnection triggered");

    const attemptReconnect = (attempt) => {
      if (attempt > maxRetries) {
        console.error("❌ Max manual reconnection attempts reached");
        return;
      }

      console.log(`🔄 Manual reconnection attempt ${attempt}/${maxRetries}`);

      this.disconnect();

      setTimeout(() => {
        try {
          this.connect();
        } catch (error) {
          console.error("❌ Manual reconnection failed:", error);
          attemptReconnect(attempt + 1);
        }
      }, 1000 * attempt); // Exponential backoff
    };

    attemptReconnect(1);
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
