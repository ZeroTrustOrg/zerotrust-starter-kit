import { ApplicationContext } from "@/context/ApplicationContext";
import { useContext } from "react";

// Hook
export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplicationContext must be used within a ApplicationContext");
  }
  return context;
};