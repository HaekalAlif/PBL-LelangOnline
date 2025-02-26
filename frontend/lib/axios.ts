import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  // Get user ID from cookies for every request
  const userId = document.cookie
    .split("; ")
    .find((row) => row.startsWith("id="))
    ?.split("=")[1];

  if (userId) {
    config.headers["X-User-Id"] = userId;
  }

  return config;
});

export default axiosInstance;
