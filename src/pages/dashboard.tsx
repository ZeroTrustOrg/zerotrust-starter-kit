import { CardContent, CardFooter, Card } from "@/components/ui/card";
import QrCodeModal from "@/components/ReceiveModal";
import SendTransactionModal from "@/components/SendModal";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog";
import { useState } from "react";

const Dashboard = () => {
  const [usernameInput, setUsernameInput] = useState<string>("");
  const { account, loggedInUser, login, createNewAccount } = useAuth();
  const [action, setAction] = useState<"login" | "register">("login");
  const handleLogin = async () => {
    const accountAddress = await login(usernameInput);
    console.log(accountAddress);
    // notification.success(`Logging user ${username} : ${accountAddress} in.`);
  };
  const handleRegister = async () => {
    const accountAddress = await createNewAccount(usernameInput);
    console.log(
      `Successfully created account for ${usernameInput} : ${accountAddress}`,
    );
  };
  if (loggedInUser && loggedInUser !== "") {
    return (
      <main className="flex-1 flex flex-col items-center text-center min-h-[calc(100vh-_theme(spacing.16))] gap-4 md:justify-center">
        <Card className="w-full max-w-sm mt-4 md:mt-0">
          <CardContent className="flex flex-col items-center gap-2 mt-4">
            <div className="text-3xl font-bold">$5,231.89</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Available balance
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {loggedInUser}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {account?.address}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <SendTransactionModal />
            <QrCodeModal />
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          {action === "login" ? (
            <>
              <DialogTitle>Login with Username</DialogTitle>
              <DialogDescription>
                Enter your username to login to your account
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Create your account</DialogTitle>
              <DialogDescription>
                Enter your username for your account
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              required
              type="text"
              onChange={(e) => setUsernameInput(e.target.value)}
              value={usernameInput}
            />
          </div>
          <Button
            className="w-full"
            type="submit"
            onClick={action === "login" ? handleLogin : handleRegister}
          >
            {action === "login" ? "Login" : "Create"}
          </Button>
          <div className="mt-4 text-center text-sm">
            {action === "login" ? (
              <>
                Don't have an account?
                <Button variant={"link"} onClick={() => setAction("register")}>
                  Sign up
                </Button>
              </>
            ) : (
              <>
                Already have an account?
                <Button variant={"link"} onClick={() => setAction("login")}>
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Dashboard;
