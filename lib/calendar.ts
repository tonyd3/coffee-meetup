import { meetingInstant, TIME_ZONE } from "./meeting";
import type { Recommendation } from "./types";

const stamp = (date: Date) =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
function eventData(result: Recommendation, date: string, time: string) {
  const start = meetingInstant(date, time);
  const end = new Date(start.getTime() + result.duration * 60000);
  return {
    start,
    end,
    title: `Coffee at ${result.cafe.name}`,
    location: `${result.cafe.name}, ${result.cafe.address}, San Francisco, CA`,
    description: `Coffee meetup at ${result.cafe.name}.\n${result.duration} minutes planned.\nRegular opening hours: ${result.cafe.source}\nPlease check holiday hours before heading out.`,
  };
}
export function googleCalendar(
  result: Recommendation,
  date: string,
  time: string,
): string {
  const e = eventData(result, date, time);
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: `${stamp(e.start)}/${stamp(e.end)}`, ctz: TIME_ZONE, location: e.location, details: e.description })}`;
}
function escapeICS(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}
// Fold at 75 UTF-8 octets without splitting multi-byte characters (RFC 5545).
function fold(line: string): string {
  let out = "",
    width = 0;
  for (const char of line) {
    const size = new TextEncoder().encode(char).length;
    if (width + size > 75) {
      out += "\r\n ";
      width = 1;
    }
    out += char;
    width += size;
  }
  return out;
}
export function calendarICS(
  result: Recommendation,
  date: string,
  time: string,
  uid = crypto.randomUUID(),
): string {
  const e = eventData(result, date, time);
  return (
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Tony Dong//Coffee Meetup//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${uid}@meet.tony-dong.com`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(e.start)}`,
      `DTEND:${stamp(e.end)}`,
      `SUMMARY:${escapeICS(e.title)}`,
      `LOCATION:${escapeICS(e.location)}`,
      `DESCRIPTION:${escapeICS(e.description)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .map(fold)
      .join("\r\n") + "\r\n"
  );
}
