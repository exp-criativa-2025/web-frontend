import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const LARAVEL_URL = "http://localhost";

export const getAvatarUrl = (avatarPath: string) => {
  console.log("From getAvatar: " + avatarPath)
  if (!avatarPath) {
    return null;
  }

  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }

  return `${LARAVEL_URL}${avatarPath}`;
};

export default api;