import axios from "axios";
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:8080",
  withCredentials: true,
});

export const logout = async () => {
  const response = await api.get("/auth/logout");
  return response.data;
};

// NEXT_PUBLIC_CLIENT_URL
