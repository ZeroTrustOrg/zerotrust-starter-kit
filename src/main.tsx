import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

import "./app.css";
import {  ApplicationContextProvider } from "./context/ApplicationContext.tsx";
import {  AccountContextProvider } from "./context/AccountContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <ApplicationContextProvider>
      <AccountContextProvider>
        <App />
      </AccountContextProvider>
    </ApplicationContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
