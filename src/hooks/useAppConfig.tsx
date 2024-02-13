import { AppConfigContext } from "@/context/AppConfigContext";
import { useContext } from "react";

export const useAppConfig = () => {
  const configContext = useContext(AppConfigContext);

  if (!configContext) {
    throw new Error("useAppConfig must be used within an AppConfigProvider");
  }

  return configContext;
};