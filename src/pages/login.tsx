import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSimplePasskeyAccount } from "@/hooks/useSimplePasskeyAccount";


const Login: React.FC = () => {
  const [passkeyName, setPasskeyName] = useState<string>("");
  const { createNewAccount } = useSimplePasskeyAccount();

 const handleRegister = async () => {
  console.log("1. First Create Passkey with name provided.");
  console.log("2. Save the public information (metaInfo) of passkey on browser localStorage. ");
  console.log(
    "3. Generate counterfactual account address of simplePasskeyAccount for the created passkey using its public key and credentialId.",
  );
  const accountAddress = await createNewAccount(passkeyName);
  console.log(accountAddress);
 }

  return (
    <div>
      <h1>Register Page</h1>
      {/* ... other login form elements ... */}
      <input
        className="border-primary bg-base-100 text-base-content p-2 mr-2 w-full md:w-1/2 lg:w-1/3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
        type="text"
        value={passkeyName}
        placeholder="Passkey name"
        onChange={e => setPasskeyName(e.target.value)}
      />
      <Button
        onClick={() => {
          handleRegister();
        }}
      >
        Register
      </Button>
    </div>
  );
};

export default Login;
