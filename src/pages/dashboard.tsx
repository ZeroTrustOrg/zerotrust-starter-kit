import { CardContent, CardFooter, Card } from "@/components/ui/card";
import QrCodeModal from "@/components/receive-modal";
import SendTransactionModal from "@/components/send-modal";
const dashboard = () => {
  return (
    <main className="flex-1 flex flex-col items-center text-center min-h-[calc(100vh_-_theme(spacing.16))] gap-4 md:justify-center">
      <Card className="w-full max-w-sm mt-4 md:mt-0">
        <CardContent className="flex flex-col items-center gap-2 mt-4">
          <div className="text-3xl font-bold">$5,231.89</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Available balance
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            dylansz.eth
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <SendTransactionModal />
          <QrCodeModal />
        </CardFooter>
      </Card>
    </main>
  );
};

export default dashboard;
