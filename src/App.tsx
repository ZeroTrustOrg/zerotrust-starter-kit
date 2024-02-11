import Dashboard from "@/pages/dashboard";
import Settings from "@/pages/settings";
import SetUp from "@/pages/SetUp";
import Login from "@/pages/login";
import SignUp from "@/pages/signup";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Header from "./components/Header";

const routes = [
  { path: "/", element: <Dashboard /> },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/setup",
    element: <SetUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
];
function App() {
  const children = useRoutes(routes);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
      </div>
    </ThemeProvider>
  );
}

export default App;
