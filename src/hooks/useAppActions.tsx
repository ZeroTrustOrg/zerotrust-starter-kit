// useAppAction.tsx
import { SimplePasskeyAccount } from "@zero-trust-org/accounts";
import { Address, Hex } from "viem";
import { useAppConfig } from "./useAppConfig";
import { GetUserOperationReceiptReturnType, UserOperation} from "permissionless";

type AppActionHookReturn = {
  sendEth: (account: SimplePasskeyAccount,  sendParameters: {to:Address, value:bigint, data:Hex} ) => Promise<`0x${string}` | null>;
};

export const useAppActions = (): AppActionHookReturn => {
  
  const {appConfig, getPublicClient, getBundlerClient, getPimlicoPaymasterV1Client, } = useAppConfig();
  const {entryPointAddress} = appConfig;
  const publicClient = getPublicClient();
  const bundlerClient = getBundlerClient();
  const pimlicoPaymasterV1Client = getPimlicoPaymasterV1Client()

  const sendEth = async (account: SimplePasskeyAccount , {to, value, data}: {to:Address, value:bigint, data:Hex}) => {
    const sendEthCalldata = await account.encodeCallData({
      to,
      value,
      data
    });

    const nonce = await account.getNonce();

    const userOperation: UserOperation= {
      callData: sendEthCalldata,
      initCode: nonce === BigInt(0) ? await account.getInitCode():'0x',
      sender: account.address,
      nonce : nonce,
      maxFeePerGas: BigInt(2000000),
      maxPriorityFeePerGas: BigInt(2000000),
      callGasLimit: BigInt(2000000),
      preVerificationGas: BigInt(2000000),
      verificationGasLimit: BigInt(2000000),
      paymasterAndData:'0x',
      signature: await account.getDummySignature()
    }

    console.log(userOperation)
    const gasPrices = await publicClient.getGasPrice();
    console.log(`Gas Price: ${gasPrices}`)
   
    userOperation.maxFeePerGas = gasPrices;
    userOperation.maxPriorityFeePerGas = gasPrices;
    
    const sponsorUserOperation = await pimlicoPaymasterV1Client.sponsorUserOperationV1({
      entryPoint:entryPointAddress,
      userOperation:userOperation
    })
    console.log(sponsorUserOperation)
    userOperation.paymasterAndData = sponsorUserOperation.paymasterAndData
    
    const signature =  await account.signUserOperation(userOperation);
    userOperation.signature = signature

    console.log(`Sending User Operation: ${userOperation}`)
    console.log(userOperation)
    const txHash = await bundlerClient.sendUserOperation({
      entryPoint:entryPointAddress,
      userOperation:userOperation
    })

    console.log(`UserOperation tx Hash: ${txHash}`)
    if (bundlerClient && txHash) {
      let userOpsReceipt: GetUserOperationReceiptReturnType | null;
      do {
        userOpsReceipt = await bundlerClient.getUserOperationReceipt({ hash: txHash });
        if (!userOpsReceipt) {
          console.log(`UserOperation Receipt: ${userOpsReceipt}`)
          await new Promise(resolve => setTimeout(resolve, 2000)); // Add a 2-second delay
        }else{
          console.log(userOpsReceipt);
          return userOpsReceipt.receipt.transactionHash;
        }
      } while (!userOpsReceipt);
    }
    return null;
  };

  return {
    sendEth
  };
};
