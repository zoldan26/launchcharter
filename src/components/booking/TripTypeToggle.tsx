"use client";

import type { TripType } from "@/lib/types";

const options: { value: TripType; label: string }[] = [
  { value: "one-way", label: "One way" },
  { value: "round-trip", label: "Round trip" },
  { value: "hourly", label: "Hourly" },
];

export function TripTypeToggle({
  value,
  onChange,
  tone = "light",
}: {
  value: TripType;
  onChange: (v: TripType) => void;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div role="radiogroup" aria-label="Trip type" className="grid grid-cols-3">
      {options.map((o, i) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={[
              "min-h-[3rem] px-2 text-[0.9375rem] transition-colors",
              "border",
              i === 0 ? "" : "-ml-px",
              selected
                ? dark
                  ? "z-10 border-paper bg-paper font-medium text-ink"
                  : "z-10 border-ink bg-ink font-medium text-paper"
                : dark
                  ? "border-white/25 text-paper/75 hover:text-paper"
                  : "border-rule text-slate hover:text-ink",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
