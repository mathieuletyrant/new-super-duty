import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Calendar as CalendarIcon,
  Plus,
  Users,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import { format, addDays, addWeeks, addMonths, isBefore } from "date-fns";
import { TeamMember } from "@/types/types";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRotations } from "./RotationList";
import { cn } from "@/lib/utils";

interface RotationAssignmentProps {
  rotationId?: string;
  rotationName?: string;
  rotationType?: "weekly" | "daily" | "monthly";
  color?: string;
}

interface Assignment {
  id: string;
  memberId: string;
  startDate: Date;
  endDate: Date;
  rotationId: string;
  notes?: string;
  status?: "upcoming" | "active" | "completed";
}

export default function RotationAssignment({
  rotationId = "1",
  rotationName = "Maintenance",
  rotationType = "weekly",
  color = "#4f46e5",
}: RotationAssignmentProps) {
  const { rotations } = useRotations();
  const rotation = rotations.find((r) => r.id === rotationId);

  // Mock team members
  const teamMembers: TeamMember[] = [
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
    {
      id: "4",
      name: "Bob Williams",
      email: "bob@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      active: true,
      createdAt: new Date(2023, 3, 5),
    },
    {
      id: "5",
      name: "Charlie Brown",
      email: "charlie@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
      active: true,
      createdAt: new Date(2023, 4, 15),
    },
  ];

  // Generate assignments based on rotation type
  const generateAssignments = () => {
    const now = new Date();
    const assignments: Assignment[] = [];

    // Filter team members to only include those assigned to this rotation
    const assignedMembers = teamMembers.filter((member) =>
      rotation?.teamMembers?.includes(member.id),
    );

    if (assignedMembers.length === 0) return [];

    // Create assignments for each member in sequence
    let currentDate = now;
    let status: "active" | "upcoming" = "active";

    for (let i = 0; i < 10; i++) {
      // Generate 10 assignments
      const memberIndex = i % assignedMembers.length;
      const member = assignedMembers[memberIndex];

      let endDate;
      if (rotationType === "daily") {
        endDate = new Date(currentDate);
      } else if (rotationType === "weekly") {
        endDate = addDays(currentDate, 6); // End date is 6 days after start (7 days total)
      } else if (rotationType === "monthly") {
        endDate = addDays(addMonths(currentDate, 1), -1); // End date is last day of the month
      }

      assignments.push({
        id: `a${i + 1}`,
        memberId: member.id,
        startDate: new Date(currentDate),
        endDate: endDate!,
        rotationId,
        status: i === 0 ? "active" : "upcoming",
      });

      // Move to next period
      if (rotationType === "daily") {
        currentDate = addDays(currentDate, 1);
      } else if (rotationType === "weekly") {
        currentDate = addDays(currentDate, 7);
      } else if (rotationType === "monthly") {
        currentDate = addMonths(currentDate, 1);
      }
    }

    return assignments;
  };

  // Mock assignments
  const [assignments, setAssignments] = useState<Assignment[]>(
    generateAssignments(),
  );

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    // Regenerate assignments when rotation type changes
    setAssignments(generateAssignments());
  }, [rotationId, rotationType]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getMemberById = (id: string) => {
    return teamMembers.find((member) => member.id === id);
  };

  const getAssignmentDuration = () => {
    if (rotationType === "daily") return "one day";
    if (rotationType === "weekly") return "one week";
    if (rotationType === "monthly") return "one month";
    return "";
  };

  const handleAddAssignment = () => {
    if (!selectedMemberId) return;

    let endDate;
    if (rotationType === "daily") {
      endDate = new Date(selectedDate);
    } else if (rotationType === "weekly") {
      endDate = addDays(selectedDate, 6);
    } else if (rotationType === "monthly") {
      endDate = addDays(addMonths(selectedDate, 1), -1);
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      memberId: selectedMemberId,
      startDate: selectedDate,
      endDate: endDate!,
      rotationId,
      status: "upcoming",
    };

    // Insert the new assignment in the correct chronological position
    const newAssignments = [...assignments];
    let insertIndex = newAssignments.findIndex((a) =>
      isBefore(newAssignment.startDate, a.startDate),
    );

    if (insertIndex === -1) {
      // Add to the end if it's later than all existing assignments
      newAssignments.push(newAssignment);
    } else {
      newAssignments.splice(insertIndex, 0, newAssignment);
    }

    setAssignments(newAssignments);
    setIsAddDialogOpen(false);
    setSelectedMemberId("");
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter((a) => a.id !== assignmentId));
  };

  const handleReorderAssignments = () => {
    // Sort assignments by start date
    const sortedAssignments = [...assignments].sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );

    // Update status based on current date
    const now = new Date();
    const updatedAssignments = sortedAssignments.map((assignment) => ({
      ...assignment,
      status: isBefore(assignment.endDate, now)
        ? "completed"
        : isBefore(now, assignment.startDate)
          ? "upcoming"
          : "active",
    }));

    setAssignments(updatedAssignments);
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color || "#4f46e5" }}
            />
            <CardTitle>{rotationName} Assignments</CardTitle>
            <Badge
              variant={
                rotationType === "weekly"
                  ? "default"
                  : rotationType === "daily"
                    ? "secondary"
                    : "outline"
              }
            >
              {rotationType === "weekly"
                ? "Weekly"
                : rotationType === "daily"
                  ? "Daily"
                  : "Monthly"}
            </Badge>
          </div>
          <CardDescription>
            {rotationType === "weekly"
              ? "Weekly rotation assignments"
              : rotationType === "daily"
                ? "Daily rotation assignments"
                : "Monthly rotation assignments"}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReorderAssignments}
            className="flex items-center gap-1"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="member">Team Member</Label>
                  <Select
                    value={selectedMemberId}
                    onValueChange={setSelectedMemberId}
                  >
                    <SelectTrigger id="member" className="w-full">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers
                        .filter((member) =>
                          rotation?.teamMembers?.includes(member.id),
                        )
                        .map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Start Date</Label>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date || new Date());
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">
                    The rotation will last for {getAssignmentDuration()}
                  </p>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setSelectedMemberId("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddAssignment}
                    disabled={!selectedMemberId}
                  >
                    Add Assignment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No assignments added yet
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => {
                const member = getMemberById(assignment.memberId);
                if (!member) return null;

                return (
                  <div
                    key={assignment.id}
                    className={`flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 ${assignment.status === "active" ? "border-l-4" : ""}`}
                    style={{
                      borderLeftColor:
                        assignment.status === "active" ? color : undefined,
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {member.name}
                          {assignment.status && (
                            <Badge
                              variant={
                                assignment.status === "active"
                                  ? "default"
                                  : assignment.status === "upcoming"
                                    ? "outline"
                                    : "secondary"
                              }
                              className={
                                assignment.status === "completed"
                                  ? "bg-gray-200 text-gray-700"
                                  : ""
                              }
                            >
                              {assignment.status}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {rotationType === "daily" ? (
                            <>{format(assignment.startDate, "MMMM d, yyyy")}</>
                          ) : (
                            <>
                              {format(assignment.startDate, "MMM d")} -{" "}
                              {format(assignment.endDate, "MMM d, yyyy")}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAssignment(assignment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
