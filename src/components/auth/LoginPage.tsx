import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GitHubLogin from "./GitHubLogin";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Super Duty</CardTitle>
          <CardDescription>
            Manage your team's maintenance rotation schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground mb-4">
              Sign in to manage your team's rotation schedule
            </div>
            <GitHubLogin />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-muted-foreground">
          Your data is securely stored and never shared
        </CardFooter>
      </Card>
    </div>
  );
}
