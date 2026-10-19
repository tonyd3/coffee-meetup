import type { Cafe, Coordinates, Recommendation, RouteData } from "./types";

export const TIME_ZONE = "America/Los_Angeles";
export const balanceLabels = [
  "Closest to you",
  "A little closer to you",
  "Meet in the middle",
  "A little closer to them",
  "Closest to them",
];
export function minutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
export function timeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""}${h >= 12 ? "pm" : "am"}`;
}
export function dayOfWeek(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}
export function sfToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function nextDay(date: string, kind: "weekday" | "weekend"): string {
  let candidate = date;
  for (let i = 0; i < 7; i++) {
    const day = dayOfWeek(candidate);
    if ((kind === "weekend") === (day === 0 || day === 6)) return candidate;
    candidate = new Date(
      new Date(`${candidate}T12:00:00Z`).getTime() + 86400000,
    )
      .toISOString()
      .slice(0, 10);
  }
  return candidate;
}
export function openingHours(cafe: Cafe, date: string) {
  return cafe.dateHours && Object.hasOwn(cafe.dateHours, date)
    ? cafe.dateHours[date]
    : cafe.hours[dayOfWeek(date)];
}
export function availableMinutes(
  cafe: Cafe,
  date: string,
  time: string,
): number {
  const hours = openingHours(cafe, date);
  if (!hours) return 0;
  const start = minutes(time);
  return start < minutes(hours.open) || start >= minutes(hours.close)
    ? 0
    : minutes(hours.close) - start;
}
export function recommendations(
  cafes: Cafe[],
  routes: RouteData,
  date: string,
  time: string,
  balance: number,
): Recommendation[] {
  const weight = Math.min(4, Math.max(0, balance)) / 4;
  return cafes
    .flatMap((cafe) => {
      const walk = routes.walks.find((w) => w.cafeId === cafe.id);
      const remaining = availableMinutes(cafe, date, time);
      if (remaining < 30 || walk?.you == null || walk.them == null) return [];
      // The middle minimises the longer walk; either end favours just that person.
      return [
        {
          cafe,
          you: walk.you,
          them: walk.them,
          remaining,
          duration: Math.min(60, remaining),
          score: Math.max((1 - weight) * walk.you, weight * walk.them),
        },
      ];
    })
    .sort(
      (a, b) =>
        a.score - b.score ||
        a.you + a.them - (b.you + b.them) ||
        a.cafe.name.localeCompare(b.cafe.name),
    );
}
export function isSF(point: unknown): point is Coordinates {
  if (!point || typeof point !== "object") return false;
  const { lat, lon } = point as Coordinates;
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= 37.7 &&
    lat <= 37.83 &&
    lon >= -122.52 &&
    lon <= -122.35
  );
}
export function estimatedWalk(from: Coordinates, to: Coordinates): number {
  const radians = (n: number) => (n * Math.PI) / 180;
  const dLat = radians(to.lat - from.lat),
    dLon = radians(to.lon - from.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radians(from.lat)) *
      Math.cos(radians(to.lat)) *
      Math.sin(dLon / 2) ** 2;
  const km = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(1, Math.ceil(((km * 1.3) / 4.5) * 60));
}

// Resolve SF wall-clock time independently of the browser/server's timezone, including DST.
export function meetingInstant(date: string, time: string): Date {
  const wall = Date.parse(`${date}T${time}:00Z`);
  let instant = wall;
  for (let i = 0; i < 3; i++) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(instant));
    const get = (type: string) => parts.find((p) => p.type === type)!.value;
    const asUTC = Date.parse(
      `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}Z`,
    );
    instant += wall - asUTC;
  }
  return new Date(instant);
}
export function dateLabel(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
