import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3003/api/dashboard",
});

export const getOverview = async () => {
  const response = await api.get("/overview");
  return response.data.data;
};

export const getAcademicPerformance = async () => {
  const response = await api.get("/academic/performance");
  return response.data.data;
};

export const getAttendanceTrend = async () => {
  const response = await api.get("/academic/attendance-trend");
  return response.data.data;
};

export const getLibraryUsage = async () => {
  const response = await api.get("/library/usage-by-type");
  return response.data.data;
};

export default api;