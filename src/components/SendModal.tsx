import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { SendIcon } from "lucide-react";
import { useAppActions } from "@/hooks/useAppActions";
import { normalize } from "viem/ens";
import { getAddress, isAddress, parseEther } from "viem";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useAppConfig } from "@/hooks/useAppConfig";
import useAuth from "@/hooks/useAuth";

//import { parseEther } from "viem";
interface SendTransactionModalProps{
  availableBalance:string
}
const SendTransactionModal = ({availableBalance}:SendTransactionModalProps) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [addressOrEns, setAddressOrEns] = useState<string>("");
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [isValidAddressOrEns, setIsValidiAddressOrEns] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {getPublicClient} = useAppConfig();
  const {sendEth} = useAppActions();
  const {account} = useAuth();
  const publicClient = getPublicClient();

  const isValidAmount = parseEther(availableBalance) >= parseEther(amount);

  if(!account){
    return "Please login to send Eth";
  }

  const handleAddressOrEnsInputBlur = async () => {
    let isValid = false;
    let _resolvedAddress = null;
    if (addressOrEns.includes('.')) {
      _resolvedAddress = await resolveEnsToAddress(addressOrEns);
      isValid = _resolvedAddress ?  isAddress(_resolvedAddress) : false;
    } else {
      isValid = isAddress(addressOrEns);
      _resolvedAddress = addressOrEns;
    }
    isValid && _resolvedAddress && setResolvedAddress(_resolvedAddress);
    setIsValidiAddressOrEns(isValid);
  };

  const resolveEnsToAddress = async (ensName:string) => {
    return await publicClient.getEnsAddress({
      name: normalize(ensName),
    })
  };
  // Add a submit handler if needed
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to handle form submission
    setIsLoading(true);

    try {
      let toAddress;
      if(isValidAddressOrEns){
        // not a valid address, it might be a ens name
        toAddress = resolvedAddress
        if(toAddress === null) return ;
        console.log(toAddress)
        sendEth(account,{
          to: getAddress(toAddress),
          value: parseEther(amount),
          data:"0x"
        })
        setAmount("");
        setAddressOrEns("");
      }
    } catch (error) {
      // Handle any errors here
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="flex-1"
            variant="default"
            onClick={() => setOpen(true)}
          >
            <SendIcon className="mr-2" /> Send
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send ETH/ Matic</DialogTitle>
            <DialogDescription>
              Input the address and amount you want and send a sponsored tx!
            </DialogDescription>
          </DialogHeader>
          <TransactionForm 
          className="px-4" 
          handleSubmit={handleSubmit}
          setAddressOrEns={setAddressOrEns}
          setAmount={setAmount}
          handleAddressOrEnsInputBlur={handleAddressOrEnsInputBlur} 
          isValidAddressOrEns={isValidAddressOrEns} 
          isLoading={isLoading} 
          addressOrEns={addressOrEns} 
          resolvedAddress={resolvedAddress} 
          amount={amount}
          availableBalance={availableBalance}
          isValidAmount={isValidAmount}
        />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="flex-1" onClick={() => setOpen(true)}>
          <SendIcon className="mr-2" /> Send
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Send ETH/ Matic</DrawerTitle>
          <DrawerDescription>
            Input the address and amount you want and send a sponsored tx!
          </DrawerDescription>
        </DrawerHeader>
        <TransactionForm 
          className="px-4" 
          handleSubmit={handleSubmit}
          setAddressOrEns={setAddressOrEns}
          setAmount={setAmount}
          handleAddressOrEnsInputBlur={handleAddressOrEnsInputBlur} 
          isValidAddressOrEns={isValidAddressOrEns} 
          isLoading={isLoading} 
          addressOrEns={addressOrEns} 
          resolvedAddress={resolvedAddress} 
          amount={amount}
          availableBalance={availableBalance}
          isValidAmount={isValidAmount}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

interface TransactionFormProps extends React.ComponentProps<"form">{
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setAddressOrEns: (addressOrEns:string) => void
  setAmount : (ammount:string) => void
  handleAddressOrEnsInputBlur: () => void
  isValidAddressOrEns:boolean
  isLoading:boolean
  addressOrEns:string
  resolvedAddress:string
  amount:string
  isValidAmount:boolean
  availableBalance:string
}
function TransactionForm({ className, addressOrEns, amount, 
 isLoading,isValidAddressOrEns,resolvedAddress,availableBalance,isValidAmount,
 handleAddressOrEnsInputBlur, handleSubmit,setAddressOrEns,setAmount}: TransactionFormProps) {
  return (
    <form
      className={cn("grid items-start gap-4", className)}
      onSubmit={handleSubmit}
    >
      <div className="mb-5">
        <label
          htmlFor="address"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Address or ENS
        </label>
        <div className="relative">
          <input
            type="text" 
            value={addressOrEns}
            onChange={e => setAddressOrEns(e.target.value)}
            onBlur={handleAddressOrEnsInputBlur}
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${isValidAddressOrEns ? 'pr-10' : ''}`}
            required
          />
          {isValidAddressOrEns && (
            <svg className="absolute inset-y-0 right-0 m-3 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <title>Valid</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className="text-xs">
          {isValidAddressOrEns && addressOrEns.includes(".") 
          ? resolvedAddress
          :"Enter valid address or Ens."}
        </span>
          
      </div>
      <div className="mb-5">
        <label
          htmlFor="amount"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Amount
        </label>
        <input
          type="text" // Changed from password to text
          id="amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
        <span className="text-xs">{!isValidAmount && amount.length > 0 ? "Invalid Amount" : "Enter a valid amount."}</span>
      </div>
      <label
        htmlFor="balance"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Available Balance: {availableBalance}
      </label>
      <div className="flex items-center justify-center mb-5 w-full">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <Button disabled={!(isValidAddressOrEns && isValidAmount)} type="submit" className="w-full">
            Send
          </Button>
        )}
      </div>
    </form>
  );
}

export default SendTransactionModal;
