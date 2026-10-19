import type { Cafe, Hours } from "@/lib/types";

const daily = (open: string, close: string): Hours[] =>
  Array.from({ length: 7 }, () => ({ open, close }));
const checked = "2026-10-19";
const saintFrank = "https://www.saintfrankcoffee.com/pages/our-locations";
const sightglass = "https://sightglasscoffee.com/pages/our-cafes";
const movement = "https://www.thecoffeemovement.com/";
const sightglassHours = () =>
  daily("06:30", "17:00").map((h, day) =>
    day === 0 || day === 6 ? { ...h, open: "07:00" } : h,
  );
const movementHours = () =>
  daily("07:00", "14:00").map((h, day) =>
    day === 0 || day === 6 ? { ...h, close: "16:00" } : h,
  );

// Starter shortlist, not Tony's personal endorsements. Replace or extend this array.
// Hours come from the linked official sites; coordinates from OpenStreetMap via Photon.
export const cafes: Cafe[] = [
  {
    id: "ritual-valencia",
    name: "Ritual Coffee",
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
    id: "movement-chinatown",
    name: "The Coffee Movement · Chinatown",
    neighbourhood: "Chinatown",
    address: "1030 Washington Street",
    lat: 37.7947543,
    lon: -122.4103018,
    note: "A small coffee bar on Washington Street. Check seating if you plan to stay.",
    hours: movementHours(),
    source: movement,
    checked,
  },
  {
    id: "movement-richmond",
    name: "The Coffee Movement · Richmond",
    neighbourhood: "Inner Richmond",
    address: "1737 Balboa Street",
    lat: 37.7764869,
    lon: -122.477665,
    note: "The Coffee Movement's Balboa Street location.",
    hours: movementHours(),
    source: movement,
    checked,
  },
];
