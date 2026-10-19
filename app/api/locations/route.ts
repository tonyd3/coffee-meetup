import { NextRequest, NextResponse } from "next/server";
import { localPlaces } from "@/data/places";
import { isSF } from "@/lib/meeting";
import type { Place } from "@/lib/types";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 3 || query.length > 160)
    return NextResponse.json({ places: localPlaces(query) });
  const local = localPlaces(query);
  try {
    const url = new URL(
      "/api/",
      process.env.PHOTON_URL || "https://photon.komoot.io",
    );
    url.search = new URLSearchParams({
      q: query,
      limit: "5",
      lat: "37.77",
      lon: "-122.42",
      bbox: "-122.52,37.70,-122.35,37.83",
      lang: "en",
    }).toString();
    const response = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 86400 },
      headers: { "User-Agent": "CoffeeMeetup/0.1 (meet.tony-dong.com)" },
    });
    if (!response.ok) throw new Error("Location service unavailable");
    const data = await response.json();
    const remote: Place[] = (data.features ?? []).flatMap(
      (feature: {
        geometry?: { coordinates?: number[] };
        properties?: Record<string, string | number>;
      }) => {
        const [lon, lat] = feature.geometry?.coordinates ?? [];
        if (!isSF({ lat, lon })) return [];
        const p = feature.properties ?? {};
        const street = [p.housenumber, p.street].filter(Boolean).join(" ");
        const name = String(p.name || street || p.locality || "San Francisco");
        const detail = [
          ...new Set(
            [
              street !== name ? street : "",
              p.locality || p.district,
              "San Francisco",
            ].filter(Boolean),
          ),
        ].join(" · ");
        return [
          { id: `osm-${p.osm_type}-${p.osm_id}`, name, detail, lat, lon },
        ];
      },
    );
    return NextResponse.json({
      places: [...local, ...remote]
        .filter(
          (p, i, all) =>
            all.findIndex(
              (other) =>
                other.name.toLowerCase() === p.name.toLowerCase() &&
                Math.abs(other.lat - p.lat) < 0.002 &&
                Math.abs(other.lon - p.lon) < 0.002,
            ) === i,
        )
        .slice(0, 6),
    });
  } catch {
    return NextResponse.json({ places: local, unavailable: true });
  }
}
