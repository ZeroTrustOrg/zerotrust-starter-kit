import Layout from "@/components/layout";
import { Navigate } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
export default function privateRoutes() {
  return [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "dashboard", element: <Dashboard /> },
      ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ];
}
