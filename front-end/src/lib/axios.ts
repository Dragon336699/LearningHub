import axios from "axios";
import { store } from "../store";
import { logoutUser } from "../store/thunks/authThunks";
import { URL_ROUTES } from "../configs/url_routes";

export const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export const http = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  withCredentials: true, 
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      
      localStorage.removeItem("user");
      store.dispatch(logoutUser());
      window.location.href = URL_ROUTES.LOGIN;
    }

    const customErrors = error.response?.data?.errors;
    console.log(customErrors)
    
    let errorMessage;

    if (Array.isArray(customErrors) && customErrors.length > 0) {
      errorMessage = customErrors[0]; 
    } else if (error.message) {
      errorMessage = error.message; 
    }

    console.log(errorMessage)
    return Promise.reject(errorMessage);
  }
);