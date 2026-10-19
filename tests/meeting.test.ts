import { strict as assert } from "node:assert";
import { test } from "node:test";
import { cafes } from "../data/cafes";
import {
  availableMinutes,
  estimatedWalk,
  isSF,
  meetingInstant,
  nextDay,
  recommendations,
  sfToday,
} from "../lib/meeting";
import { calendarICS, googleCalendar } from "../lib/calendar";
import type { RouteData } from "../lib/types";
const cafe = cafes.find((c) => c.id === "movement-chinatown")!;
const monday = "2026-10-26",
  saturday = "2026-10-24";

test("meeting-time hours use the correct weekday and opening boundary", () => {
  assert.equal(availableMinutes(cafe, monday, "06:59"), 0);
  assert.equal(availableMinutes(cafe, monday, "07:00"), 420);
  assert.equal(availableMinutes(cafe, monday, "14:00"), 0);
  assert.equal(availableMinutes(cafe, saturday, "14:00"), 120);
});
test("exactly 30 minutes qualifies, 29 does not, and calendar duration fits closing", () => {
  const routes: RouteData = {
    estimated: false,
    walks: [{ cafeId: cafe.id, you: 10, them: 15 }],
  };
  assert.equal(recommendations([cafe], routes, monday, "13:31", 2).length, 0);
  const [result] = recommendations([cafe], routes, monday, "13:30", 2);
  assert.equal(result.remaining, 30);
  assert.equal(result.duration, 30);
  assert.equal(
    recommendations([cafe], routes, monday, "13:01", 2)[0].duration,
    59,
  );
  assert.equal(
    recommendations([cafe], routes, monday, "13:00", 2)[0].duration,
    60,
  );
});
test("balance changes ranking; equal balance minimises the longest walk", () => {
  const list = cafes.slice(0, 3);
  const routes: RouteData = {
    estimated: false,
    walks: list.map((c, i) => ({
      cafeId: c.id,
      you: [2, 15, 35][i],
      them: [35, 15, 2][i],
    })),
  };
  assert.equal(
    recommendations(list, routes, monday, "10:00", 0)[0].cafe.id,
    list[0].id,
  );
  assert.equal(
    recommendations(list, routes, monday, "10:00", 2)[0].cafe.id,
    list[1].id,
  );
  assert.equal(
    recommendations(list, routes, monday, "10:00", 4)[0].cafe.id,
    list[2].id,
  );
});
test("unreachable cafés never appear as zero-minute walks", () => {
  assert.deepEqual(
    recommendations(
      [cafe],
      { estimated: false, walks: [{ cafeId: cafe.id, you: null, them: 12 }] },
      monday,
      "10:00",
      2,
    ),
    [],
  );
});
test("calendar times use San Francisco DST regardless of the computer timezone", () => {
  assert.equal(
    meetingInstant("2026-10-26", "13:30").toISOString(),
    "2026-10-26T20:30:00.000Z",
  );
  assert.equal(
    meetingInstant("2026-11-02", "13:30").toISOString(),
    "2026-11-02T21:30:00.000Z",
  );
  assert.equal(
    meetingInstant("2027-03-15", "10:00").toISOString(),
    "2027-03-15T17:00:00.000Z",
  );
  assert.equal(sfToday(new Date("2026-10-27T03:00:00Z")), "2026-10-26");
});
test("calendar links and ICS end at closing when only 30 minutes remain", () => {
  const [result] = recommendations(
    [cafe],
    { estimated: false, walks: [{ cafeId: cafe.id, you: 5, them: 10 }] },
    monday,
    "13:30",
    2,
  );
  const url = new URL(googleCalendar(result, monday, "13:30"));
  assert.equal(
    url.searchParams.get("dates"),
    "20261026T203000Z/20261026T210000Z",
  );
  assert.equal(url.searchParams.get("ctz"), "America/Los_Angeles");
  const ics = calendarICS(result, monday, "13:30", "test-id");
  assert.match(ics, /DTEND:20261026T210000Z/);
  assert.match(ics, /LOCATION:.*\\,/);
  assert.ok(
    ics
      .split("\r\n")
      .every((line) => new TextEncoder().encode(line).length <= 75),
  );
});
test("day shortcuts preserve a matching date and cross month/year boundaries", () => {
  assert.equal(nextDay("2026-10-26", "weekend"), "2026-10-31");
  assert.equal(nextDay("2026-10-31", "weekend"), "2026-10-31");
  assert.equal(nextDay("2026-10-31", "weekday"), "2026-11-02");
  assert.equal(nextDay("2027-01-01", "weekend"), "2027-01-02");
});
test("coordinates reject invalid inputs and straight-line fallback is finite", () => {
  assert.ok(isSF({ lat: 37.78, lon: -122.42 }));
  for (const point of [
    null,
    {},
    { lat: NaN, lon: -122.42 },
    { lat: 40.7, lon: -74 },
    { lat: "37.78", lon: -122.42 },
  ])
    assert.equal(isSF(point), false);
  assert.ok(estimatedWalk({ lat: 37.78, lon: -122.42 }, cafe) > 0);
});
