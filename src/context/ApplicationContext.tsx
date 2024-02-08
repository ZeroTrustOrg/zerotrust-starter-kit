import { ReactNode, createContext, useEffect, useState } from "react";
import { PimlicoBundlerClient,  createPimlicoBundlerClient} from "permissionless/clients/pimlico";
import { Chain, createPublicClient, http, PublicClient, Transport } from "viem";
import { PimlicoPaymasterV1Client, createPimlicoPaymasterV1Client } from "../actions/PimlicoPaymasterV1Client.ts";
import appConfig from '../../app.config.ts'

type ApplicationContextType = {
  appSubDomainClient:PublicClient<Transport,Chain> | undefined
  ethereumClient:PublicClient<Transport,Chain> | undefined
  bundlerClient:PimlicoBundlerClient | undefined
  paymasterClient:PimlicoPaymasterV1Client | undefined
}

// Provider Props Type
interface ApplicationContextProviderProps {
  children: ReactNode;
}

export const ApplicationContext = createContext<ApplicationContextType>({
  appSubDomainClient:undefined,
  ethereumClient:undefined,
  bundlerClient:undefined,
  paymasterClient:undefined,
});

// Provider
export const ApplicationContextProvider: React.FC<ApplicationContextProviderProps> = ({
  children,
}) => {
  const [subDomainClient, setSubDomainClient] = useState<PublicClient<Transport,Chain>>()
  const [ethereumClient, setEthereumClient] = useState<PublicClient<Transport,Chain>>()
  const [bundlerClient, setBundlerClient] = useState<PimlicoBundlerClient>()
  const [paymasterClient, setPaymasterClient] = useState<PimlicoPaymasterV1Client>()

  
  useEffect(() => {
    const setClientsData = async () => {
      const ethereumClient = createPublicClient({ 
        chain: appConfig.targetNetworks[0],
        transport: http(appConfig.ethereumProviderRpc)
      })

      const appSubDomainClient = createPublicClient({ 
        chain: appConfig.appSubDomainChain,
        transport: http(appConfig.ethereumProviderRpc)
      })
      // const _chain = "sepolia"; // 'base-goerli'
      // const apiKey = process.env.PIMLICO_API_KEY;
      // const pimlicoPaymasterEndpoint = `https://api.pimlico.io/v1/${_chain}/rpc?apikey=${apiKey}`;
      // const bundlerEndpoint = `https://api.pimlico.io/v1/${_chain}/rpc?apikey=${apiKey}`;
      

      const bundlerClient = createPimlicoBundlerClient({ 
        chain: appConfig.targetNetworks[0], 
        transport: http(appConfig.bundlerRpc)
      })

      const pimlicoPaymasterClient = createPimlicoPaymasterV1Client({
        chain: appConfig.targetNetworks[0],
        transport: http(appConfig.paymasterRpc)
      })

      
      setSubDomainClient(appSubDomainClient);
      setEthereumClient(ethereumClient);
      setBundlerClient(bundlerClient);
      setPaymasterClient(pimlicoPaymasterClient);
    };
    
    setClientsData();
  }, []);
  

  const value = {
    appSubDomainClient:subDomainClient,
    ethereumClient,
    bundlerClient,
    paymasterClient,
  };

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
};
