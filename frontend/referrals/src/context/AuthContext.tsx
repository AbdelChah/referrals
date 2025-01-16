import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../lib/apiClient";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  exp: number; // Expiration time in seconds
}

interface AuthContextProps {
  isAuthenticated: boolean;
  validateAuth: () => Promise<void>;
  logout: () => void;
  login: (token: string) => void; // Added login function
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validateAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        console.warn("Token has expired");
        logout();
        return;
      }

      const response = await apiClient.get("/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAuthenticated(response.data.valid);
    } catch (error) {
      console.error("Authentication validation failed", error);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true); // Set authentication state
  };

  useEffect(() => {
    validateAuth(); // Validate token on app initialization
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, validateAuth, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
