export type Coordinates = { lat: number; lon: number };
export type Place = Coordinates & { id: string; name: string; detail: string };
export type Hours = { open: string; close: string };
export type Cafe = Coordinates & {
  id: string;
  name: string;
  neighbourhood: string;
  address: string;
  note: string;
  hours: (Hours | null)[]; // Sunday first; null means no confirmed opening hours.
  dateHours?: Record<string, Hours | null>;
  hoursNote?: string;
  source: string;
  checked: string;
};
export type Walk = { cafeId: string; you: number | null; them: number | null };
export type RouteData = { walks: Walk[]; estimated: boolean };
export type Recommendation = {
  cafe: Cafe;
  you: number;
  them: number;
  remaining: number;
  duration: number;
  score: number;
};
