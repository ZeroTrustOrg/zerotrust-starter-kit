import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./app.css";
import * as chains from "viem/chains";
import App from "./App.tsx";
import { AppConfigProvider } from "./context/AppConfigContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppConfigProvider
        initialConfig={{
          appName: "ZTA-Demo",
          targetChain: chains.sepolia,
          defaultConfig: "zta_sepolia",
          configs: {
            zta_sepolia: {
              entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
              accountFactoryAddress://"0x91161e6d7E9B6eCDb488467A5bd8A526C5f75A33",
               "0x77bd052A8EA7baD2eC5c6E54572b1B92Eb5EF356",
              publicClientRpc: chains.sepolia.rpcUrls.public.http[0],
              bundlerClientRpc: process.env.BUNDLER_RPC_URL || "" ,
              pimlicoPaymasterV1ClientRpc: process.env.PIMLICO_PAYMASTER_V1_RPC_URL || "",
            },
          },
        }}
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
