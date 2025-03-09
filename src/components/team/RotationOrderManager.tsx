import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUp, ArrowDown, Save } from "lucide-react";
import { TeamMember } from "@/types/types";

interface RotationOrderManagerProps {
  initialMembers?: TeamMember[];
  onSaveOrder?: (members: TeamMember[]) => void;
}

export default function RotationOrderManager({
  initialMembers = [
    {
      id: "1",
      name: "Jane Smith",
      email: "jane@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      active: true,
      createdAt: new Date(2023, 0, 15),
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      active: true,
      createdAt: new Date(2023, 1, 20),
    },
    {
      id: "3",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      active: true,
      createdAt: new Date(2023, 2, 10),
    },
  ],
  onSaveOrder = () => {},
}: RotationOrderManagerProps) {
  const [members, setMembers] = useState<TeamMember[]>(
    initialMembers.filter((member) => member.active),
  );
  const [isSaved, setIsSaved] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newMembers = [...members];
    [newMembers[index - 1], newMembers[index]] = [
      newMembers[index],
      newMembers[index - 1],
    ];
    setMembers(newMembers);
    setIsSaved(false);
  };

  const moveDown = (index: number) => {
    if (index === members.length - 1) return;
    const newMembers = [...members];
    [newMembers[index], newMembers[index + 1]] = [
      newMembers[index + 1],
      newMembers[index],
    ];
    setMembers(newMembers);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveOrder(members);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>Rotation Order</CardTitle>
        <CardDescription>
          Drag team members to change the rotation order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No active team members to arrange
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {members.map((member, index) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 text-center font-medium text-gray-500">
                        {index + 1}
                      </div>
                      <Avatar>
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveDown(index)}
                        disabled={index === members.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSave}
                className="w-full mt-4 flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaved ? "Order Saved!" : "Save Rotation Order"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
