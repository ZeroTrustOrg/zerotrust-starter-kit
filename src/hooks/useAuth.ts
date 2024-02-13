import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function useAuth ()  {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}