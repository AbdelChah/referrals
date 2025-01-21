// useAuthContext.ts
import { useContext } from "react";
import { AuthenticationContext } from "@contexts/AuthenticationContext";

export const useAuthContext = () => {
  const context = useContext(AuthenticationContext);
  
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthenticationProvider");
  }

  return context;
};
