import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface RotationMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  startDate: Date;
  endDate: Date;
}

interface UpcomingRotationsProps {
  rotations: RotationMember[];
}

export default function UpcomingRotations({
  rotations = [
    {
      id: "2",
      name: "John Doe",
      email: "john@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      name: "Bob Williams",
      email: "bob@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    },
  ],
}: UpcomingRotationsProps) {
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
        <CardTitle>Upcoming Rotations</CardTitle>
        <CardDescription>Schedule for the next few weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rotations.map((rotation) => (
            <div
              key={rotation.id}
              className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-50"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={rotation.avatarUrl} alt={rotation.name} />
                <AvatarFallback>{getInitials(rotation.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{rotation.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {format(rotation.startDate, "MMM d")} -{" "}
                  {format(rotation.endDate, "MMM d")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
