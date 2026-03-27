import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:1993",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    config.credentials = "include;
    return config;
  },
  (error) => Promise.reject(error),
);

const authServices = {
  registration: async (registerData) => {
    const res = await api.post("/auth/registration", registerData);
    return res.data;
  },
  login: async (logData) => {
    const res = await api.post("/auth/login", logData);
    return res.data;
  },
  logout: async () => {
    const res = await api.post("/auth/logout", {}, { withCredentials: true });
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get("/auth/getProfile", { withCredentials: true });
    return res.data;
  },
};

const urlServices = {
  createShort: async (urlLong) => {
    const res = await api.post("/shorturl/create", { urlLong });
    return res.data;
  },
  getAll: async () => {
    const res = await api.get("/shorturl/getall");
    return res.data;
  },
  deleteUrl: async (id) => {
    const res = await api.delete(`/shorturl/delete/${id}`);
    return res.data;
  },
};

export { authServices, urlServices };
