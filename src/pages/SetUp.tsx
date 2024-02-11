import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const SetUp = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>ZeroTrust Starter Kit</CardTitle>
          <CardDescription>Manage your account settings.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button className="w-full" variant="outline">
            Create Account
          </Button>
          <Button className="w-full">Login</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetUp;
