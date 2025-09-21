import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth headers if needed
    const teacherKey = localStorage.getItem("teacher_key");
    if (teacherKey) {
      config.headers.Authorization = `Bearer ${teacherKey}`;
    }

    // Add socket ID for student requests
    const socketId = localStorage.getItem("socket_id");
    if (socketId) {
      config.headers["socket-id"] = socketId;
    }

    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.response?.status,
      error.response?.data || error.message
    );

    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or clear auth
      localStorage.removeItem("teacher_key");
    }

    if (error.response?.status >= 500) {
      // Server error - show generic error message
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

// API service class
class ApiService {
  // Generic request method
  async request(method, url, data = null, config = {}) {
    try {
      const response = await api({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // GET request
  async get(url, config = {}) {
    return this.request("GET", url, null, config);
  }

  // POST request
  async post(url, data, config = {}) {
    return this.request("POST", url, data, config);
  }

  // PUT request
  async put(url, data, config = {}) {
    return this.request("PUT", url, data, config);
  }

  // PATCH request
  async patch(url, data, config = {}) {
    return this.request("PATCH", url, data, config);
  }

  // DELETE request
  async delete(url, config = {}) {
    return this.request("DELETE", url, null, config);
  }

  // Poll API methods
  async createPoll(pollData) {
    return this.post("/api/polls", pollData);
  }

  async getCurrentPoll() {
    return this.get("/api/polls/current");
  }

  async submitAnswer(answerData) {
    return this.post("/api/polls/answer", answerData);
  }

  async getPollResults(pollId) {
    return this.get(`/api/polls/${pollId}/results`);
  }

  async endPoll() {
    return this.post("/api/polls/end");
  }

  // Student API methods
  async registerStudent(studentData) {
    return this.post("/api/students/register", studentData);
  }

  async getConnectedStudents() {
    return this.get("/api/students");
  }

  async getStudentBySocket(socketId) {
    return this.get(`/api/students/socket/${socketId}`);
  }

  async removeStudent(studentId) {
    return this.delete(`/api/students/${studentId}`);
  }

  async updateConnectionStatus(socketId, isConnected) {
    return this.patch(`/api/students/${socketId}/connection`, { isConnected });
  }

  // History API methods
  async getPollHistory(page = 1, limit = 10) {
    return this.get("/api/history", {
      params: { page, limit },
    });
  }

  async getPollById(pollId) {
    return this.get(`/api/history/${pollId}`);
  }

  async deletePollHistory(pollId) {
    return this.delete(`/api/history/${pollId}`);
  }

  async getPollStatistics() {
    return this.get("/api/history/stats/overview");
  }

  // Health check
  async healthCheck() {
    return this.get("/health");
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return new Error(data.error || "Bad request");
        case 401:
          return new Error("Unauthorized access");
        case 403:
          return new Error("Forbidden");
        case 404:
          return new Error("Resource not found");
        case 409:
          return new Error(data.error || "Conflict");
        case 422:
          return new Error(data.error || "Validation failed");
        case 429:
          return new Error("Too many requests. Please try again later.");
        case 500:
          return new Error("Internal server error");
        case 502:
          return new Error("Bad gateway");
        case 503:
          return new Error("Service unavailable");
        default:
          return new Error(data.error || `HTTP ${status} error`);
      }
    } else if (error.request) {
      // Network error
      return new Error("Network error. Please check your connection.");
    } else {
      // Other error
      return new Error(error.message || "An unexpected error occurred");
    }
  }

  // Helper method to set auth token
  setAuthToken(token) {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("teacher_key", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("teacher_key");
    }
  }

  // Helper method to set socket ID
  setSocketId(socketId) {
    if (socketId) {
      api.defaults.headers.common["socket-id"] = socketId;
      localStorage.setItem("socket_id", socketId);
    } else {
      delete api.defaults.headers.common["socket-id"];
      localStorage.removeItem("socket_id");
    }
  }

  // Upload file (for future use)
  async uploadFile(file, url = "/api/upload") {
    const formData = new FormData();
    formData.append("file", file);

    return this.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Download file (for future use)
  async downloadFile(url, filename) {
    try {
      const response = await api({
        method: "GET",
        url,
        responseType: "blob",
      });

      // Create download link
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;
