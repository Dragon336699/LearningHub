import axios from "axios";

export const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export const http = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000,
  // withCredentials: true, 
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);