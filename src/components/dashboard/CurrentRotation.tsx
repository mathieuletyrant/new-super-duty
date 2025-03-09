import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface CurrentRotationProps {
  member: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  startDate: Date;
  endDate: Date;
  onMarkComplete: () => void;
}

export default function CurrentRotation({
  member = {
    id: "1",
    name: "Jane Smith",
    email: "jane@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  },
  startDate = new Date(),
  endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  onMarkComplete = () => {},
}: CurrentRotationProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>Current On-Call</CardTitle>
        <CardDescription>
          {format(startDate, "MMMM d")} - {format(endDate, "MMMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.avatarUrl} alt={member.name} />
            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{member.name}</div>
            <div className="text-sm text-muted-foreground">{member.email}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
