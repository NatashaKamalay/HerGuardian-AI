import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --------------------
// AUTH APIS
// --------------------
export const registerUser = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

// --------------------
// SAFE TRAVEL APIS
// --------------------
export const startTravel = async (payload) => {
  const response = await api.post("/travel/start", payload);
  return response.data;
};

export const updateTravelLocation = async (travelId, payload) => {
  const response = await api.post(`/travel/update/${travelId}`, payload);
  return response.data;
};

export const getTravelStatus = async (travelId) => {
  const response = await api.get(`/travel/${travelId}`);
  return response.data;
};

export const endTravel = async (travelId) => {
  const response = await api.post(`/travel/end/${travelId}`);
  return response.data;
};

export const sendEmergency = async (travelId, payload) => {
  const response = await api.post(`/travel/emergency/${travelId}`, payload);
  return response.data;
};

export const getTravels = async () => {
  const response = await api.get("/travel");
  return response.data;
};

// --------------------
// INCIDENTS / ALERTS
// --------------------
export const getIncidents = async () => {
  const response = await api.get("/incidents");
  return response.data;
};

export const getAlerts = async () => {
  const response = await api.get("/alerts");
  return response.data;
};

// --------------------
// HEALTH CHECK
// --------------------
export const checkBackend = async () => {
  const response = await api.get("/");
  return response.data;
};

export default api;