import io from "socket.io-client";
import { SOCKET_URL, SOCKET_EVENTS } from "../utils/constants";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  // Initialize socket connection
  connect() {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        timeout: 5000,
        forceNew: true,
      });

      this.socket.on(SOCKET_EVENTS.CONNECT, () => {
        console.log("Connected to server:", this.socket.id);
        this.isConnected = true;
      });

      this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
        console.log("Disconnected from server:", reason);
        this.isConnected = false;
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        this.isConnected = false;
      });

      return this.socket;
    } catch (error) {
      console.error("Failed to initialize socket:", error);
      throw error;
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Add event listener
  on(event, callback) {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    this.socket.on(event, callback);

    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);

    // Remove from stored listeners
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  // Emit event to server
  emit(event, data) {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    if (!this.isConnected) {
      console.warn("Socket not connected");
      return;
    }

    this.socket.emit(event, data);
  }

  // Get socket ID
  getSocketId() {
    return this.socket?.id || null;
  }

  // Check connection status
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  // Teacher-specific methods
  joinAsTeacher() {
    this.emit(SOCKET_EVENTS.JOIN_TEACHER);
  }

  createPoll(pollData) {
    this.emit(SOCKET_EVENTS.CREATE_POLL, pollData);
  }

  removeStudent(studentSocketId) {
    this.emit(SOCKET_EVENTS.REMOVE_STUDENT, { studentSocketId });
  }

  getPollHistory() {
    this.emit(SOCKET_EVENTS.GET_POLL_HISTORY);
  }

  // Student-specific methods
  joinAsStudent(name) {
    this.emit(SOCKET_EVENTS.JOIN_STUDENT, { name });
  }

  submitAnswer(pollId, optionIndex) {
    this.emit(SOCKET_EVENTS.SUBMIT_ANSWER, { pollId, optionIndex });
  }

  // Event listener helpers
  onNewPoll(callback) {
    this.on(SOCKET_EVENTS.NEW_POLL, callback);
  }

  onPollCreated(callback) {
    this.on(SOCKET_EVENTS.POLL_CREATED, callback);
  }

  onPollResultsUpdate(callback) {
    this.on(SOCKET_EVENTS.POLL_RESULTS_UPDATE, callback);
  }

  onPollCompleted(callback) {
    this.on(SOCKET_EVENTS.POLL_COMPLETED, callback);
  }

  onPollTimeUp(callback) {
    this.on(SOCKET_EVENTS.POLL_TIME_UP, callback);
  }

  onPollStatus(callback) {
    this.on(SOCKET_EVENTS.POLL_STATUS, callback);
  }

  onPollHistory(callback) {
    this.on(SOCKET_EVENTS.POLL_HISTORY, callback);
  }

  onStudentJoined(callback) {
    this.on(SOCKET_EVENTS.STUDENT_JOINED, callback);
  }

  onStudentRemoved(callback) {
    this.on(SOCKET_EVENTS.STUDENT_REMOVED, callback);
  }

  onStudentsUpdate(callback) {
    this.on(SOCKET_EVENTS.STUDENTS_UPDATE, callback);
  }

  onAnswerSubmitted(callback) {
    this.on(SOCKET_EVENTS.ANSWER_SUBMITTED, callback);
  }

  onWaitingForPoll(callback) {
    this.on(SOCKET_EVENTS.WAITING_FOR_POLL, callback);
  }

  onError(callback) {
    this.on(SOCKET_EVENTS.ERROR, callback);
  }

  // Cleanup all listeners for a specific event
  removeAllListeners(event) {
    if (!this.socket) return;

    this.socket.removeAllListeners(event);

    if (this.listeners.has(event)) {
      this.listeners.get(event).clear();
    }
  }

  // Cleanup all listeners
  removeAllEventListeners() {
    if (!this.socket) return;

    for (const event of this.listeners.keys()) {
      this.socket.removeAllListeners(event);
    }

    this.listeners.clear();
  }

  // Reconnect with retry logic
  reconnect(maxRetries = 3) {
    let retries = 0;

    const attemptReconnect = () => {
      if (retries >= maxRetries) {
        console.error("Max reconnection attempts reached");
        return;
      }

      retries++;
      console.log(`Reconnection attempt ${retries}/${maxRetries}`);

      this.disconnect();

      setTimeout(() => {
        try {
          this.connect();
        } catch (error) {
          console.error("Reconnection failed:", error);
          attemptReconnect();
        }
      }, 1000 * retries); // Exponential backoff
    };

    if (!this.isSocketConnected()) {
      attemptReconnect();
    }
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
