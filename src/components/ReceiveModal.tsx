import * as React from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
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

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { QrCodeIcon, CopyIcon } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { QRCodeSVG } from "qrcode.react";

const QrCodeModal = () => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const triggerButton = (
    <Button className="flex-1" onClick={() => setOpen(true)}>
      <QrCodeIcon className="mr-2" /> Receive
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Receive Funds</DialogTitle>
            <DialogDescription>
              Only send funds to this address in the Deployed Network
            </DialogDescription>
          </DialogHeader>
          <QrCodeCard />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <QrCodeCard className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

// eslint-disable-next-line no-empty-pattern
function QrCodeCard({}: React.ComponentProps<"form">) {
  // Handle change in the address input
  const { account } = useAuth();

  if (!account) {
    return "Please login to your account.";
  }

  return (
    <Card>
      <CardContent>
        <QRCodeSVG className="w-full h-full mt-5" value={account.address} />
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center mb-5 w-full space-y-4">
        <span className="font-bold text-xs	">{account.address}</span>
        <span className="text-center"></span>
        <Button className="w-full mt-4">
          {" "}
          {/* You can adjust mt-4 to increase or decrease the space */}
          <CopyIcon /> Copy Address
        </Button>
      </CardFooter>
    </Card>
  );
}

export default QrCodeModal;
