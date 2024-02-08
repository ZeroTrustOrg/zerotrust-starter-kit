import { AccountContext } from "@/context/AccountContext";
import { useContext } from "react";

// Hook
export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within a AccountProvider");
  }
  return context;
};