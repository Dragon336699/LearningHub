import axios, { InternalAxiosRequestConfig } from "axios";

export const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  requireAuth?: boolean;
}

export const http = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
});

http.interceptors.request.use(
  (config) => {
    const customConfig = config as CustomRequestConfig;
    const requireAuth = customConfig.requireAuth ?? false; 

    if (requireAuth) {
      const token = localStorage.getItem("token"); 
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); 
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);