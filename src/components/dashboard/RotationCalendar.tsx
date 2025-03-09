import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isSameMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RotationCalendarProps {
  rotations: Array<{
    id: string;
    memberId: string;
    memberName: string;
    avatarUrl?: string;
    startDate: Date;
    endDate: Date;
  }>;
}

export default function RotationCalendar({
  rotations = [
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
  ],
}: RotationCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  // Function to determine if a date has a rotation
  const isDateInRotation = (date: Date) => {
    return rotations.find((rotation) => {
      const checkDate = new Date(date);
      return checkDate >= rotation.startDate && checkDate <= rotation.endDate;
    });
  };

  // Function to get the member name for a date
  const getMemberForDate = (date: Date) => {
    const rotation = isDateInRotation(date);
    return rotation || null;
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handlePreviousMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setMonth(newMonth);
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>Rotation Calendar</CardTitle>
        <CardDescription>View and manage the rotation schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {format(month, "MMMM yyyy", { locale: fr })}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={month}
            onMonthChange={setMonth}
            className="rounded-md border shadow-sm"
            classNames={{
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "hidden", // Hide default month caption
              nav: "hidden", // Hide default navigation
              table: "w-full border-collapse",
              head_row: "flex w-full",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-medium text-[0.8rem] flex-1 text-center",
              row: "flex w-full mt-2",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md flex-1",
              day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center rounded-md",
              day_range_end: "day-range-end",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "day-outside text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            components={{
              DayContent: (props) => {
                // Vérifier que day et day.date existent
                if (!props.day || !props.day.date) {
                  return <div>{props.day?.day || ""}</div>;
                }

                const isOutsideMonth = !isSameMonth(props.day.date, month);
                const member = getMemberForDate(props.day.date);
                const dayNumber = props.day.date.getDate();

                return (
                  <div
                    className={`flex flex-col h-full w-full ${isOutsideMonth ? "opacity-40" : ""}`}
                  >
                    <div className="text-center mb-1">{dayNumber}</div>
                    {member && (
                      <div className="flex flex-col items-center">
                        <Avatar className="h-6 w-6 mb-1">
                          <AvatarImage
                            src={member.avatarUrl}
                            alt={member.memberName}
                          />
                          <AvatarFallback className="text-[10px]">
                            {getInitials(member.memberName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-[10px] font-medium text-primary truncate max-w-full px-1">
                          {member.memberName.split(" ")[0]}
                        </div>
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Légende</h3>
            <div className="space-y-2">
              {rotations.map((rotation) => (
                <div key={rotation.id} className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={rotation.avatarUrl}
                      alt={rotation.memberName}
                    />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(rotation.memberName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-medium">{rotation.memberName}</span>
                    <span className="text-muted-foreground ml-2">
                      {format(rotation.startDate, "dd/MM")} -{" "}
                      {format(rotation.endDate, "dd/MM")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
