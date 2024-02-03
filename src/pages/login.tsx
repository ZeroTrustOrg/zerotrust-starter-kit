import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  create,
  createSimplePasskeyAccount,
  createSimplePasskeyAccountValidator,
} from "@zero-trust-org/accounts";
import { createPublicClient, http } from "viem";
import { gnosisChiado } from "viem/chains";
const Login: React.FC = () => {
  const ethereumClient = createPublicClient({
    chain: gnosisChiado,
    transport: http(),
  });
  const handleLogin = async () => {
    // Set a dummy session token in localStorage
    localStorage.setItem("authToken", "test");

    const passkeyCredentialResponse = await create({
      appName: "ZeroTrusStarterKit",
      name: "passkeyName",
      displayName: "passkeyName",
      yubikeyOnly: false,
    });

    const accountValidator = await createSimplePasskeyAccountValidator({
      publicKey: passkeyCredentialResponse.response?.getPublicKey(),
      credentialId: passkeyCredentialResponse.data?.id,
    });

    const simpleAccount = await createSimplePasskeyAccount(ethereumClient, {
      accountValidator: accountValidator,
      entryPoint: "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
      factoryAddress: "0x505014cb8f88d950cd8737042f9f78052fdea101",
      index: 0n,
    });

    console.log(simpleAccount.address);
    // const account = await createSimplePasskeyAccount(ethereumClient,{
    //   accountValidator:
    // } );

    ///  console.log(passkeyCredentialResponse.response?.getPublicKey());
  };

  return (
    <div>
      <h1>Login Page</h1>
      {/* ... other login form elements ... */}
      <Button
        onClick={() => {
          handleLogin();
        }}
      >
        Login
      </Button>
    </div>
  );
};

export default Login;
