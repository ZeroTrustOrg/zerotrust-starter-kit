import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DialogTitle, DialogDescription, DialogHeader, DialogContent, Dialog } from '@/components/ui/dialog';
import useAuth from '@/hooks/useAuth';

interface OnboadingModalProps{
  onboardingAction:'login' | 'register'
  open:boolean
  onOpenChange(open: boolean): void;
}

export default function OnboardingModal({onboardingAction,open,onOpenChange}:OnboadingModalProps){
  const [usernameInput, setUsernameInput] = useState<string>('');
  const { login, createNewAccount } = useAuth();
  const [action, setAction] = useState<'login' | 'register'>(onboardingAction);
  const [isRegisterLoading,setIsRegisterLoading] = useState(false)
  const [isLoginLoading,setIsLoginLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoginLoading(true);
    try{
      await login(usernameInput);
      toast(`Logging user ${usernameInput} in.`);
    }catch(e){
      if(e instanceof Error)
        toast(e.message);
      console.error(e)
    }
    setIsLoginLoading(false);
  };

  const handleRegister = async () => {
    setIsRegisterLoading(true);
    try{
      await createNewAccount(usernameInput);
      toast(`Successfully created account for ${usernameInput}.`);
      setAction('login'); // Switch to login after registration
    }catch(e){
      if(e instanceof Error)
        toast(e.message);
      console.error(e)
    }
    setIsRegisterLoading(false);
  };
   return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {action === 'login' ? (
            <>
              <DialogTitle>Login with Username</DialogTitle>
              <DialogDescription>Enter your username to login to your account</DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Create your account</DialogTitle>
              <DialogDescription>Enter your username for your account</DialogDescription>
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
          <Button isLoading={action === 'login' ? isLoginLoading : isRegisterLoading} className="w-full" type="submit" onClick={action === 'login' ? handleLogin : handleRegister}>
            {action === 'login' ? 'Login' : 'Create'}
          </Button>
          <div className="mt-4 text-center text-sm">
            {action === 'login' ? (
              <>
                Don't have an account?
                <Button variant="link" onClick={() => setAction('register')}>
                  Sign up
                </Button>
              </>
            ) : (
              <>
                Already have an account?
                <Button variant="link" onClick={() => setAction('login')}>
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}