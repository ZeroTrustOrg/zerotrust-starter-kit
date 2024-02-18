import { Passkey, PasskeyToSimplePasskeyAccountParameters, SimplePasskeyAccount, passkeyToSimplePasskeyAccount } from "@zero-trust-org/accounts";
import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { Address, Hex } from "viem";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";
import { useAppConfig } from "@/hooks/useAppConfig";

const simplePasskeyAccountsStorageKey = "zeroTrust.simplePasskeyAccounts";
export type SimplePasskeyAccountsMetaInfo = {
  entryPoint: Address;
  factoryAddress: Address;
  index: number;
  publicKey: Hex;
  credentialId: string;
};

export type SimplePasskeyAccounts = {
  [name: string]: SimplePasskeyAccountsMetaInfo;
};
/**
 * If no accounts is found in localstorage, we will set it to empty object
 */
const newDefaultAccountsData = {};

export type AuthContextType = {
  account: SimplePasskeyAccount | undefined;
  loggedInUser:string
  // creates a new Simple Passkey Account
  createNewAccount: (username: string) => Promise<Address | undefined>;
  // check whether the username is available [for now it's checks the localStorage]
  isUsernameAvailableToRegister: (username: string) => boolean;

  login: (username: string) => Promise<Address | undefined>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [passkeyAccounts, setPasskeyAccounts] = useLocalStorage<SimplePasskeyAccounts>(
    simplePasskeyAccountsStorageKey,
    newDefaultAccountsData,
  );
  const [account, setAccount] = useState<SimplePasskeyAccount>();
  const [loggedInUser, setLoggedInUser] = useSessionStorage<string>("loggedInUser", "");
  const { appName, appConfig, getPublicClient } = useAppConfig();
  const { entryPointAddress, accountFactoryAddress } = appConfig;

  const isCreatingNewPasskeyAccountRef = useRef(false);
  const isGettingLoggedInUserAccountRef = useRef(false);

  const publicClient = getPublicClient();

  const isUsernameAvailableToRegister = (username: string): boolean => {
    return !(username in passkeyAccounts);
  };
  const createNewAccount = async (username: string) => {
    try {
      console.log("1. First Create Passkey with name provided.");
      console.log("2. Save the public information (metaInfo) of passkey on browser localStorage. ");
      console.log(
        "3. Generate counterfactual account address of simplePasskeyAccount for the created passkey using its public key and credentialId.",
      );
      if (publicClient && !isCreatingNewPasskeyAccountRef.current) {
        if (!(isUsernameAvailableToRegister(username))) throw new Error("Username not available.");
        isCreatingNewPasskeyAccountRef.current = true;
        const passkeyCredentialResponse = await Passkey.create({
          appName: appName,
          displayName: `${appName}-${username}`,
          name: `${appName}-${username}`,
          yubikeyOnly: false,
        });
        const passkeyPublicKeyAsHexResponse = Passkey.getPublicKeyFromAttestationResponse(
          passkeyCredentialResponse.response,
        );

        const passkeyToSimplePasskeyAccountParameters: PasskeyToSimplePasskeyAccountParameters = {
          credentialId: passkeyCredentialResponse.publicKeyCredential.id,
          publicKey: passkeyPublicKeyAsHexResponse.publicKey,
          entryPoint: entryPointAddress,
          factoryAddress: accountFactoryAddress,
          index: 0,
        };
        const simplePasskeyAccount = await passkeyToSimplePasskeyAccount(
          publicClient,
          passkeyToSimplePasskeyAccountParameters,
        );
        console.log(simplePasskeyAccount)
        setAccount(simplePasskeyAccount);

        const simplePasskeyAccountMetaInfo: SimplePasskeyAccountsMetaInfo = {
          credentialId: passkeyCredentialResponse.publicKeyCredential.id,
          publicKey: `0x${Passkey.buf2hex(passkeyPublicKeyAsHexResponse.publicKey)}`,
          entryPoint: entryPointAddress,
          factoryAddress: accountFactoryAddress,
          index: 0,
        };
        setPasskeyAccounts(previousAccounts => {
          isCreatingNewPasskeyAccountRef.current = false;
          return {
            ...previousAccounts,
            [username]: simplePasskeyAccountMetaInfo,
          };
        });
        return simplePasskeyAccount.address;
      }
    } catch (e) {
      isCreatingNewPasskeyAccountRef.current = false;
      throw e;
    }
  };

  const login = async (username: string) => {
    console.log("1. Check whether the username<=>passkeyMetaInfo mapping is available in localStorage.");
    console.log("2. Using the credentialId from the mapping prompt user to sign a random msg.");
    console.log("3. Verify the signature with the saved public key to authenticate user.");
    console.log("4. Set the isUserLoggedIn & account for the loggedIn user.");
    if (passkeyAccounts[username]) {
      const passkeyAccountMetaInfo = passkeyAccounts[username];
      const userCredentials: PublicKeyCredentialDescriptor = {
        id: Passkey.parseBase64url(passkeyAccountMetaInfo.credentialId),
        type: "public-key",
      };
      const publicKeyAsHexString = passkeyAccountMetaInfo.publicKey.substring(2);
      const passkeyCredentialResponse = await Passkey.get({ allowCredentials: [userCredentials] });
      const assertation = passkeyCredentialResponse.response;
      const publicKey = Passkey.hex2buf(publicKeyAsHexString);
      const verificationData = await Passkey.verifySignature({
        publicKey,
        assertion: assertation,
      });
      if (verificationData.isValid) {
        const passkeyToSimplePasskeyAccountParameters = {
          credentialId: passkeyAccounts[username].credentialId,
          publicKey: Passkey.hex2buf(passkeyAccounts[username].publicKey.substring(2)),
          entryPoint: entryPointAddress,
          factoryAddress: accountFactoryAddress,
          index: 0,
        };
        const simplePasskeyAccount = await passkeyToSimplePasskeyAccount(
          publicClient,
          passkeyToSimplePasskeyAccountParameters,
        );
        console.log(simplePasskeyAccount);
        setAccount(simplePasskeyAccount);
        setLoggedInUser(username);
        return simplePasskeyAccount.address;
      }
        throw Error("User login verification failed!");
    }
    throw Error("User not found");
  };

  async function getLoggedInUser() {
    console.log("getLoggedInUser");
    const passkeyToSimplePasskeyAccountParameters = {
      credentialId: passkeyAccounts[loggedInUser].credentialId,
      publicKey: Passkey.hex2buf(passkeyAccounts[loggedInUser].publicKey.substring(2)),
      entryPoint: entryPointAddress,
      factoryAddress: accountFactoryAddress,
      index: 0,
    };
    const simplePasskeyAccount = await passkeyToSimplePasskeyAccount(
      publicClient,
      passkeyToSimplePasskeyAccountParameters,
    );
    setAccount(simplePasskeyAccount);
  }

  useEffect(() => {
    
    if ( loggedInUser && account === undefined && passkeyAccounts[loggedInUser] && !isGettingLoggedInUserAccountRef.current) {
      console.log(loggedInUser)
      console.log(account)
      console.log(passkeyAccounts[loggedInUser])
      isGettingLoggedInUserAccountRef.current = true;
      getLoggedInUser();
    }
  });

  return (
    <AuthContext.Provider value={{ 
      account,
      loggedInUser,
      createNewAccount,
      isUsernameAvailableToRegister,
      login, }}>
      {children}
    </AuthContext.Provider>
  );
};