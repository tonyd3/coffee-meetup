import { NextResponse } from "next/server";
import { cafes } from "@/data/cafes";
import { estimatedWalk, isSF } from "@/lib/meeting";
import type { Coordinates, RouteData } from "@/lib/types";

export async function POST(request: Request) {
  let sources: Coordinates[];
  try {
    const body = await request.json();
    if (
      !Array.isArray(body.sources) ||
      body.sources.length !== 2 ||
      !body.sources.every(isSF)
    )
      throw new Error("Invalid origins");
    sources = body.sources.map(({ lat, lon }: Coordinates) => ({ lat, lon }));
  } catch {
    return NextResponse.json(
      { error: "Choose two locations in San Francisco." },
      { status: 400 },
    );
  }
  try {
    const url = new URL(
      "/sources_to_targets",
      process.env.VALHALLA_URL || "https://valhalla1.openstreetmap.de",
    );
    url.searchParams.set(
      "json",
      JSON.stringify({
        sources,
        targets: cafes.map(({ lat, lon }) => ({ lat, lon })),
        costing: "pedestrian",
        units: "kilometers",
      }),
    );
    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 },
      headers: { "User-Agent": "CoffeeMeetup/0.1 (meet.tony-dong.com)" },
    });
    if (!response.ok) throw new Error("Walking routes unavailable");
    const data = await response.json();
    const matrix: { time?: number | null }[][] = data.sources_to_targets;
    if (
      !Array.isArray(matrix) ||
      matrix.length !== 2 ||
      matrix.some((row) => !Array.isArray(row) || row.length !== cafes.length)
    )
      throw new Error("Incomplete routes");
    const time = (row: number, col: number) => {
      const seconds = matrix[row][col]?.time;
      return typeof seconds === "number" &&
        Number.isFinite(seconds) &&
        seconds >= 0
        ? Math.max(1, Math.ceil(seconds / 60))
        : null;
    };
    return NextResponse.json({
      walks: cafes.map((cafe, index) => ({
        cafeId: cafe.id,
        you: time(0, index),
        them: time(1, index),
      })),
      estimated: false,
    } satisfies RouteData);
  } catch {
    return NextResponse.json({
      walks: cafes.map((cafe) => ({
        cafeId: cafe.id,
        you: estimatedWalk(sources[0], cafe),
        them: estimatedWalk(sources[1], cafe),
      })),
      estimated: true,
    } satisfies RouteData);
  }
}
