"use client";
import { useEffect, useId, useRef, useState } from "react";
import { localPlaces, places } from "@/data/places";
import type { Place } from "@/lib/types";

export type LocationValue = { text: string; place: Place | null };
export function LocationField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Place[]>([]);
  const [active, setActive] = useState(-1);
  const [status, setStatus] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  useEffect(() => {
    if (!open || value.place) return;
    const query = value.text.trim();
    setActive(-1);
    if (query.length < 2) {
      setOptions(
        places.filter((p) =>
          [
            "hayes-valley",
            "ferry-building",
            "mission",
            "pacific-heights",
          ].includes(p.id),
        ),
      );
      setStatus("");
      return;
    }
    const local = localPlaces(query);
    setOptions(local);
    if (query.length < 3) {
      setStatus(local.length ? "" : "Keep typing to search San Francisco.");
      return;
    }
    setStatus("Searching San Francisco…");
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/locations?${new URLSearchParams({ q: query })}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Search unavailable");
        const data = await response.json();
        setOptions(data.places);
        setStatus(
          data.unavailable
            ? "Address search is unavailable. Try a neighbourhood."
            : data.places.length
              ? ""
              : "No matches. Try a nearby address or neighbourhood.",
        );
      } catch {
        if (!controller.signal.aborted)
          setStatus("Address search is unavailable. Try a neighbourhood.");
      }
    }, 450);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [value.text, value.place, open]);
  function choose(place: Place) {
    onChange({ text: place.name, place });
    setOpen(false);
    setStatus("");
    input.current?.focus();
  }
  return (
    <div className="location-field" ref={root}>
      <label htmlFor={id} className="field-heading">
        {label}
      </label>
      <div className={`location-input${value.place ? " selected" : ""}`}>
        <input
          ref={input}
          id={id}
          role="combobox"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={
            open && active >= 0 ? `${id}-option-${active}` : undefined
          }
          placeholder="Address or area"
          value={value.text}
          onFocus={() => {
            if (!value.place) setOpen(true);
          }}
          onChange={(event) => {
            onChange({ text: event.target.value, place: null });
            setOpen(true);
          }}
          onBlur={(event) => {
            if (!root.current?.contains(event.relatedTarget as Node))
              setOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              return;
            }
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              setActive((i) =>
                Math.max(
                  0,
                  Math.min(
                    options.length - 1,
                    i + (event.key === "ArrowDown" ? 1 : -1),
                  ),
                ),
              );
            }
            if (event.key === "Enter" && open) {
              event.preventDefault();
              if (options[active >= 0 ? active : 0])
                choose(options[active >= 0 ? active : 0]);
            }
          }}
        />
        {value.text && (
          <button
            type="button"
            className="clear-location"
            aria-label={`Clear location for ${label.toLowerCase()}`}
            onClick={() => {
              onChange({ text: "", place: null });
              setOpen(true);
              input.current?.focus();
            }}
          >
            ×
          </button>
        )}
      </div>
      <p className="location-detail">{value.place?.detail}</p>
      {open && (
        <div className="location-menu">
          <ul
            id={`${id}-list`}
            role="listbox"
            aria-label={`Suggestions for ${label.toLowerCase()}`}
          >
            {options.map((place, i) => (
              <li
                role="option"
                id={`${id}-option-${i}`}
                key={place.id}
                aria-selected={i === active}
                className={i === active ? "active" : ""}
                onPointerDown={(event) => {
                  event.preventDefault();
                  choose(place);
                }}
                onPointerMove={() => setActive(i)}
              >
                <span>{place.name}</span>
                <small>{place.detail}</small>
              </li>
            ))}
          </ul>
          {status && (
            <p className="search-status" role="status">
              {status}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
