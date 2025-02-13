import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthenticationContext } from "../contexts/AuthenticationContext";

const Header: React.FC = () => {
  const location = useLocation(); // Get the current path using useLocation hook
  const navigate = useNavigate(); // Using useNavigate from React Router v6

  const context = useContext(AuthenticationContext);
  const { isAuthenticated, logout } = context || {};

  // Map paths to titles
  const routeTitles: { [key: string]: string } = {
    "/dashboard": "Dashboard",
    "/campaigns": "Campaigns List",
    "/create-campaign": "Create Campaign",
    "/reports": "Referral Report",
    "/disputes": "Disputes",
    "/referrals": "Referral Status",
    "/settings": "Settings",
    "/admin-settings": "Admin Settings",
    "/reset-password": "Reset Password",
    "/verify-otp": "Verify OTP",
    "/recover-password": "Recover Password",
    "/login": "Login",
    "/404": "Page Not Found", // Default title for unknown routes
  };

  const pageTitle = routeTitles[location.pathname] || "Page Not Found";

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout?.();
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const handleHomeAction = () => {
    navigate("/campaigns");
  };

  return (
    <AppBar
      position="static"
      color="primary"
      style={{ height: "66px", boxShadow: "none" }}
    >
      <Toolbar style={{ maxWidth: "1198px", margin: "0 auto", width: "100%" }}>
        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
          {/* Display the page title */}
          <Box>{pageTitle}</Box>
        </Typography>

        {/* User Action (e.g., Login/Signup) */}
        <Button color="inherit" variant="outlined" onClick={handleAuthAction}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
