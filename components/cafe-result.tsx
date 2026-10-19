"use client";
import { useState } from "react";
import { calendarICS, googleCalendar } from "@/lib/calendar";
import { dayOfWeek, timeLabel } from "@/lib/meeting";
import type { Recommendation } from "@/lib/types";
import { Reveal } from "./motion";

export function mapLink(result: Recommendation) {
  return `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query: `${result.cafe.name} ${result.cafe.address} San Francisco` })}`;
}
export function CafeResult({
  result,
  date,
  time,
  estimated,
}: {
  result: Recommendation;
  date: string;
  time: string;
  estimated: boolean;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const hours = result.cafe.hours[dayOfWeek(date)]!;
  function download() {
    const url = URL.createObjectURL(
      new Blob([calendarICS(result, date, time)], {
        type: "text/calendar;charset=utf-8",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "coffee-meetup.ics";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <article className="cafe-result">
      <div className="result-topline">
        <span className="eyebrow">YOUR MEETING SPOT</span>
        <span className="result-neighbourhood">
          {result.cafe.neighbourhood}
        </span>
      </div>
      <h2>{result.cafe.name}</h2>
      <a
        className="address-link"
        href={mapLink(result)}
        target="_blank"
        rel="noreferrer"
      >
        {result.cafe.address}
        <span aria-hidden="true">↗</span>
      </a>
      <p className="cafe-note">{result.cafe.note}</p>
      <div className="walks" aria-label="Walking times">
        <div>
          <span className="eyebrow">YOU</span>
          <p>
            <strong>{result.you}</strong>
            <span>min walk</span>
          </p>
        </div>
        <span className="walk-connector" aria-hidden="true">
          <i />
          ······<span>↔</span>······
          <i />
        </span>
        <div>
          <span className="eyebrow">THEM</span>
          <p>
            <strong>{result.them}</strong>
            <span>min walk</span>
          </p>
        </div>
      </div>
      {estimated && (
        <p className="estimate-note">
          Estimated walks. Live routing is unavailable; hills and street routes
          may take longer.
        </p>
      )}
      <div className="hours-row">
        <span>
          <i className="open-dot" />
          Open at {timeLabel(time)}
        </span>
        <span>
          {timeLabel(hours.open)}–{timeLabel(hours.close)}
        </span>
      </div>
      <Reveal open={result.remaining < 60}>
        <p className="closing-warning">
          <span aria-hidden="true">◷</span>Closes at {timeLabel(hours.close)} —
          you’ll have {result.remaining} minutes together.
        </p>
      </Reveal>
      <div className="calendar-section">
        <button
          type="button"
          className="primary calendar-button"
          aria-expanded={calendarOpen}
          onClick={() => setCalendarOpen(!calendarOpen)}
        >
          Add to calendar
          <span aria-hidden="true">{calendarOpen ? "−" : "+"}</span>
        </button>
        <Reveal open={calendarOpen}>
          <div className="calendar-options">
            <p>
              {result.duration}-minute coffee, starting at {timeLabel(time)}.
            </p>
            <a
              href={googleCalendar(result, date, time)}
              target="_blank"
              rel="noreferrer"
            >
              Google Calendar <span aria-hidden="true">↗</span>
            </a>
            <button type="button" onClick={download}>
              Apple Calendar / Outlook <span aria-hidden="true">↓</span>
            </button>
          </div>
        </Reveal>
      </div>
      <p className="hours-note">
        Regular hours ·{" "}
        <a href={result.cafe.source} target="_blank" rel="noreferrer">
          Check holiday hours ↗
        </a>
      </p>
    </article>
  );
}
