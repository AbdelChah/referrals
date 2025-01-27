import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  loginService,
  validateOtpService,
  logoutService,
  refreshTokenService,
} from "../services/authenticationService";
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from "../helpers/tokenHelper";
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
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state for authentication check
  const [authChecked, setAuthChecked] = useState<boolean>(false); // Flag to ensure effect runs only once
  const navigate = useNavigate();

  // Perform the authentication check only once on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
  
      // Only check authentication if access token or refresh token exists
      if (accessToken && refreshToken) {
        setIsAuthenticated(true); // Ensure user is authenticated
      } else {
        logout(); // Log out if no tokens exist
      }
  
      setAuthChecked(true); // Mark authentication check as complete
      setLoading(false); // Stop loading
    };
  
    if (!authChecked && !refreshing) {
      initializeAuth(); // Run the authentication check once
    }
  }, [authChecked, refreshing, setLoading, setAuthChecked, setIsAuthenticated]);  // Ensure it runs only once and respects the refreshing state
  
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
    console.log("in logout ")
    if (refreshToken) {
      try {
        const response = await logoutService(refreshToken);
        if (response.res) {
          clearTokens();
          setIsAuthenticated(false);
          sessionStorage.removeItem("tempUsername");
          toast.info("You have been logged out.", {
            hideProgressBar: true,
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

  

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        validateOtp,
        logout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
