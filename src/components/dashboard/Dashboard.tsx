import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "../layout/DashboardLayout";
import CurrentRotation from "./CurrentRotation";
import UpcomingRotations from "./UpcomingRotations";
import RotationCalendar from "./RotationCalendar";
import RotationAssignment from "../rotation/RotationAssignment";
import {
  RotationProvider,
  useRotations,
  Rotation,
} from "../rotation/RotationList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function DashboardContent() {
  const { rotations } = useRotations();
  const navigate = useNavigate();
  const [activeRotations] = useState(
    rotations.filter((r) => r.active !== false),
  );
  const [selectedRotation, setSelectedRotation] = useState<string>(
    activeRotations[0]?.id || "",
  );

  const currentRotation = rotations.find((r) => r.id === selectedRotation);

  const handleAddRotation = () => {
    navigate("/settings");
  };

  // Mock rotation data based on selected rotation
  const getCurrentRotationData = () => {
    if (currentRotation?.type === "daily") {
      return {
        member: {
          id: "2",
          name: "John Doe",
          email: "john@example.com",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        },
        startDate: new Date(),
        endDate: new Date(),
      };
    }

    return {
      member: {
        id: "1",
        name: "Jane Smith",
        email: "jane@example.com",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      },
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  };

  // Mock upcoming rotations based on selected rotation
  const getUpcomingRotations = () => {
    if (currentRotation?.type === "daily") {
      return [
        {
          id: "3",
          name: "Alice Johnson",
          email: "alice@example.com",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        {
          id: "4",
          name: "Bob Williams",
          email: "bob@example.com",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
      ];
    }

    return [
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
    ];
  };

  // Mock calendar rotations based on selected rotation
  const getCalendarRotations = () => {
    if (currentRotation?.type === "daily") {
      return [
        {
          id: "1",
          memberId: "1",
          memberName: "Jane Smith",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
          startDate: new Date(),
          endDate: new Date(),
        },
        {
          id: "2",
          memberId: "2",
          memberName: "John Doe",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        {
          id: "3",
          memberId: "3",
          memberName: "Alice Johnson",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        },
      ];
    }

    return [
      {
        id: "1",
        memberId: "1",
        memberName: "Jane Smith",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        memberId: "2",
        memberName: "John Doe",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        id: "3",
        memberId: "3",
        memberName: "Alice Johnson",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      },
    ];
  };

  const currentRotationData = getCurrentRotationData();
  const upcomingRotations = getUpcomingRotations();
  const calendarRotations = getCalendarRotations();

  if (activeRotations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <h2 className="text-xl font-medium">No active rotations found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          You don't have any active rotations set up yet. Create a rotation in
          the settings to get started.
        </p>
        <Button onClick={handleAddRotation} className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Create Rotation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Label htmlFor="rotation-select" className="mb-2 block">
          Select Rotation
        </Label>
        <div className="flex gap-2">
          <Select value={selectedRotation} onValueChange={setSelectedRotation}>
            <SelectTrigger id="rotation-select" className="w-[250px]">
              <SelectValue placeholder="Select a rotation" />
            </SelectTrigger>
            <SelectContent>
              {activeRotations.map((rotation) => (
                <SelectItem key={rotation.id} value={rotation.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: rotation.color || "#4f46e5" }}
                    />
                    {rotation.name} ({rotation.type})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleAddRotation}>
            <Plus className="h-4 w-4 mr-1" />
            Add Rotation
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <CurrentRotation
              member={currentRotationData.member}
              startDate={currentRotationData.startDate}
              endDate={currentRotationData.endDate}
              onMarkComplete={() => {}}
            />
            <UpcomingRotations rotations={upcomingRotations} />
          </div>

          <Card className="bg-white shadow-md">
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
              <div className="space-y-4">
                <div>
                  <Label htmlFor="security-token">
                    Security Token (Optional)
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="security-token"
                      placeholder="Enter or generate a security token"
                      className="flex-1"
                      onChange={(e) => {
                        const urlInput = document.getElementById(
                          "ics-url",
                        ) as HTMLInputElement;
                        if (urlInput) {
                          const token = e.target.value;
                          urlInput.value = token
                            ? `https://api.superduty.app/calendar/${selectedRotation}/feed.ics?token=${token}`
                            : `https://api.superduty.app/calendar/${selectedRotation}/feed.ics`;
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const token =
                          Math.random().toString(36).substring(2, 15) +
                          Math.random().toString(36).substring(2, 15);
                        const tokenInput = document.getElementById(
                          "security-token",
                        ) as HTMLInputElement;
                        const urlInput = document.getElementById(
                          "ics-url",
                        ) as HTMLInputElement;

                        if (tokenInput) tokenInput.value = token;
                        if (urlInput) {
                          urlInput.value = `https://api.superduty.app/calendar/${selectedRotation}/feed.ics?token=${token}`;
                        }
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add a security token to your calendar URL to prevent
                    unauthorized access
                  </p>
                </div>

                <div>
                  <Label htmlFor="ics-url">Calendar URL</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      readOnly
                      id="ics-url"
                      value={`https://api.superduty.app/calendar/${selectedRotation}/feed.ics`}
                      className="flex-1 bg-muted/50"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const urlInput = document.getElementById(
                                "ics-url",
                              ) as HTMLInputElement;
                              if (urlInput) {
                                navigator.clipboard.writeText(urlInput.value);
                                alert("URL copied to clipboard!");
                              }
                            }}
                            className="flex-shrink-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy URL</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <RotationCalendar rotations={calendarRotations} />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          {currentRotation && (
            <RotationAssignment
              rotationId={currentRotation.id}
              rotationName={currentRotation.name}
              rotationType={currentRotation.type}
              color={currentRotation.color}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Dashboard() {
  return (
    <RotationProvider>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Super Duty</h1>
            <p className="text-muted-foreground">
              Manage your team's rotation schedule efficiently
            </p>
          </div>

          <DashboardContent />
        </div>
      </DashboardLayout>
    </RotationProvider>
  );
}
