import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 15000, // 15s for heavy AI ops
});

// INTERCEPTOR: Prevent UI crash if backend or MongoDB goes down during demo
api.interceptors.response.use(
  response => response,
  error => {
    console.error("Critical API Failure:", error.message);
    return Promise.reject(error); // Reject so .catch() blocks are triggered correctly
  }
);

export default api;