"use client";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cafes } from "@/data/cafes";
import { places } from "@/data/places";
import {
  dateLabel,
  dayOfWeek,
  meetingInstant,
  nextDay,
  recommendations,
  sfToday,
  timeLabel,
} from "@/lib/meeting";
import type { RouteData } from "@/lib/types";
import { BalanceSlider } from "./balance-slider";
import { CafeResult } from "./cafe-result";
import { LocationField, type LocationValue } from "./location-field";
import { change, Reveal } from "./motion";

const EMPTY: LocationValue = { text: "", place: null };
export function Meetup({ initialDate }: { initialDate: string }) {
  const [you, setYou] = useState<LocationValue>(EMPTY);
  const [them, setThem] = useState<LocationValue>(EMPTY);
  const [balance, setBalance] = useState(2);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState("10:00");
  const [routes, setRoutes] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [excluded, setExcluded] = useState<string[]>([]);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const request = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const [today, setToday] = useState(initialDate);
  useEffect(() => {
    setToday(sfToday());
    try {
      const saved = JSON.parse(
        localStorage.getItem("meet-excluded-cafes") || "[]",
      );
      if (Array.isArray(saved))
        setExcluded(
          saved.filter(
            (id): id is string =>
              typeof id === "string" && cafes.some((c) => c.id === id),
          ),
        );
    } catch {
      /* Use the starter shortlist if storage is unavailable. */
    }
    return () => request.current?.abort();
  }, []);
  function changeOrigin(which: "you" | "them", value: LocationValue) {
    request.current?.abort();
    setLoading(false);
    setRoutes(null);
    setError("");
    setSelectedId(null);
    (which === "you" ? setYou : setThem)(value);
  }
  function toggleCafe(id: string) {
    const next = excluded.includes(id)
      ? excluded.filter((item) => item !== id)
      : [...excluded, id];
    setExcluded(next);
    setSelectedId(null);
    try {
      localStorage.setItem("meet-excluded-cafes", JSON.stringify(next));
    } catch {
      /* Selections still work for this visit. */
    }
  }
  async function findPlaces(first = you.place, second = them.place) {
    if (!first || !second) {
      setError("Choose a location from each suggestion list.");
      return;
    }
    if (!date || !time) {
      setError("Choose a meeting date and time.");
      return;
    }
    if (meetingInstant(date, time).getTime() <= Date.now()) {
      setError(
        "Choose a meeting time in the future. All times are San Francisco time.",
      );
      return;
    }
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError("");
    setSelectedId(null);
    try {
      const response = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources: [first, second] }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "Couldn’t find a walking route. Please try again.",
        );
      if (controller.signal.aborted) return;
      setRoutes(data);
      if (window.matchMedia("(max-width: 760px)").matches)
        setTimeout(
          () =>
            resultsRef.current?.scrollIntoView({
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
              block: "start",
            }),
          150,
        );
    } catch (e) {
      if (!controller.signal.aborted)
        setError(
          e instanceof Error
            ? e.message
            : "Couldn’t find a place. Please try again.",
        );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }
  function example() {
    const first = places.find((p) => p.id === "hayes-valley")!,
      second = places.find((p) => p.id === "ferry-building")!;
    setYou({ text: first.name, place: first });
    setThem({ text: second.name, place: second });
    void findPlaces(first, second);
  }
  function setMeetingDate(value: string) {
    setDate(value);
    setSelectedId(null);
    setError("");
  }
  const matches =
    routes && date && time
      ? recommendations(
          cafes.filter((c) => !excluded.includes(c.id)),
          routes,
          date,
          time,
          balance,
        )
      : [];
  const selected = matches.find((r) => r.cafe.id === selectedId) || matches[0];
  const alternatives = selected
    ? matches.filter((r) => r.cafe.id !== selected.cafe.id).slice(0, 2)
    : [];
  const weekend = dayOfWeek(date) === 0 || dayOfWeek(date) === 6;
  const inPast = Boolean(
    date && time && meetingInstant(date, time).getTime() <= Date.now(),
  );
  const shown = routes && !inPast && !loading && date && time;
  const activeCount = cafes.length - excluded.length;
  return (
    <>
      <div className="workspace">
        <section className="plan" aria-labelledby="plan-title">
          <div className="section-title">
            <h2 id="plan-title">The plan</h2>
            <span className="eyebrow">01</span>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void findPlaces();
            }}
          >
            <div className="origins">
              <LocationField
                letter="A"
                label="Your starting point"
                value={you}
                onChange={(value) => changeOrigin("you", value)}
              />
              <LocationField
                letter="B"
                label="Their starting point"
                value={them}
                onChange={(value) => changeOrigin("them", value)}
              />
            </div>
            <BalanceSlider
              value={balance}
              onChange={(value) => {
                setBalance(value);
                setSelectedId(null);
              }}
            />
            <div className="when-heading">
              <label htmlFor="meeting-date">When are you meeting?</label>
              <div className="day-shortcuts">
                <button
                  type="button"
                  aria-pressed={!weekend}
                  onClick={() =>
                    setMeetingDate(nextDay(date || today, "weekday"))
                  }
                >
                  Weekday
                </button>
                <span>/</span>
                <button
                  type="button"
                  aria-pressed={weekend}
                  onClick={() =>
                    setMeetingDate(nextDay(date || today, "weekend"))
                  }
                >
                  Weekend
                </button>
              </div>
            </div>
            <div className="date-time-row">
              <div>
                <label htmlFor="meeting-date" className="sr-only">
                  Meeting date
                </label>
                <input
                  id="meeting-date"
                  type="date"
                  required
                  min={today}
                  max={`${Number(today.slice(0, 4)) + 1}-12-31`}
                  value={date}
                  onChange={(event) => setMeetingDate(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="meeting-time" className="sr-only">
                  Meeting time
                </label>
                <input
                  id="meeting-time"
                  type="time"
                  required
                  value={time}
                  onChange={(event) => {
                    setTime(event.target.value);
                    setSelectedId(null);
                    setError("");
                  }}
                />
              </div>
            </div>
            <p className="time-hint">
              San Francisco time · At least 30 minutes before closing.
            </p>
            <Reveal open={Boolean(error) || Boolean(routes && inPast)}>
              <p className="form-error" role="alert">
                {error || "Choose a meeting time in the future."}
              </p>
            </Reveal>
            <Reveal open={activeCount === 0}>
              <p className="form-error">
                Include at least one café in the shortlist below.
              </p>
            </Reveal>
            <button
              className="primary find-button"
              type="submit"
              disabled={loading || activeCount === 0}
            >
              <span className={loading ? "loading-label" : ""}>
                {loading
                  ? "Finding your meeting spot…"
                  : routes
                    ? "Update walking routes"
                    : "Find a place"}
              </span>
              <span aria-hidden="true">{loading ? "···" : "↗"}</span>
            </button>
            {!routes && !loading && (
              <button
                type="button"
                className="example-button"
                onClick={example}
              >
                Try Hayes Valley & Ferry Building{" "}
                <span aria-hidden="true">→</span>
              </button>
            )}
            {routes && !loading && (
              <p className="live-hint">
                Move the slider or change the time to update your picks.
              </p>
            )}
          </form>
        </section>
        <section
          className="results"
          ref={resultsRef}
          aria-labelledby="results-title"
          aria-busy={loading}
        >
          <div className="section-title">
            <h2 id="results-title">A good place</h2>
            <span className="eyebrow">02</span>
          </div>
          <div
            className="results-announcement sr-only"
            role="status"
            aria-live="polite"
          >
            {loading
              ? "Finding walking routes."
              : shown
                ? matches.length
                  ? `${matches.length} ${matches.length === 1 ? "café" : "cafés"} available. ${selected.cafe.name} selected. ${selected.you} minutes for you, ${selected.them} for them.`
                  : "No cafés available for this meeting time."
                : ""}
          </div>
          <AnimatePresence initial={false} mode="wait">
            {shown && selected ? (
              <m.div
                key="results"
                className="results-content"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={change}
              >
                <p className="meeting-summary">
                  {dateLabel(date)} <span>·</span> {timeLabel(time)}
                </p>
                <AnimatePresence initial={false} mode="wait">
                  <m.div
                    key={selected.cafe.id}
                    initial={{ opacity: 0, filter: "blur(2px)", y: 4 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    exit={{ opacity: 0, filter: "blur(2px)" }}
                    transition={change}
                  >
                    <CafeResult
                      result={selected}
                      date={date}
                      time={time}
                      estimated={routes.estimated}
                    />
                  </m.div>
                </AnimatePresence>
                {alternatives.length > 0 && (
                  <div className="alternatives">
                    <h3 className="eyebrow">ALSO WORTH A LOOK</h3>
                    {alternatives.map((result) => (
                      <button
                        key={result.cafe.id}
                        type="button"
                        onClick={() => setSelectedId(result.cafe.id)}
                        className="alternative"
                      >
                        <span>
                          <strong>{result.cafe.name}</strong>
                          <small>
                            {result.cafe.neighbourhood}
                            {result.remaining < 60
                              ? ` · Closes in ${result.remaining} min`
                              : ""}
                          </small>
                        </span>
                        <span className="alternative-times">
                          {result.you} / {result.them}
                          <small>min walk ↗</small>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </m.div>
            ) : shown ? (
              <m.div
                key="no-results"
                className="empty-state no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={change}
              >
                <span className="empty-mark" aria-hidden="true">
                  ◷
                </span>
                <h3>No coffee at this hour.</h3>
                <p>
                  {activeCount === 0
                    ? "Your shortlist is empty. Include a café below to get started."
                    : "None of the cafés on your shortlist are open for 30 minutes at this time. Try an earlier time or another day."}
                </p>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setTime("10:00");
                    setMeetingDate(
                      nextDay(
                        new Date(
                          new Date(`${today}T12:00:00Z`).getTime() + 86400000,
                        )
                          .toISOString()
                          .slice(0, 10),
                        weekend ? "weekend" : "weekday",
                      ),
                    );
                  }}
                >
                  Try the next morning <span aria-hidden="true">→</span>
                </button>
              </m.div>
            ) : (
              <m.div
                key={loading ? "loading" : "empty"}
                className={`empty-state${loading ? " is-loading" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={change}
              >
                <div className="meeting-diagram" aria-hidden="true">
                  <svg viewBox="0 0 300 150" fill="none">
                    <circle cx="105" cy="75" r="63" />
                    <circle cx="195" cy="75" r="63" />
                    <path d="M62 75h176" strokeDasharray="2 5" />
                    <circle className="diagram-person" cx="62" cy="75" r="4" />
                    <circle className="diagram-person" cx="238" cy="75" r="4" />
                    <circle className="diagram-centre" cx="150" cy="75" r="6" />
                  </svg>
                  <span>You</span>
                  <span>Them</span>
                </div>
                <h3>
                  {loading ? (
                    "Finding your common ground."
                  ) : (
                    <>
                      Somewhere
                      <br />
                      <em>between.</em>
                    </>
                  )}
                </h3>
                <p>
                  {loading
                    ? "Checking the walk from both starting points."
                    : "A good coffee, a fair walk, and a little time to catch up."}
                </p>
                {!loading && (
                  <p className="empty-footnote">
                    Start with two places. We’ll take it from there.
                  </p>
                )}
              </m.div>
            )}
          </AnimatePresence>
        </section>
      </div>
      <section className="shortlist-section" aria-labelledby="shortlist-title">
        <button
          className="shortlist-toggle"
          type="button"
          aria-expanded={shortlistOpen}
          aria-controls="shortlist-content"
          onClick={() => setShortlistOpen(!shortlistOpen)}
        >
          <span>
            <span id="shortlist-title">The café shortlist</span>
            <small>
              {activeCount} {activeCount === 1 ? "place" : "places"}
            </small>
          </span>
          <span aria-hidden="true">{shortlistOpen ? "−" : "+"}</span>
        </button>
        <Reveal open={shortlistOpen}>
          <div id="shortlist-content" className="shortlist-content">
            <p>
              Choose the places you’d like to meet. Your selection stays in this
              browser.
            </p>
            <div className="shortlist-list">
              {cafes.map((cafe) => (
                <div className="shortlist-item" key={cafe.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={!excluded.includes(cafe.id)}
                      onChange={() => toggleCafe(cafe.id)}
                    />
                    <span>
                      <strong>{cafe.name}</strong>
                      <small>
                        {cafe.neighbourhood} · {cafe.address}
                      </small>
                      {cafe.hoursNote && <small>{cafe.hoursNote}</small>}
                    </span>
                  </label>
                  <a
                    href={cafe.source}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Check hours for ${cafe.name}`}
                  >
                    Hours ↗
                  </a>
                </div>
              ))}
            </div>
            <p className="shortlist-note">
              Regular hours checked 19 October 2026. Holiday hours and seating
              can vary.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
