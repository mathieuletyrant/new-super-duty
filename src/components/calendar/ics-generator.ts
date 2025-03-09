import { format, addDays } from "date-fns";

// Interface for rotation entry
export interface RotationEntry {
  id: string;
  assignee: string;
  startDate: Date;
  endDate: Date;
  title: string;
}

/**
 * Generates an ICS file content from rotation entries
 * @param rotations Array of rotation entries
 * @param calendarName Name of the calendar
 * @returns String content of the ICS file
 */
export function generateICSContent(
  rotations: RotationEntry[],
  calendarName: string,
): string {
  // ICS file header
  let icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Team Rotation App//EN",
    `X-WR-CALNAME:${calendarName}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  // Add each rotation as an event
  rotations.forEach((rotation) => {
    const startDate = format(rotation.startDate, "yyyyMMdd'T'HHmmss'Z'");
    const endDate = format(rotation.endDate, "yyyyMMdd'T'HHmmss'Z'");
    const now = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");

    const event = [
      "BEGIN:VEVENT",
      `UID:${rotation.id}@teamrotation.app`,
      `DTSTAMP:${now}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${rotation.title}`,
      `DESCRIPTION:Assigned to ${rotation.assignee}`,
      "END:VEVENT",
    ];

    icsContent = [...icsContent, ...event];
  });

  // Close the calendar
  icsContent.push("END:VCALENDAR");

  return icsContent.join("\r\n");
}

/**
 * Creates a downloadable ICS file from rotation entries
 * @param rotations Array of rotation entries
 * @param calendarName Name of the calendar
 * @returns URL to download the ICS file
 */
export function createICSFile(
  rotations: RotationEntry[],
  calendarName: string,
): string {
  const icsContent = generateICSContent(rotations, calendarName);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  return URL.createObjectURL(blob);
}

/**
 * Generates a public URL for the ICS calendar
 * This would typically involve saving the calendar to a server and returning a public URL
 * @param teamId The team ID to generate the calendar for
 * @returns A public URL string
 */
export function getPublicICSUrl(teamId: string): string {
  // In a real implementation, this would generate a unique, persistent URL
  // For now, we'll return a placeholder URL
  return `https://api.teamrotation.app/calendar/${teamId}/feed.ics`;
}
