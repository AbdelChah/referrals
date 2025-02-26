import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  getRefreshToken, clearTokens, saveTokens } from '../helpers/tokenHelper';
import api from '../services/axiosInstance';

const AuthenticationInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response, // Handle successful responses
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            try {
              // Call refresh endpoint to get new tokens
              const response = await api.post('/auth/refresh', { refreshToken });
              const { accessToken, refreshToken: newRefreshToken } = response.data;
              saveTokens(accessToken, newRefreshToken); // Save the new tokens
              error.config.headers['Authorization'] = `Bearer ${accessToken}`;
              return api(error.config); // Retry the failed request
            } catch (refreshError) {
              clearTokens(); // If refresh fails, clear tokens and redirect
              navigate("/login");
              return Promise.reject(refreshError);
            }
          } else {
            clearTokens();
            navigate("/login");
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptor when component unmounts
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return null; // No UI rendered, just intercepts API calls
};

export default AuthenticationInterceptor;
