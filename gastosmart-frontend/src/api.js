// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // definido en tu .env
});

// 👇 Interceptor: agrega el token en cada request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // el token se guarda en localStorage al hacer login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
