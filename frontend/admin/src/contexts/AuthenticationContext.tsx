import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  loginService,
  validateOtpService,
  logoutService,
} from "../services/authenticationService";
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from "../helpers/tokenHelper";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation(); // To check the current path

  const excludedRoutes = ["/recover-password", "/verify-otp", "/login"];

  // Check token and authentication status on initial load
  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    if (
      accessToken &&
      refreshToken &&
      accessToken !== "undefined" &&
      refreshToken !== "undefined"
    ) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (!excludedRoutes.includes(location.pathname)) {
        navigate("/login");
      }
    }

    setLoading(false);
  }, [navigate, location.pathname]);

  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await loginService({ username, password });
      if (response.res) {
          toast.info(
            `OTP sent to your email`,
            {
              position: "top-right",
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: true,
              progress: undefined,
              autoClose: 120000,
            }
          );
          sessionStorage.setItem("username", username);
          navigate("/verify-otp");
      } else {
        const errorMsg =
          response.responseError?.msg || "Login failed: Invalid credentials.";
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMsg = error.message || "An unexpected error occurred.";
      toast.error(errorMsg);
      return errorMsg;
    } finally {
      setLoading(false);
    }
  };

  const validateOtp = async (otp: string): Promise<void> => {
    const usernameFromSession = sessionStorage.getItem("username");
    if (!usernameFromSession) {
      toast.error("Username not found for OTP validation.");
      return;
    }

    setLoading(true);
    try {
      const response = await validateOtpService({
        username: usernameFromSession,
        otp,
      });

      if (response.res && response.response?.data) {
        const { accessToken, refreshToken } = response.response.data;
        saveTokens(accessToken, refreshToken);
        setIsAuthenticated(true);
        sessionStorage.setItem("username", usernameFromSession);
        toast.success("OTP verified successfully!");
        navigate("/dashboard");
      } else {
       throw new Error("OTP validation failed.");
      }
    } catch (error) {
      toast.error("OTP validation failed.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await logoutService(refreshToken);
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    clearTokens();
    setIsAuthenticated(false);
    sessionStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <AuthenticationContext.Provider
      value={{ isAuthenticated, loading, login, validateOtp, logout }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
