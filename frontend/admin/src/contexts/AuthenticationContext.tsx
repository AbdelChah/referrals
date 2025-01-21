import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  loginService,
  validateOtpService,
  logoutService,
  refreshTokenService,
} from "@services/authenticationService";
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from "@helpers/tokenHelper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface AuthenticationContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    username: string,
    password: string,
    onError?: (errorMessage: string) => void
  ) => Promise<void>;
  validateOtp: (otp: string) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
}

export const AuthenticationContext = createContext<
  AuthenticationContextProps | undefined
>(undefined);

interface AuthenticationProviderProps {
  children: ReactNode;
}

export const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state for authentication check
  const [authChecked, setAuthChecked] = useState<boolean>(false); // Flag to ensure effect runs only once
  const navigate = useNavigate();

  // Perform the authentication check only once on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
  
      if (accessToken && refreshToken) {
        try {
          await refreshAuthToken(); // Try refreshing the token
          setIsAuthenticated(true); // Ensure user is authenticated
        } catch (error) {
          console.error("Error during token validation:", error);
          logout();
        }
      }
      setAuthChecked(true); // Mark authentication check as complete
      setLoading(false); // Stop loading
    };
  
    if (!authChecked) {
      initializeAuth();  // Run the authentication check once
    }
  }, [authChecked]);  // Ensure it runs only once
  

  const login = async (
    username: string,
    password: string,
    onError?: (errorMessage: string) => void
  ): Promise<void> => {
    setLoading(true);
    try {
      const response = await loginService({ username, password });
      if (response.res) {
        const otp = response.response?.data?.otp;
        const otpExpirationMinutes =
          response.response?.data?.otpExpirationMinutes;

        if (otp) {
          navigator.clipboard.writeText(otp);
          toast.info(
            `OTP generated: ${otp}. It has been copied to your clipboard. Expiry: ${otpExpirationMinutes} minutes.`,
            {
              position: "top-right",
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: true,
              progress: undefined,
              autoClose: 120000,
            }
          );
          sessionStorage.setItem("tempUsername", username);
          navigate("/verify-otp");
        }
      } else {
        const errorMsg =
          response.responseError?.msgAPI ||
          "Login failed: Invalid credentials.";
        onError?.(errorMsg); // Call the error handler if provided
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMsg = error.message || "An unexpected error occurred.";
      onError?.(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    const refreshToken = getRefreshToken();
  
    if (refreshToken) {
      try {
        const response = await logoutService(refreshToken);
        if (response.res) {
          clearTokens();
          setIsAuthenticated(false);
          sessionStorage.removeItem("tempUsername");
          toast.info("You have been logged out.", {
            hideProgressBar: true
          });
        } else {
          toast.error("Logout failed.");
        }
      } catch (error) {
        console.error("Logout error:", error);
        clearTokens();
        setIsAuthenticated(false);
        sessionStorage.removeItem("tempUsername");
        toast.info("No refresh token found, logged out.");
      }
    } else {
      clearTokens();
      setIsAuthenticated(false);
      sessionStorage.removeItem("tempUsername");
      toast.info("No refresh token found, logged out.");
    }
  };
  

  const validateOtp = async (otp: string): Promise<void> => {
    const tempUsername = sessionStorage.getItem("tempUsername");

    if (!tempUsername) {
      toast.error("Username not found for OTP validation.");
      return;
    }

    setLoading(true);
    try {
      const response = await validateOtpService({
        username: tempUsername,
        otp,
      });

      if (response.res && response.response?.data) {
        const { accessToken, refreshToken } = response.response.data;
        saveTokens(accessToken, refreshToken);
        setIsAuthenticated(true);
        sessionStorage.removeItem("tempUsername");
        navigate("/dashboard");
      } else {
        const errorMsg =
          response.responseError?.msgAPI || "OTP validation failed.";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("OTP validation error:", error);
      toast.error("An error occurred during OTP validation.");
    } finally {
      setLoading(false);
    }
  };


  const refreshAuthToken = async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      logout(); // Log out if no refresh token is found
      return;
    }
  
    try {
      const response = await refreshTokenService(refreshToken);
  
      if (response.res && response.response?.data) {
        const newAccessToken = response.response?.data.accessToken;
        const newRefreshToken = response.response?.data.refreshToken;

        if (newAccessToken) {
          saveTokens(newAccessToken, newRefreshToken || refreshToken); // Save the new access token and refresh token (if returned)
          setIsAuthenticated(true); // Mark the user as authenticated
        } else {
          logout(); // Log out if no valid access token is returned
        }
      } else {
        logout(); // Log out if the API response is invalid
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logout(); // Log out if token refresh fails
    }
  };
  

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        validateOtp,
        logout,
        refreshAuthToken,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
