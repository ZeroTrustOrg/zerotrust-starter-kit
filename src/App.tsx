import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import Header from "./components/Header";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";

const routes = [
  { path: "/", element: <Dashboard /> },
  {
    path: "/settings",
    element: <Settings />,
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
