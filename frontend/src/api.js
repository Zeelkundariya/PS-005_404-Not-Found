import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  timeout: 15000, // 15s for heavy AI ops
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INTERCEPTOR: Prevent UI crash if backend or MongoDB goes down during demo
api.interceptors.response.use(
  response => response,
  error => {
    console.error("Critical API Failure:", error.message);
    return Promise.reject(error); // Reject so .catch() blocks are triggered correctly
  }
);

export default api;