import type { Place } from "@/lib/types";

// Neighbourhood origins are representative points, rather than street addresses.
export const places: Place[] = [
  {
    id: "castro",
    name: "Castro",
    detail: "Castro & 18th · neighbourhood centre",
    lat: 37.7609,
    lon: -122.435,
  },
  {
    id: "civic-center",
    name: "Civic Center",
    detail: "City Hall · San Francisco",
    lat: 37.7793,
    lon: -122.4193,
  },
  {
    id: "cole-valley",
    name: "Cole Valley",
    detail: "Cole & Carl · neighbourhood centre",
    lat: 37.7658,
    lon: -122.4499,
  },
  {
    id: "dogpatch",
    name: "Dogpatch",
    detail: "22nd & 3rd · neighbourhood centre",
    lat: 37.7577,
    lon: -122.3885,
  },
  {
    id: "ferry-building",
    name: "Ferry Building",
    detail: "1 Ferry Building · Embarcadero",
    lat: 37.7955,
    lon: -122.3937,
  },
  {
    id: "hayes-valley",
    name: "Hayes Valley",
    detail: "Hayes & Octavia · neighbourhood centre",
    lat: 37.7763,
    lon: -122.4239,
  },
  {
    id: "inner-richmond",
    name: "Inner Richmond",
    detail: "Clement & 6th · neighbourhood centre",
    lat: 37.7826,
    lon: -122.4646,
  },
  {
    id: "inner-sunset",
    name: "Inner Sunset",
    detail: "9th & Irving · neighbourhood centre",
    lat: 37.764,
    lon: -122.4667,
  },
  {
    id: "marina",
    name: "Marina",
    detail: "Chestnut & Fillmore · neighbourhood centre",
    lat: 37.8005,
    lon: -122.4368,
  },
  {
    id: "mission",
    name: "Mission District",
    detail: "Valencia & 20th · neighbourhood centre",
    lat: 37.7588,
    lon: -122.421,
  },
  {
    id: "mission-bay",
    name: "Mission Bay",
    detail: "4th & Mission Bay Boulevard · neighbourhood centre",
    lat: 37.771,
    lon: -122.39,
  },
  {
    id: "nob-hill",
    name: "Nob Hill",
    detail: "Huntington Park · neighbourhood centre",
    lat: 37.7915,
    lon: -122.4123,
  },
  {
    id: "noe-valley",
    name: "Noe Valley",
    detail: "24th & Noe · neighbourhood centre",
    lat: 37.7515,
    lon: -122.4317,
  },
  {
    id: "north-beach",
    name: "North Beach",
    detail: "Washington Square · neighbourhood centre",
    lat: 37.8003,
    lon: -122.4102,
  },
  {
    id: "pacific-heights",
    name: "Pacific Heights",
    detail: "Fillmore & California · neighbourhood centre",
    lat: 37.789,
    lon: -122.4338,
  },
  {
    id: "potrero-hill",
    name: "Potrero Hill",
    detail: "18th & Connecticut · neighbourhood centre",
    lat: 37.762,
    lon: -122.3971,
  },
  {
    id: "russian-hill",
    name: "Russian Hill",
    detail: "Polk & Union · neighbourhood centre",
    lat: 37.7984,
    lon: -122.4222,
  },
  {
    id: "salesforce",
    name: "Salesforce Tower",
    detail: "415 Mission Street · SoMa",
    lat: 37.7898,
    lon: -122.3966,
  },
  {
    id: "soma",
    name: "SoMa",
    detail: "4th & Folsom · neighbourhood centre",
    lat: 37.7822,
    lon: -122.4006,
  },
  {
    id: "union-square",
    name: "Union Square",
    detail: "Union Square · San Francisco",
    lat: 37.7879,
    lon: -122.4075,
  },
];
export function localPlaces(query: string) {
  const q = query.trim().toLowerCase();
  return q.length < 2
    ? []
    : places
        .filter((p) => `${p.name} ${p.detail}`.toLowerCase().includes(q))
        .slice(0, 5);
}
