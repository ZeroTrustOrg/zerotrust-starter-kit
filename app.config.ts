import { Address, getAddress } from 'viem';
import * as chains from 'viem/chains';

export type AccountConfig = {
  accountFactoryAddress: Address;
  entryPointAddress: Address;
};

export type AppConfig = {
  appName: string;
  appSubDomain: string;
  appSubDomainChain: chains.Chain;
  appSubDomainProviderRpc: string;
  targetNetworks: readonly chains.Chain[];
  ethereumProviderRpc: string;
  bundlerRpc: string;
  paymasterRpc: string;
  accountConfig: AccountConfig;
};

const appConfig: AppConfig = {
  appName: 'ZTA-boilerplate',
  appSubDomain: '0trust.eth',
  appSubDomainChain: chains.sepolia,
  appSubDomainProviderRpc: process.env.ETHEREUM_RPC || '',
  // The networks on which your DApp is live
  targetNetworks: [chains.gnosisChiado],
  ethereumProviderRpc: process.env.ETHEREUM_RPC || '',
  paymasterRpc: process.env.ETHEREUM_RPC || '',
  bundlerRpc: process.env.ETHEREUM_RPC || '',
  accountConfig: {
    accountFactoryAddress: getAddress(
      process.env.ACCOUNT_FACTORY_ADDRESS || '0x505014cb8f88d950cd8737042f9f78052fdea101',
    ),
    entryPointAddress: getAddress(process.env.ENTRYPOINT_ADDRESS || '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'),
  },
} as const satisfies AppConfig;

export default appConfig;
