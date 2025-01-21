import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '../helpers/tokenHelper';

// Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    const excludedRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/verifyOTP'];

    if (!excludedRoutes.includes(config.url!)) {
      if (config.url === '/api/auth/refresh') {
        config.data = { refreshToken };
      } else if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
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

    if (error.response) {
      console.error(`Error: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      console.error("Network error. Please try again.");
    } else {
      console.error(`Error: ${error.message}`);
    }
    
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      console.log("Access token expired. Attempting to refresh...");
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await api.post('/api/auth/refresh', { refreshToken });
          const newAccessToken = response.data.accessToken;
          saveTokens(newAccessToken, refreshToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } else {
          clearTokens();
          return Promise.reject(error);
        }
      } catch (err) {
        clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
