// AppConfigContext.tsx
import React, { createContext, useEffect, useState } from "react";
import { BundlerClient, createBundlerClient } from "permissionless";
import { Address, PublicClient, createPublicClient, http } from "viem";
import * as chains from "viem/chains";
import { PimlicoPaymasterV1Client, createPimlicoPaymasterV1Client } from "@/lib/PimlicoPaymasterV1Client";

export type ApplicationConfig = {
  entryPointAddress: Address;
  accountFactoryAddress: Address;
  publicClientRpc: string;
  bundlerClientRpc: string;
  pimlicoPaymasterV1ClientRpc: string;
};

export type GlobalConfig = {
  appName: string;
  targetChain: chains.Chain;
  configs: {
    [configName: string]: ApplicationConfig;
  };
  defaultConfig: string;
};

type AppConfigContextType = {
  appConfig: ApplicationConfig;
  appName: string;
  targetChain: chains.Chain;
  updateConfig: (configName: string, updatedConfig: Partial<ApplicationConfig>) => void;
  addConfig: (configName: string, newConfig: Partial<ApplicationConfig>) => void;
  removeConfig: (configName: string) => void;
  setDefaultConfig: (configName: string) => void;
  getPublicClient: () => PublicClient;
  getBundlerClient: () => BundlerClient;
  getPimlicoPaymasterV1Client: () => PimlicoPaymasterV1Client;
};

export const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export const AppConfigProvider: React.FC<{
  initialConfig: GlobalConfig;
  children: React.ReactNode;
}> = ({ initialConfig, children }) => {
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>(initialConfig);
  const [appConfig, setAppConfig] = useState<ApplicationConfig>(globalConfig.configs[globalConfig.defaultConfig]);

  const getPublicClient = (): PublicClient => {
    const publicClient: PublicClient = createPublicClient({
      chain: globalConfig.targetChain,
      transport: http(appConfig.publicClientRpc),
    });
    return publicClient;
  };

  const getBundlerClient = (): BundlerClient => {
    const bundlerClient = createBundlerClient({
      chain: globalConfig.targetChain,
      transport: http(appConfig.bundlerClientRpc),
    });
    return bundlerClient;
  };

  const getPimlicoPaymasterV1Client = (): PimlicoPaymasterV1Client => {
    const pimlicoV1PaymasterClient = createPimlicoPaymasterV1Client({
      chain: globalConfig.targetChain,
      transport: http(appConfig.pimlicoPaymasterV1ClientRpc),
    });
    return pimlicoV1PaymasterClient;
  };

  const updateConfig = (configName: string, updatedConfig: Partial<ApplicationConfig>) => {
    const updatedAppConfig = { ...globalConfig };
    updatedAppConfig.configs[configName] = { ...globalConfig.configs[configName], ...updatedConfig };
    setGlobalConfig(updatedAppConfig);
  };

  const addConfig = (configName: string, newConfig: Partial<ApplicationConfig>) => {
    const updatedAppConfig = { ...globalConfig };
    updatedAppConfig.configs[configName] = { ...globalConfig.configs[configName], ...newConfig };
    setGlobalConfig(updatedAppConfig);
  };

  const removeConfig = (configName: string) => {
    const updatedAppConfig = { ...globalConfig };
    delete updatedAppConfig.configs[configName];
    setGlobalConfig(updatedAppConfig);
  };

  const setDefaultConfig = (configName: string) => {
    const updatedAppConfig = { ...globalConfig };
    updatedAppConfig.defaultConfig = configName;
    setGlobalConfig(updatedAppConfig);
    setAppConfig(globalConfig.configs[configName]);
  };

  useEffect(() => {
    localStorage.setItem("globalConfig", JSON.stringify(globalConfig));
  }, [globalConfig]);

  return (
    <AppConfigContext.Provider
      value={{
        appName: globalConfig.appName,
        targetChain: globalConfig.targetChain,
        appConfig,
        updateConfig,
        addConfig,
        removeConfig,
        setDefaultConfig,
        getPublicClient,
        getBundlerClient,
        getPimlicoPaymasterV1Client,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};


