# zerotrust-starter-kit

This repository showcases a React-Vite project named ZeroTrust Starter Kit, illustrating the utilization of the `@zero-trust-org/accounts` [SDK](https://github.com/ZeroTrustOrg/sdk/blob/master/packages/accounts/README.md) for developing decentralized applications.

The [AuthContext.tsx](https://github.com/ZeroTrustOrg/zerotrust-starter-kit/blob/main/src/context/AuthContext.tsx) file contains the implementation details for creating/registering new passkey accounts and the login functionality to enable logging in with the created passkey account. 

The [useAppAction.txs](https://github.com/ZeroTrustOrg/zerotrust-starter-kit/blob/main/src/hooks/useAppActions.tsx) hook demonstrates how the SimplePasskeyAccount can be utilized to send native tokens using smart contract accounts.

Explore the sample project to understand how the `SimplePasskeyAccount` from the `@zero-trust-org/accounts` SDK can seamlessly integrate into your decentralized applications.