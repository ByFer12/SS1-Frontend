// src/api/axios.js (Versión Final y Definitiva)
import axios from "axios";

// Dejamos la base como '/api' y añadimos '/v1' en cada llamada,
// o lo ponemos aquí directamente para no repetirlo.
const api = axios.create({
  baseURL: "/api/v1", // <-- ¡MEJOR ASÍ!
  withCredentials: true,
});

export default api;