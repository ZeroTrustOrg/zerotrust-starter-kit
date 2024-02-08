import appConfig from "../../app.config";
import { useApplicationContext } from "@/hooks/useApplicationContext";
import { Passkey, createSimplePasskeyAccount, createSimplePasskeyAccountValidator } from "@zero-trust-org/accounts";
import { ReactNode, createContext, useState } from "react";
import { hexToString } from "viem";
import { normalize } from "viem/ens";

// Context Type
type AccountContextType = {
  isAccountConnected: boolean;
  accountAddress: `0x${string}` | undefined;
  accountFactoryAddress: `0x${string}` | undefined;
  entryPointAddress: `0x${string}` | undefined;
  loginToAccount: (username:string) => Promise<void>;
  createAccount: (username:string) => Promise<void>;
  backUpAccount: (username:string) => Promise<void>;
  sendUserOperation: () => Promise<void>;
};

// Context
export const AccountContext = createContext<AccountContextType>({
  isAccountConnected:false,
  accountAddress: undefined,
  accountFactoryAddress: undefined,
  entryPointAddress: undefined,
  loginToAccount: async () => {},
  createAccount: async () => {},
  backUpAccount: async (  ) => {},
  sendUserOperation: async () => {},
});

// Provider Props Type
interface AccountContextProps {
  children: ReactNode;
}

// Provider
export const AccountContextProvider: React.FC<AccountContextProps> = ({
  children,
}) => {
  const {ethereumClient,appSubDomainClient} = useApplicationContext();
  const {appName,appSubDomain,accountConfig} = appConfig
  const {accountFactoryAddress,entryPointAddress} = accountConfig
  const [isAccountConnected,setAccountConnected] = useState<boolean>(false);
  const [accountAddress, setAccountAddress] = useState<`0x${string}`>();

  const isUsernameAvailable = async(_username:string) =>{
    console.log(_username)
    return true;
  }

 

  const createAccount = async (username:string) => {
    try{
      if(! await isUsernameAvailable(username)) throw new Error("Username not available.");
      const passkeyCredentialResponse = await Passkey.create({
        appName:appName,
        displayName:`${appName}-${username}`,
        name:`${appName}-${username}`,
        yubikeyOnly:false
      }); 
      const passkeyPublicKeyAsHexResponse = Passkey.getPublicKeyFromAttestationResponse(passkeyCredentialResponse.response);
      
      const simplePasskeyAccountValidator = await createSimplePasskeyAccountValidator({
        credentialId:passkeyCredentialResponse.publicKeyCredential.id,
        publicKey: passkeyPublicKeyAsHexResponse.publicKey
      });

      if(!ethereumClient) throw new Error("");
      
      const simplePasskeyAccountAccount = await createSimplePasskeyAccount(
        ethereumClient,
        {
          accountValidator:simplePasskeyAccountValidator,
          entryPoint: entryPointAddress,
          factoryAddress:accountFactoryAddress,
          index:0n
        })

        console.log(`AccountAddress : ${simplePasskeyAccountAccount.address}`)

    }catch(e){
      console.error(e)
    }
    setAccountAddress("0x")
  };

  const loginToAccount = async (username:string) =>{
    try{
      if(!appSubDomainClient)  throw new Error('SubDomainClient not configured');
      const accountEnsAddress = await appSubDomainClient.getEnsAddress({
        name: normalize(`${username}.${appSubDomain}`),
      })
      const accountMetaDataRecord = await appSubDomainClient.getEnsText({
        name: normalize(`${username}.${appSubDomain}`),
        key: 'zeroTrustMetaData',
      })
      if(!accountMetaDataRecord) throw new Error(`User with ${username} not found.`);
      //Extracting the credentialId and other metadata
      const _accountFactoryAddress = `${accountMetaDataRecord.substring(0,42)}`; // Extract the account factory address
      const indexBytes = parseInt(accountMetaDataRecord.substring(42, 106), 16); // Extract the index bytes
      const publicKeyLength = parseInt(`${accountMetaDataRecord.substring(106, 170)}`,16); // Extract the pubKeyLength
      const publicKeyAsHex = `${accountMetaDataRecord.substring(170,170 + publicKeyLength)}`; // Extract the pubKey
      const credentialId = hexToString(`0x${accountMetaDataRecord.substring(170 + publicKeyLength)}`); // Extract the credentialId
      
      console.log([_accountFactoryAddress,indexBytes,publicKeyLength,publicKeyAsHex,credentialId])

      const userCredentials: PublicKeyCredentialDescriptor = {
        id: Passkey.parseBase64url(credentialId),
        type: 'public-key'
      };
      const {response} = await Passkey.get({allowCredentials:[]});
      const assertation = response;
      const publicKey = Passkey.hex2buf(publicKeyAsHex);
      const verificationData = await Passkey.verifySignature({
        publicKey,
        assertion :assertation,
      });
      console.log(`Login IsValid: ${verificationData.isValid}`);
    }catch(e){
      console.error(e);
    }

    setAccountConnected(true);
  }

  const backUpAccount = async (_username:string) => { console.log(_username)};
  const sendUserOperation = async () => {};

  return (
    <AccountContext.Provider
      value={{
        isAccountConnected,
        accountAddress,
        accountFactoryAddress,
        entryPointAddress,
        loginToAccount,
        createAccount,
        backUpAccount,
        sendUserOperation,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};