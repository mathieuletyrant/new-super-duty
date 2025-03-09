import { useState } from "react";
import { format } from "date-fns";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { DateRange } from "react-day-picker";

interface HistoryEntry {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberAvatar?: string;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  notes?: string;
}

export default function RotationHistoryPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  // Mock history data
  const historyEntries: HistoryEntry[] = [
    {
      id: "h1",
      memberId: "1",
      memberName: "Jane Smith",
      memberEmail: "jane@example.com",
      memberAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      completed: true,
      notes: "Handled 3 incidents successfully",
    },
    {
      id: "h2",
      memberId: "2",
      memberName: "John Doe",
      memberEmail: "john@example.com",
      memberAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      completed: true,
    },
    {
      id: "h3",
      memberId: "3",
      memberName: "Alice Johnson",
      memberEmail: "alice@example.com",
      memberAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      completed: false,
    },
  ];

  // Filter history entries based on date range
  const filteredEntries = date
    ? historyEntries.filter((entry) => {
        if (!date.from) return true;
        if (date.to) {
          return entry.startDate >= date.from && entry.startDate <= date.to;
        }
        return entry.startDate >= date.from;
      })
    : historyEntries;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleExportICS = () => {
    // This would use the ics-generator to create a downloadable file
    alert("Exporting ICS file...");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Rotation History
          </h1>
          <p className="text-muted-foreground">
            View past rotation assignments
          </p>
        </div>

        <Card className="bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>History</CardTitle>
              <CardDescription>Past rotation assignments</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <DatePickerWithRange date={date} setDate={setDate} />
              <Button variant="outline" size="icon" onClick={handleExportICS}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No history entries found for the selected date range
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={entry.memberAvatar}
                            alt={entry.memberName}
                          />
                          <AvatarFallback>
                            {getInitials(entry.memberName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{entry.memberName}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.memberEmail}
                          </div>
                        </div>
                      </div>
                      <Badge variant={entry.completed ? "default" : "outline"}>
                        {entry.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(entry.startDate, "MMMM d, yyyy")} -{" "}
                      {format(entry.endDate, "MMMM d, yyyy")}
                    </div>
                    {entry.notes && (
                      <div className="text-sm bg-gray-50 p-2 rounded-md">
                        {entry.notes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
