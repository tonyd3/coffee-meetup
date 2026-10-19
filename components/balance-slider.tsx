"use client";
import { Slider } from "@base-ui/react/slider";
import { useState } from "react";
import { balanceLabels } from "@/lib/meeting";
import { Crossfade } from "./motion";

const descriptions = [
  "Keep your walk as short as possible.",
  "Give your starting point a little more weight.",
  "Keep the longer of your two walks as short as possible.",
  "Give their starting point a little more weight.",
  "Keep their walk as short as possible.",
];

// Adapted from Product's AutonomySlider: free pointer travel, five committed stops.
export function BalanceSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [held, setHeld] = useState<number | null>(null);
  const [glide, setGlide] = useState(false);
  const settling = held === null && glide;
  return (
    <div className="balance">
      <div className="field-heading">
        <label id="balance-label">Make it convenient</label>
        <span className="eyebrow small">ON FOOT</span>
      </div>
      <Slider.Root
        min={0}
        max={4}
        step={0.001}
        largeStep={1}
        value={held ?? value}
        thumbAlignment="edge"
        onValueChange={(next, details) => {
          const dragging = details.reason === "drag";
          setHeld(dragging ? next : null);
          setGlide(dragging || details.reason === "track-press");
          const landed =
            details.reason === "drag" || details.reason === "track-press"
              ? Math.round(next)
              : next <= 0
                ? 0
                : next >= 4
                  ? 4
                  : Math.min(
                      4,
                      Math.max(0, value + Math.sign(next - (held ?? value))),
                    );
          if (landed !== value) onChange(landed);
        }}
        onValueCommitted={() => setHeld(null)}
      >
        <Slider.Control
          className={`balance-control${settling ? " settling" : ""}`}
          onLostPointerCapture={() => setHeld(null)}
        >
          <Slider.Track className="balance-track">
            <span className="balance-stops" aria-hidden="true">
              {balanceLabels.map((label, index) => (
                <i key={label} style={{ left: `${index * 25}%` }} />
              ))}
            </span>
            <Slider.Indicator className="balance-fill" />
          </Slider.Track>
          <Slider.Thumb
            className="balance-thumb"
            aria-labelledby="balance-label"
            aria-describedby="balance-description"
            getAriaValueText={() => balanceLabels[value]}
          >
            <span />
          </Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
      <div className="balance-ends" aria-hidden="true">
        <span>Closer to you</span>
        <span>Closer to them</span>
      </div>
      <div className="balance-copy">
        <Crossfade value={balanceLabels[value]}>
          {balanceLabels[value]}
        </Crossfade>
        <div className="balance-descriptions">
          {descriptions.map((line, index) => (
            <p
              key={line}
              inert={index !== value}
              id={index === value ? "balance-description" : undefined}
              className={index === value ? "shown" : ""}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
