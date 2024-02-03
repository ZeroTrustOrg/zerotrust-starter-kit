import React from "react";
import { useRoutes } from "react-router-dom";
import PrivateRoute from "@/routes/privateRoutes";
import PublicRoute from "@/routes/publicRoutes";

const App: React.FC = () => {
  const isAuthenticated = (): boolean =>
    localStorage.getItem("authToken") != null;

  const routes = isAuthenticated() ? PrivateRoute() : PublicRoute();
  const routing = useRoutes(routes);

  return <>{routing}</>;
};

export default App;
