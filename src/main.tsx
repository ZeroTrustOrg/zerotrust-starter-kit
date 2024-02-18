import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import * as chains from 'viem/chains';
import App from './App.tsx';
import { AppConfigProvider } from './context/AppConfigContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { Toaster } from '@/components/ui/sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppConfigProvider
        initialConfig={{
          appName: 'ZTA-Demo',
          targetChain: chains.gnosisChiado,
          defaultConfig: 'zta_chiado',
          configs: {
            zta_chiado: {
              entryPointAddress: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
              //"0x91161e6d7E9B6eCDb488467A5bd8A526C5f75A33",
              accountFactoryAddress: '0xEA68b3eFbBf63BB837F36A90AA97Df27bBF9B864',
              publicClientRpc: chains.gnosisChiado.rpcUrls.public.http[0],
              bundlerClientRpc: process.env.BUNDLER_RPC_URL || '',
              pimlicoPaymasterV1ClientRpc: process.env.PIMLICO_PAYMASTER_V1_RPC_URL || '',
            },
          },
        }}
      >
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </AppConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
