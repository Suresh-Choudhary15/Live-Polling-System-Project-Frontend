// FIXED API Configuration with multiple fallbacks
export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:5000";

export const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:5000";

// Debug logging
console.log("🔧 Configuration loaded:");
console.log("📡 API_BASE_URL:", API_BASE_URL);
console.log("🔌 SOCKET_URL:", SOCKET_URL);
console.log("🌍 Environment:", process.env.NODE_ENV);

// Socket Events
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: "connect",
  DISCONNECT: "disconnect",

  // Teacher Events
  JOIN_TEACHER: "join-teacher",
  CREATE_POLL: "create-poll",
  REMOVE_STUDENT: "remove-student",
  GET_POLL_HISTORY: "get-poll-history",

  // Student Events
  JOIN_STUDENT: "join-student",
  SUBMIT_ANSWER: "submit-answer",

  // Broadcast Events
  NEW_POLL: "new-poll",
  POLL_CREATED: "poll-created",
  POLL_RESULTS_UPDATE: "poll-results-update",
  POLL_COMPLETED: "poll-completed",
  POLL_TIME_UP: "poll-time-up",
  POLL_STATUS: "poll-status",
  POLL_HISTORY: "poll-history",

  // Student Management
  STUDENT_JOINED: "student-joined",
  STUDENT_REMOVED: "student-removed",
  STUDENTS_UPDATE: "students-update",

  // Answer Events
  ANSWER_SUBMITTED: "answer-submitted",

  // Waiting States
  WAITING_FOR_POLL: "waiting-for-poll",

  // Error Events
  ERROR: "error",
};

// Poll Configuration
export const POLL_CONFIG = {
  MIN_OPTIONS: 2,
  MAX_OPTIONS: 6,
  MIN_TIME_LIMIT: 10, // seconds
  MAX_TIME_LIMIT: 300, // seconds
  DEFAULT_TIME_LIMIT: 60, // seconds
  MIN_QUESTION_LENGTH: 5,
  MAX_QUESTION_LENGTH: 500,
  MIN_OPTION_LENGTH: 1,
  MAX_OPTION_LENGTH: 100,
};

// UI Constants
export const UI_STATES = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  IDLE: "idle",
};

// Student States
export const STUDENT_STATES = {
  ENTERING_NAME: "entering_name",
  WAITING_FOR_POLL: "waiting_for_poll",
  ANSWERING_POLL: "answering_poll",
  VIEWING_RESULTS: "viewing_results",
  REMOVED: "removed",
};

// Teacher States
export const TEACHER_STATES = {
  CREATING_POLL: "creating_poll",
  POLL_ACTIVE: "poll_active",
  VIEWING_RESULTS: "viewing_results",
  VIEWING_HISTORY: "viewing_history",
};

// ENHANCED Error Messages
export const ERROR_MESSAGES = {
  CONNECTION_FAILED:
    "Failed to connect to server. Please check your internet connection.",
  SOCKET_CONNECTION_FAILED:
    "Real-time connection failed. Please refresh the page.",
  INVALID_NAME: "Please enter a valid name (2-50 characters, letters only)",
  POLL_CREATION_FAILED: "Failed to create poll. Please try again.",
  ANSWER_SUBMISSION_FAILED: "Failed to submit answer. Please try again.",
  STUDENT_REMOVAL_FAILED: "Failed to remove student. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please refresh the page.",
  SERVER_UNAVAILABLE:
    "Server is currently unavailable. Please try again later.",
  JOIN_STUDENT_FAILED:
    "Failed to join as student. Please check your connection and try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  POLL_CREATED: "Poll created successfully",
  ANSWER_SUBMITTED: "Answer submitted successfully",
  STUDENT_REMOVED: "Student removed successfully",
  CONNECTION_ESTABLISHED: "Connected successfully",
  STUDENT_JOINED: "Successfully joined the session",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  STUDENT_NAME: "live_polling_student_name",
  USER_ROLE: "live_polling_user_role",
  THEME_PREFERENCE: "live_polling_theme",
  SOCKET_ID: "live_polling_socket_id",
};

// Colors for Charts/Results (matching Figma palette)
export const CHART_COLORS = [
  "#4F0DCE", // Primary purple
  "#7765DA", // Secondary purple
  "#5767D0", // Tertiary purple
  "#6E6E6E", // Medium gray
  "#373737", // Dark gray
  "#F2F2F2", // Light gray
];

// ENHANCED Validation Patterns
export const VALIDATION_PATTERNS = {
  NAME: /^[a-zA-Z\s\u00C0-\u017F]{2,50}$/, // Allow accented characters
  QUESTION: /^.{5,500}$/,
  OPTION: /^.{1,100}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Animation Durations (in milliseconds)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  EXTRA_SLOW: 500,
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};

// Component Variants
export const BUTTON_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  DANGER: "danger",
  SUCCESS: "success",
};

export const BUTTON_SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
};

// ENHANCED Timeouts and Intervals
export const TIMEOUTS = {
  DEBOUNCE: 300,
  RETRY: 1000,
  TOAST: 3000,
  POLL_UPDATE: 1000,
  CONNECTION_RETRY: 2000,
  HEALTH_CHECK: 5000,
};

// Connection Configuration
export const CONNECTION_CONFIG = {
  MAX_RETRY_ATTEMPTS: 5,
  RETRY_DELAY: 1000,
  PING_INTERVAL: 25000,
  PING_TIMEOUT: 5000,
};

export default {
  API_BASE_URL,
  SOCKET_URL,
  SOCKET_EVENTS,
  POLL_CONFIG,
  UI_STATES,
  STUDENT_STATES,
  TEACHER_STATES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  CHART_COLORS,
  VALIDATION_PATTERNS,
  ANIMATIONS,
  BREAKPOINTS,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  TIMEOUTS,
  CONNECTION_CONFIG,
};
