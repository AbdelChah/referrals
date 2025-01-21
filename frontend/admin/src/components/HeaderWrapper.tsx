import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header"; // Adjust the path as needed

const HeaderWrapper: React.FC = () => {
  const location = useLocation();

  // Define routes where the Header should not appear
  const hideHeaderRoutes =["/login", "/signup", "/recover-password", "/verify-otp"];

  // Check if the current route is in the `hideHeaderRoutes` array
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return !shouldHideHeader ? <Header /> : null;
};

export default HeaderWrapper;
