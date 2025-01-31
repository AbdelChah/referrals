import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthenticationContext) || {};
  const [redirect, setRedirect] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated === false && !loading) {
      toast.error("You must be logged in to access this page.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setRedirect(true);
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading indicator
  }

  // If the user is not authenticated and redirect flag is set, redirect to login
  if (redirect) {
    return <Navigate to="/login" />;
  }

  // Restrict access to /admin-settings for a specific user
  if (
    location.pathname === "/admin-settings" &&
    sessionStorage.getItem("username") !== "info@veriah.com"
  ) {
    toast.error("Access denied.");
    return <Navigate to="/dashboard" />;
  }

  return children; // If authenticated, render children
};

export default ProtectedRoute;
