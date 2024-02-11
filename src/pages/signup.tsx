/* eslint-disable react-hooks/rules-of-hooks */
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
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog";

const signup = () => {
  const [userNameInput, setUsernameInput] = useState<string>("");
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

  //   const createPasskey = (passkeyName: string) => {};

  //   const createUsername = (username: string, passkeyName: string) => {
  //     // Move to the page of login
  //   };
  return (
    <div>
      <div className="flex-1 flex flex-col items-center text-center min-h-[calc(100vh_-_theme(spacing.16))] gap-4 md:justify-center">
        <div className="w-full max-w-md">
          <Card className="">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Create your account
              </CardTitle>
              <CardDescription>Input a name for your passkey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      variant="default"
                      onClick={() => {}}
                    >
                      Create Passkey
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Backup your account with a Username
                      </DialogTitle>
                      <DialogDescription>
                        Create a username so you can backup your account and
                        send and receive money easily
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

                      <span className="mt-4 text-center text-sm">
                        Remember that your username will have the 0trust.eth
                        termination
                      </span>

                      <Button
                        className="w-full"
                        type="submit"
                        onClick={() => {}}
                        variant="default"
                      >
                        Create Username
                      </Button>

                      <div className="mt-4 text-center text-sm">
                        Dont wannt a username{" "}
                        <Link className="underline" to="/login">
                          skip it
                        </Link>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="underline">Login</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default signup;
