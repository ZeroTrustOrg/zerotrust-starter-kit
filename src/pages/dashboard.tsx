import { useEffect, useState } from 'react';
import { CardContent, CardFooter, Card, CardTitle, CardDescription, CardHeader } from '@/components/ui/card';
import QrCodeModal from '@/components/ReceiveModal';
import SendTransactionModal from '@/components/SendModal';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { useAppConfig } from '@/hooks/useAppConfig';
import { formatEther } from 'viem';
import OnboardingModal from '@/components/OnboadingModal';

function Dashboard() {
  const { account, loggedInUser } = useAuth();
  const { getPublicClient, targetChain } = useAppConfig();
  const [action, setAction] = useState<'login' | 'register'>();
  const [balance, setBalance] = useState<string>('0');
  const publicClient = getPublicClient();
  const [isModelOpen,setIsModelOpen] = useState(false)

  useEffect(() => {
    if (account) {
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: account.address,
        });
        setBalance(formatEther(balance).toString());
      };
      fetchBalance();
    }
  }, [account, publicClient]);

  if (!loggedInUser) {
    return (
      <main className="flex-1 flex flex-col items-center text-center min-h-[calc(100vh-_theme(spacing.16))] gap-4 md:justify-center">
        <CardContent >
          <CardHeader>
            <CardTitle>ZeroTrust passkey wallet</CardTitle>
            <CardDescription>Get started by logging in or signing up.</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col items-center gap-4">
            <Button className="w-full" onClick={() => {setAction('login'); setIsModelOpen(true);}}>
              Login
            </Button>
            <Button className="w-full" onClick={() => {setAction('register'); setIsModelOpen(true);}}>
              Sign Up
            </Button>
          </CardFooter>
        </CardContent>
        {action && isModelOpen && <OnboardingModal onboardingAction={action} open={isModelOpen} onOpenChange={()=> setIsModelOpen(!isModelOpen)}/>}
      </main>
    );
  }

  if (loggedInUser) {
    return (
      <main className="flex-1 flex flex-col items-center text-center min-h-[calc(100vh-_theme(spacing.16))] gap-4 md:justify-center">
        <Card className="w-full max-w-sm mt-4 md:mt-0">
          <CardContent className="flex flex-col items-center gap-2 mt-4">
            <div className="text-3xl font-bold">{`${balance} ${targetChain.nativeCurrency.symbol}`} </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Available balance</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{loggedInUser}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{account?.address}</div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <SendTransactionModal availableBalance={balance} />
            <QrCodeModal />
          </CardFooter>
        </Card>
      </main>
    );
  }

}

export default Dashboard;
