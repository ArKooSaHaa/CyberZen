import axios from "axios";

// Allow an override stored in browser localStorage so deployed static sites
// (e.g. Vercel) can be pointed at the real backend without rebuilding.
const envBase = process.env.REACT_APP_API_BASE_URL;
let overrideBase = null;
if (typeof window !== "undefined") {
  overrideBase = localStorage.getItem("REACT_APP_API_BASE_URL_OVERRIDE");
}

const resolvedBase = (overrideBase && overrideBase.trim()) || (envBase && envBase.trim()) || "";
const API_BASE_URL = resolvedBase
  ? `${resolvedBase.replace(/\/+$/, "")}/api`
  : "/api"; // fallback to relative path if nothing is set

// axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Helpful debug log to confirm which base the app is using at runtime
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.info('[api] API_BASE_URL resolved to:', API_BASE_URL);
}

// fetch hoche
const authHeaders = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const errMsg = (err) =>
  err?.response?.data?.message || err?.message || "Request failed";


// Sign up -> post hoise
export const signUp = async (userData) => {
  try {
    const response = await api.post("/users/signup", userData);
    return response; // keep returning full axios response to match your usage: const { data } = await signUp(...)
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

// Sign in -> post hoche
export const signIn = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    return response; // const { data } = await signIn(...)
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

// Change password -> post hoche
export const changePassword = async ({ username, currentPassword, newPassword }) => {
  try {
    const response = await api.post(
      "/users/change-password",
      { username, currentPassword, newPassword }
    );
    return response; 
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

// fetch hoche  get er madhome
export const getMe = async () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const response = await api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response; 
};

// Delete request diche so that delete  the account 
export const deleteAccount = async ({ password, reason }) => {
  try {
    const headers = authHeaders();
    if (!headers.Authorization) throw new Error("Not authenticated");
    const response = await api.delete("/users/delete-account", {
      headers,
      data: { password, reason },  // body jache in config for DELETE
    });
    return response;
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

// Update email verification status in MongoDB
export const updateEmailVerified = async ({ email, emailVerified }) => {
  try {
    const response = await api.post("/users/update-email-verified", { email, emailVerified });
    return response;
  } catch (error) {
    throw new Error(errMsg(error));
  }
};


// Testing 
export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response;
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

export const submitReport = async (formData) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Do NOT set 'Content-Type' manually for FormData; the browser will set the correct
    // multipart boundary. Include auth header when available.
    const response = await api.post(`/reports`, formData, { headers });
    return response;
  } catch (error) {
    throw new Error(errMsg(error));
  }
};

export default api;
