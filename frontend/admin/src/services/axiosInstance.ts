// src/services/api.ts
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../helpers/tokenHelper";
import { refreshTokenService } from "./authenticationService";
import { processQueue } from "../utils/processQueue";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Axios instance
const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    const excludedRoutes = [
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/verifyOTP",
      "/api/auth/logout",
    ];
    if (!excludedRoutes.includes(config.url!)) {
      if (config.url === "/api/auth/refresh") {
        console.log("in axios instance interseptor accesstoken", accessToken);
        config.data = { refreshToken };
      } else if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        const navigate = useNavigate();
        clearTokens();
        navigate("/login");
        return Promise.reject(error);
      }

      try {
        const response = await refreshTokenService(refreshToken);

        if (response.res && response.response?.data) {
          const { accessToken, refreshToken: newRefreshToken } =
            response.response.data;
          saveTokens(accessToken, newRefreshToken);
          processQueue(failedQueue, null, accessToken);
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } else {
          processQueue(failedQueue, error, null);
          throw new Error("Failed to refresh token.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          // Pass the message property of the Error object, which is a string
          processQueue(failedQueue, err.message, null);
        } else {
          // If it's not an instance of Error, convert err to a string
          processQueue(failedQueue, String(err), null);
        }
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
