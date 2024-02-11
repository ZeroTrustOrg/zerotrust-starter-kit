import { SetStateAction, useState } from "react";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

const login = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userNameInput, setUsernameInput] = useState<string>("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [passkeyInput, setPasskeyInput] = useState<string>("");

  const handleUsernameChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setUsernameInput(event.target.value);
  };

  // Handler for updating passkey input
  const handlePasskeyChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setPasskeyInput(event.target.value);
  };

  return (
    <div className="flex-1 flex flex-col items-center text-center min-h-[calc(100vh_-_theme(spacing.16))] gap-4 md:justify-center">
      <div className="w-full max-w-md">
        <Card className="">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Login to your account
            </CardTitle>
            <CardDescription>
              Select your preferred method of authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mb-4" variant="default">
                    Login with Passkeys
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Login with Passkeys</DialogTitle>
                    <DialogDescription>
                      Enter your passkey name below to login to your account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="passkeys">Passkey name</Label>
                      <Input
                        id="passkeys"
                        required
                        onChange={handlePasskeyChange}
                        value={passkeyInput}
                      />
                    </div>
                    <Button onClick={() => {}} className="w-full" type="submit">
                      Login
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="secondary">
                    Login with Username
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Login with Username</DialogTitle>
                    <DialogDescription>
                      Enter your username to login to your account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        required
                        type="text"
                        onChange={handleUsernameChange}
                        value={userNameInput}
                      />
                    </div>

                    <Button className="w-full" type="submit" onClick={() => {}}>
                      Login
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?
              <Link className="underline" to="/signup">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default login;
