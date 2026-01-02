import axios from "axios";

// Base backend URL (NO /api here)
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// Debug: Log API URL in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 API_URL:', API_URL);
}

// Axios instance (adds /api ONCE)
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth header helper
const authHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Error helper
const errMsg = (err) =>
  err?.response?.data?.message ||
  err?.message ||
  "Request failed";

/* =========================
   AUTH / USERS
========================= */

export const signUp = (userData) =>
  api.post("/users/signup", userData);

export const signIn = (credentials) =>
  api.post("/users/login", credentials);

export const getMe = () =>
  api.get("/users/me", { headers: authHeaders() });

export const changePassword = (data) =>
  api.post("/users/change-password", data);

export const deleteAccount = (data) =>
  api.delete("/users/delete-account", {
    headers: authHeaders(),
    data,
  });

export const updateEmailVerified = (data) =>
  api.post("/users/update-email-verified", data);

export const getUsers = () =>
  api.get("/users");

/* =========================
   REPORTS
========================= */

export const submitReport = (formData) =>
  api.post("/reports", formData, {
    headers: authHeaders(),
  });

export default api;
