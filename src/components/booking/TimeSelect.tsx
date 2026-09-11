"use client";

import { useId, useMemo } from "react";
import { availableTimes, getRules, minutesToLabel, timeToMinutes } from "@/lib/availability";

/**
 * Pickup time. A native <select> on purpose: iOS and Android render it as the
 * system wheel picker, which is faster to use than any custom control, and it
 * can only ever offer times the business actually accepts.
 */
export function TimeSelect({
  label = "Pickup time",
  date,
  value,
  onChange,
  error,
}: {
  label?: string;
  date: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const id = useId();
  const options = useMemo(() => (date ? availableTimes(date, getRules()) : []), [date]);

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select
        id={id}
        className="field"
        value={value}
        disabled={!date}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{date ? "Select a time" : "Choose a date first"}</option>
        {options.map((t) => (
          <option key={t} value={t}>
            {minutesToLabel(timeToMinutes(t))}
          </option>
        ))}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  );
}
