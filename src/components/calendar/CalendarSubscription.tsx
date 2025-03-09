import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPublicICSUrl } from "./ics-generator";
import { Copy, Calendar, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalendarSubscriptionProps {
  teamId: string;
}

export default function CalendarSubscription({
  teamId = "demo-team",
}: CalendarSubscriptionProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = getPublicICSUrl(teamId);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = () => {
    // Open the URL in a new tab - most calendar apps will recognize the ICS file
    window.open(publicUrl, "_blank");
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Subscription
        </CardTitle>
        <CardDescription>
          Subscribe to the rotation calendar in your favorite calendar
          application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input readOnly value={publicUrl} className="flex-1 bg-muted/50" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                  className="flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy URL"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubscribe}
          className="w-full flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Subscribe to Calendar
        </Button>
      </CardFooter>
    </Card>
  );
}
