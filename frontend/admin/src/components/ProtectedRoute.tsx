import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthenticationContext } from "@contexts/AuthenticationContext"; // Adjust import as needed
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthenticationContext) || {};
  const [redirect, setRedirect] = useState<boolean>(false);

  useEffect(() => {
    // If authentication state is loaded and the user is not authenticated
    if (isAuthenticated === false && !loading) {
      // Show a toast and set redirect to true
      toast.error("You must be logged in to access this page.", {
        position: "top-right",
        autoClose: 5000, // Adjust auto close time as needed
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setRedirect(true);
    }
  }, [isAuthenticated, loading]);

  // If loading is true, don't render anything yet
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated and the redirect flag is set, redirect to login
  if (redirect) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render protected content
  return children;
};

export default ProtectedRoute;
