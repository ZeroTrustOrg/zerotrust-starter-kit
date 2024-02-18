import React, { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { SendIcon} from 'lucide-react';
// import { Camera} from 'lucide-react';
import { useAppActions } from '@/hooks/useAppActions';
import { normalize } from 'viem/ens';
import { getAddress, isAddress, parseEther } from 'viem';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useAppConfig } from '@/hooks/useAppConfig';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';

// import QrCodeReader, { QRCode } from 'react-qrcode-reader';

interface SendTransactionModalProps {
  availableBalance: string;
}
const SendTransactionModal = ({ availableBalance }: SendTransactionModalProps) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [addressOrEns, setAddressOrEns] = useState<string>('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [isValidAddressOrEns, setIsValidAddressOrEns] = useState(false);
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getPublicClient } = useAppConfig();
  const { sendEth } = useAppActions();
  const { account } = useAuth();
  const publicClient = getPublicClient();

  if (!account) {
    return 'Please login to send Eth';
  }

  const handleAddressOrEnsInputBlur = async () => {
    let isValid = false;
    let _resolvedAddress = null;
    if (addressOrEns.includes('.')) {
      _resolvedAddress = await resolveEnsToAddress(addressOrEns);
      isValid = _resolvedAddress ? isAddress(_resolvedAddress) : false;
    } else {
      isValid = isAddress(addressOrEns);
      _resolvedAddress = addressOrEns;
    }
    isValid && _resolvedAddress && setResolvedAddress(_resolvedAddress);
    setIsValidAddressOrEns(isValid);
  };

  const handleAmountInputBlur = async () => {
    setIsValidAmount(parseEther(availableBalance) >= parseEther(amount))
  };

  const resolveEnsToAddress = async (ensName: string) => {
    return await publicClient.getEnsAddress({
      name: normalize(ensName),
    });
  };
  // Add a submit handler if needed
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to handle form submission
    setIsLoading(true);
    try {
      let toAddress;
      if(isValidAddressOrEns){
        toAddress = resolvedAddress
        if(toAddress === null) return ;
        console.log(toAddress)
        const txHash = await sendEth(account,{
          to: getAddress(toAddress),
          value: parseEther(amount),
          data:"0x"
        })
        toast("Successfully submitted the transaction.")
        console.log(txHash)
        setAmount("");
        setAddressOrEns("");
        setIsValidAddressOrEns(false)
      }
    } catch (e) {
      console.error(e);
      if(e instanceof Error) toast(e.message);
      console.error(e);
    }finally{
      setIsLoading(false);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex-1" variant="default" onClick={() => setOpen(true)}>
            <SendIcon className="mr-2" /> Send
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send xDAI</DialogTitle>
            <DialogDescription>Input the address and amount you want and send a sponsored tx!</DialogDescription>
          </DialogHeader>
          <TransactionForm
            className="px-4"
            handleSubmit={handleSubmit}
            setAddressOrEns={setAddressOrEns}
            setAmount={setAmount}
            handleAddressOrEnsInputBlur={handleAddressOrEnsInputBlur}
            handleAmountInputBlur={handleAmountInputBlur}
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
          <DrawerTitle>Send xDAI</DrawerTitle>
          <DrawerDescription>Input the address and amount you want and send a sponsored tx!</DrawerDescription>
        </DrawerHeader>
        <TransactionForm
          className="px-4"
          handleSubmit={handleSubmit}
          setAddressOrEns={setAddressOrEns}
          setAmount={setAmount}
          handleAddressOrEnsInputBlur={handleAddressOrEnsInputBlur}
          handleAmountInputBlur={handleAmountInputBlur}
          isValidAddressOrEns={isValidAddressOrEns}
          isLoading={isLoading}
          addressOrEns={addressOrEns}
          resolvedAddress={resolvedAddress}
          amount={amount}
          availableBalance={availableBalance}
          isValidAmount={isValidAmount}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild />
          <Button variant="outline">Cancel</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

interface TransactionFormProps extends React.ComponentProps<'form'> {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setAddressOrEns: (addressOrEns: string) => void;
  setAmount: (ammount: string) => void;
  handleAddressOrEnsInputBlur: () => void;
  handleAmountInputBlur: () => void;
  isValidAddressOrEns: boolean;
  isLoading: boolean;
  addressOrEns: string;
  resolvedAddress: string;
  amount: string;
  isValidAmount: boolean;
  availableBalance: string;
}
function TransactionForm({
  className,
  addressOrEns,
  amount,
  isLoading,
  isValidAddressOrEns,
  resolvedAddress,
  availableBalance,
  isValidAmount,
  handleAddressOrEnsInputBlur,
  handleAmountInputBlur,
  handleSubmit,
  setAddressOrEns,
  setAmount,
}: TransactionFormProps) {

  // const handleRead = (code: QRCode) => {
  //   setAddressOrEns(code.data.toString());
  // };

  return (
    <form className={cn('grid items-start gap-4', className)} onSubmit={handleSubmit}>
      <div className="mb-5">
        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
          {isValidAddressOrEns && addressOrEns.includes('.') ? resolvedAddress : 'Enter valid address or Ens.'}
        </span>
      </div>
      <div className="mb-5">
        <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Amount
        </label>
        <input
          type="text" // Changed from password to text
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={handleAmountInputBlur}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
        <span className="text-xs">
          {!isValidAmount && amount.length > 0 ? 'Invalid Amount' : 'Enter a valid amount.'}
        </span>
      </div>
      <label htmlFor="balance" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Available Balance: {availableBalance}
      </label>
      <div className="flex items-center justify-center mb-5 w-full">
        <Button
          disabled={!(isValidAddressOrEns && isValidAmount) }
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Send
        </Button>
      </div>
    </form>
  );
}

export default SendTransactionModal;
