import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { LogoWrapper } from "./Header.styles";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../contexts/AuthenticationContext";

const Header: React.FC = () => {
  const theme = process.env.REACT_APP_THEME || "default";
  const logoSrc =
    theme === "bob"
      ? "/assets/images/bob-logo.png"
      : "/assets/images/juno_logo_horizontal.svg";

  const context = useContext(AuthenticationContext);
  const { isAuthenticated, logout } = context || {};

  const navigate = useNavigate(); // Using useNavigate from React Router v6

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout?.();
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const handlehomeAction = () => {
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
          <LogoWrapper>
            <img src={logoSrc} alt="Logo" style={{ height: "50px" }} />
          </LogoWrapper>
        </Typography>

        {/* Navigation Links */}
        <Box>
          <Button
            color="inherit"
            style={{ marginRight: "15px" }}
            onClick={handlehomeAction}
          >
            Home
          </Button>
        </Box>

        {/* User Action (e.g., Login/Signup) */}
        <Button color="inherit" variant="outlined" onClick={handleAuthAction}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
