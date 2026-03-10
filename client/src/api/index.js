import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "https://shortner-server.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use(
//   (config) => {
//     config.withCredentials = true;
//     return config;
//   },
//   (error) => Promise.reject(error),
// );
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authServices = {
  registration: async (registerData) => {
    const res = await api.post("/auth/registration", registerData);
    return res.data;
  },
  // login: async (logData) => {
  //   const res = await api.post("/auth/login", logData);
  //   return res.data;
  // },
  login: async (logData) => {
  const res = await api.post("/auth/login", logData);
  localStorage.setItem("token", res.data.token);
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
