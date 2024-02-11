import { useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Address, Hex } from "viem";
import {Passkey, SimplePasskeyAccount,PasskeyToSimplePasskeyAccountParameters,passkeyToSimplePasskeyAccount} from "@zero-trust-org/accounts"
import { useAppConfig } from "@/context/AppConfigContext";

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

type UseSimplePasskeyAccountResult = {
  account: SimplePasskeyAccount | undefined;
  // creates a new Simple Passkey Account
  createNewAccount: (username: string) => Promise<Address | undefined>;
};

/**
 * Creates a new simple passkey account
 */
export const useSimplePasskeyAccount = (): UseSimplePasskeyAccountResult => {
  const [account, setAccount] = useState<SimplePasskeyAccount>();
  const [passkeyAccounts, setPasskeyAccounts] = useLocalStorage<SimplePasskeyAccounts>(
    simplePasskeyAccountsStorageKey,
    newDefaultAccountsData,
  );
  const { appName, appConfig, getPublicClient } = useAppConfig();
  const isCreatingNewPasskeyAccountRef = useRef(false);
  const publicClient = getPublicClient();
  const { entryPointAddress, accountFactoryAddress } = appConfig;

  const isUsernameAvailable = async (username: string): Promise<boolean> => {
    return !(username in passkeyAccounts);
  };

  const createNewAccount = async (username: string) => {
    try {
      if (publicClient && !isCreatingNewPasskeyAccountRef.current) {
        if (!(await isUsernameAvailable(username))) throw new Error("Username not available.");
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
        const simplePasskeyAccountAccount = await passkeyToSimplePasskeyAccount(
          publicClient,
          passkeyToSimplePasskeyAccountParameters,
        );
        setAccount(simplePasskeyAccountAccount);

        const simplePasskeyAccountMetaInfo: SimplePasskeyAccountsMetaInfo = {
          credentialId: passkeyCredentialResponse.publicKeyCredential.id,
          publicKey: `0x${Passkey.buf2hex(passkeyPublicKeyAsHexResponse.publicKey)}`,
          entryPoint: entryPointAddress,
          factoryAddress: accountFactoryAddress,
          index: 0,
        };
        setPasskeyAccounts(previousAccounts => {
          console.log(`AccountAddress : ${simplePasskeyAccountAccount.address}`);
          isCreatingNewPasskeyAccountRef.current = false;
          return {
            ...previousAccounts,
            username: simplePasskeyAccountMetaInfo,
          };
        });
        return simplePasskeyAccountAccount.address;
      }
    } catch (e) {
      isCreatingNewPasskeyAccountRef.current = false;
      console.error(e);
    }
  };

  return {
    account,
    createNewAccount,
  };
};
