// app/api/api.ts
import axios from "axios";

// Set base URL untuk API
const API_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api`;

// Fungsi untuk mendapatkan CSRF token
export const getCsrfToken = async () => {
  try {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`);
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (csrfToken) {
      localStorage.setItem("csrf_token", csrfToken);
    }
  } catch (error) {
    console.error("Gagal mendapatkan CSRF token:", error);
  }
};