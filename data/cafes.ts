import type { Cafe, Hours } from "@/lib/types";

const daily = (open: string, close: string): Hours[] =>
  Array.from({ length: 7 }, () => ({ open, close }));
const checked = "2026-10-19";
const saintFrank = "https://www.saintfrankcoffee.com/pages/our-locations";
const sightglass = "https://sightglasscoffee.com/pages/our-cafes";
const sightglassHours = () =>
  daily("06:30", "17:00").map((h, day) =>
    day === 0 || day === 6 ? { ...h, open: "07:00" } : h,
  );

// SF whitelist: all public city cafés listed by Verve, Saint Frank and Ritual,
// plus the retained Sightglass locations. Hours come from the official sources.
// Coordinates are OSM/Photon points, except FiDi's official linked Google Maps pin.
export const cafes: Cafe[] = [
  {
    id: "ritual-fidi",
    name: "Ritual · FiDi",
    neighbourhood: "Financial District",
    address: "259 California Street",
    lat: 37.7929686,
    lon: -122.3995136,
    note: "Ritual's new café in the 255 California building.",
    hours: Array.from({ length: 7 }, () => null),
    dateHours: { "2026-10-22": { open: "08:00", close: "15:00" } },
    hoursNote: "Opening day: 22 Oct, 8am–3pm; regular hours unconfirmed.",
    source: "https://ritualcoffee.com/location/fidi/",
    checked,
  },
  {
    id: "ritual-hayes",
    name: "Ritual · Hayes Valley",
    neighbourhood: "Hayes Valley",
    address: "432B Octavia Street",
    lat: 37.7763922,
    lon: -122.424172,
    note: "The Ritual coffee bar at PROXY, beside Patricia's Green.",
    hours: daily("07:00", "15:30").map((h, day) =>
      day === 0 || day === 6 ? { ...h, close: "17:00" } : h,
    ),
    source: "https://ritualcoffee.com/locations/",
    checked,
  },
  {
    id: "ritual-valencia",
    name: "Ritual · Valencia",
    neighbourhood: "Mission",
    address: "1026 Valencia Street",
    lat: 37.7564325,
    lon: -122.4212469,
    note: "The original Ritual, in a bright, open space on Valencia.",
    hours: daily("06:30", "19:00").map((h, day) =>
      [0, 5, 6].includes(day) ? { ...h, close: "20:00" } : h,
    ),
    source: "https://ritualcoffee.com/location/mission/",
    checked,
  },
  {
    id: "saint-frank-mira",
    name: "Saint Frank · Mira",
    neighbourhood: "Rincon Hill",
    address: "120 Folsom Street",
    lat: 37.78995,
    lon: -122.3914481,
    note: "A Saint Frank stop near the waterfront and downtown.",
    hours: daily("07:00", "18:00"),
    source: saintFrank,
    checked,
  },
  {
    id: "saint-frank-polk",
    name: "Saint Frank · Polk",
    neighbourhood: "Russian Hill",
    address: "2340 Polk Street",
    lat: 37.7984855,
    lon: -122.4220547,
    note: "The Russian Hill flagship, just off the bustle of Polk Street.",
    hours: daily("07:00", "18:00"),
    source: saintFrank,
    checked,
  },
  {
    id: "saint-frank-sunset",
    name: "Saint Frank · Sunset",
    neighbourhood: "Inner Sunset",
    address: "744 Irving Street",
    lat: 37.7643079,
    lon: -122.4660279,
    note: "A neighbourhood stop on Irving, near Golden Gate Park.",
    hours: daily("07:00", "18:00"),
    source: saintFrank,
    checked,
  },
  {
    id: "sightglass-divisadero",
    name: "Sightglass · Divisadero",
    neighbourhood: "Lower Haight",
    address: "301 Divisadero Street",
    lat: 37.772304,
    lon: -122.437424,
    note: "A corner Victorian at Divisadero and Page.",
    hours: sightglassHours(),
    source: sightglass,
    checked,
  },
  {
    id: "sightglass-soma",
    name: "Sightglass · SoMa",
    neighbourhood: "SoMa",
    address: "270 7th Street",
    lat: 37.7770339,
    lon: -122.4084399,
    note: "Coffee bar and working roastery in the original 7th Street space.",
    hours: sightglassHours(),
    source: sightglass,
    checked,
  },
  {
    id: "verve-market",
    name: "Verve · Market Street",
    neighbourhood: "Duboce Triangle",
    address: "2101 Market Street",
    lat: 37.7670978,
    lon: -122.4291409,
    note: "Verve's San Francisco café on Market Street.",
    hours: daily("06:30", "17:00").map((h, day) =>
      day === 0 || day === 6 ? { open: "07:00", close: "17:30" } : h,
    ),
    source: "https://www.vervecoffee.com/pages/locations",
    checked,
  },
];
