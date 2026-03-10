import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api"
});

// INTERCEPTOR: Prevent UI crash if backend or MongoDB goes down during demo
api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error intercepted. Backend might be down:", error.message);
    return Promise.resolve({ data: {} });
  }
);

export default api;