import axios from "axios";

// Base backend URL (NO /api here)
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

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

// Error message helper
const errMsg = (err) =>
  err?.response?.data?.message ||
  err?.message ||
  "Request failed";

/* =========================
   AUTH / USERS
========================= */

// Sign up
export const signUp = async (userData) => {
  try {
    return await api.post("/users/signup", userData);
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

// Sign in
export const signIn = async (credentials) => {
  try {
    return await api.post("/users/login", credentials);
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

// Get logged-in user
export const getMe = async () => {
  try {
    const headers = authHeaders();
    if (!headers.Authorization) throw new Error("Not authenticated");

    return await api.get("/users/me", { headers });
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

// Change password
export const changePassword = async ({
  username,
  currentPassword,
  newPassword,
}) => {
  try {
    return await api.post("/users/change-password", {
      username,
      currentPassword,
      newPassword,
    });
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

// Delete account
export const deleteAccount = async ({ password, reason }) => {
  try {
    const headers = authHeaders();
    if (!headers.Authorization) throw new Error("Not authenticated");

    return await api.delete("/users/delete-account", {
      headers,
      data: { password, reason },
    });
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

// Update email verification
export const updateEmailVerified = async ({
  email,
  emailVerified,
}) => {
  try {
    return await api.post("/users/update-email-verified", {
      email,
      emailVerified,
    });
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

// Get all users (testing/admin)
export const getUsers = async () => {
  try {
    return await api.get("/users");
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

/* =========================
   REPORTS
========================= */

// Submit report (FormData)
export const submitReport = async (formData) => {
  try {
    const headers = authHeaders();
    // DO NOT set Content-Type for FormData
    return await api.post("/reports", formData, { headers });
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

export default api;
