import { strict as assert } from "node:assert";
import { test } from "node:test";
import { POST } from "../app/api/routes/route";
import { cafes } from "../data/cafes";
import type { RouteData } from "../lib/types";

const sources = [
  { lat: 37.7763, lon: -122.4239 },
  { lat: 37.7955, lon: -122.3937 },
];
const request = (body: unknown) =>
  new Request("http://localhost/api/routes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

test("out-of-area and malformed origins fail without calling the route provider", async (t) => {
  const network = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected network call");
  });
  for (const body of [
    { sources: [] },
    { sources: [{ lat: 40.7, lon: -74 }, sources[1]] },
    null,
  ]) {
    assert.equal((await POST(request(body))).status, 400);
  }
  assert.equal(network.mock.callCount(), 0);
});

test("a routing outage returns usable results explicitly marked as estimates", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Service unavailable");
  });
  const response = await POST(request({ sources }));
  const data: RouteData = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.estimated, true);
  assert.equal(data.walks.length, cafes.length);
  assert.ok(
    data.walks.every(
      (w) =>
        Number.isFinite(w.you) &&
        w.you! > 0 &&
        Number.isFinite(w.them) &&
        w.them! > 0,
    ),
  );
});

test("live pedestrian matrix times are converted from seconds; unreachable pairs stay null", async (t) => {
  t.mock.method(globalThis, "fetch", async (input: string | URL | Request) => {
    const payload = JSON.parse(
      new URL(String(input)).searchParams.get("json")!,
    );
    assert.equal(payload.costing, "pedestrian");
    assert.deepEqual(payload.sources, sources);
    return Response.json({
      sources_to_targets: [
        cafes.map((_, i) => ({ time: i === 0 ? null : 121 })),
        cafes.map(() => ({ time: 60 })),
      ],
    });
  });
  const data: RouteData = await (await POST(request({ sources }))).json();
  assert.equal(data.estimated, false);
  assert.equal(data.walks[0].you, null);
  assert.equal(data.walks[1].you, 3);
  assert.equal(data.walks[1].them, 1);
});
