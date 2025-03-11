import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../helpers/tokenHelper";
import { refreshTokenService } from "./authenticationService";
import { processQueue } from "../utils/processQueue";

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
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}> = [];

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
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
        if (refreshToken && refreshToken !== "undefined") {
          config.data = { refreshToken };
        } else {
          clearTokens();
          return Promise.reject(new Error("Invalid refresh token"));
        }
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
    const excludedRoutes = [
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/verifyOTP",
      "/api/auth/logout",
    ];

    // ✅ Detect Token Expiration Properly
    const isAuthError =
      error.response &&
      (error.response.status === 401 || error.response.status === 403);


    if (isAuthError && excludedRoutes.includes(originalRequest.url)) {
      return Promise.reject(error);
    }
    if (isAuthError && !originalRequest._retry) {
      console.warn("⚠️ Access token expired. Trying to refresh...");

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken || refreshToken === "undefined") {
        console.error("🚫 No valid refresh token. Logging out...");
        processQueue(failedQueue, "No valid refresh token", null);
        clearTokens();
        return Promise.reject(error);
      }

      try {
        console.log("🔄 Calling refresh token API...");
        const response = await refreshTokenService(refreshToken);

        if (response.res && response.response?.data) {
          const { accessToken, refreshToken: newRefreshToken } =
            response.response.data;
          console.log("✅ Token refreshed successfully!");

          const finalRefreshToken =
            newRefreshToken && newRefreshToken !== "undefined"
              ? newRefreshToken
              : refreshToken;

          saveTokens(accessToken, finalRefreshToken);
          processQueue(failedQueue, null, accessToken);

          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          console.error("🚨 Failed to refresh token.");
          processQueue(failedQueue, "Failed to refresh token", null);
          throw new Error("Failed to refresh token.");
        }
      } catch (err) {
        console.error("❌ Refresh token request failed. Logging out...");
        processQueue(failedQueue, String(err), null);
        clearTokens();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
