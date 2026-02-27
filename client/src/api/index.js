import axios from "axios";
import { getCookie } from "../components/utils/services";

// Use relative base URL in dev so Vite proxy handles CORS
const baseURL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token interceptor
api.interceptors.request.use(
  (config) => {
    const acc_token = getCookie("acc_token");
    if (acc_token) {
      config.headers.Authorization = `Bearer ${acc_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --------- Auth Services ---------
const authServices = {
  login: async (logData) => {
    try {
      const res = await api.post("/auth/login", logData);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },
  registration: async (registerData) => {
    try {
      const res = await api.post("/auth/registration", registerData);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },
  getProfile: async () => {
    try {
      const res = await api.get("/auth/getProfile");
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },
};

// --------- URL Shortener Services ---------
const urlServices = {
  createShort: async (urlLong) => {
    try {
      const res = await api.post("/shorturl/create", { urlLong });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },
  getAll: async () => {
    try {
      const res = await api.get("/shorturl/getall");
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },
  deleteShort: async (id) => {
    try {
      const res = await api.delete(`/shorturl/delete/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },
};

export { authServices, urlServices };
