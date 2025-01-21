import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer"; 

const FooterWrapper: React.FC = () => {
  const location = useLocation();

  // Define routes where the Header should not appear
  const hideFooterRoutes =["/login", "/signup", "/recover-password", "/verify-otp"];

  // Check if the current route is in the `hideHeaderRoutes` array
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return !shouldHideFooter ? <Footer /> : null;
};

export default FooterWrapper;
