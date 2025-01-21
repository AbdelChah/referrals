import React from "react";
import { useLocation } from "react-router-dom";
import SideMenu from "./SideMenu"; // Adjust the path as needed

const SideMenuWrapper: React.FC = () => {
  const location = useLocation();

  // Define routes where the Header should not appear
  const hideMenuRoutes = ["/login", "/signup", "/recover-password", "/verify-otp"];

  // Check if the current route is in the `hideHeaderRoutes` array
  const shouldHideMenu = hideMenuRoutes.includes(location.pathname);

  return !shouldHideMenu ? <SideMenu /> : null;
};

export default SideMenuWrapper;
