"use client";

import { useMemo, useState } from "react";
import {
  formatLongDate,
  fromISODate,
  getRules,
  isDateAvailable,
  toISODate,
} from "@/lib/availability";

const DAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * Month calendar. Days the business cannot serve — blackout dates, closed
 * weekdays, anything inside the minimum notice window — are disabled here and
 * re-checked on the server, so the two can never disagree.
 */
export function DatePicker({
  value,
  onChange,
  label = "Pickup date",
  minISO,
  error,
}: {
  value: string;
  onChange: (iso: string) => void;
  label?: string;
  minISO?: string;
  error?: string;
}) {
  const rules = useMemo(() => getRules(), []);
  const today = useMemo(() => new Date(), []);
  const initial = value ? fromISODate(value) : today;
  const [cursor, setCursor] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstWeekday = cursor.getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();

  const prevDisabled =
    cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth();

  function shift(delta: number) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  }

  const cells: (string | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      toISODate(new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
    ),
  ];

  function available(iso: string) {
    if (minISO && iso < minISO) return false;
    return isDateAvailable(iso, rules, today);
  }

  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="border border-rule bg-paper p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shift(-1)}
            disabled={prevDisabled}
            aria-label="Previous month"
            className="flex h-10 w-10 items-center justify-center border border-rule text-ink disabled:opacity-30"
          >
            <span aria-hidden>‹</span>
          </button>
          <span aria-live="polite" className="text-[0.9375rem] font-medium">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="flex h-10 w-10 items-center justify-center border border-rule text-ink"
          >
            <span aria-hidden>›</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1" role="grid" aria-label={`${monthLabel} calendar`}>
          {DAY_INITIALS.map((d, i) => (
            <div
              key={i}
              aria-hidden
              className="pb-1 text-center text-[0.6875rem] font-medium text-slate"
            >
              {d}
            </div>
          ))}
          {cells.map((iso, i) => {
            if (!iso) return <div key={`pad-${i}`} />;
            const day = Number(iso.slice(-2));
            const selected = iso === value;
            const ok = available(iso);
            return (
              <button
                key={iso}
                type="button"
                disabled={!ok}
                aria-pressed={selected}
                aria-label={formatLongDate(iso)}
                onClick={() => onChange(iso)}
                className={[
                  "flex aspect-square min-h-[2.5rem] items-center justify-center rounded-[2px] text-[0.9375rem] transition-colors",
                  selected
                    ? "bg-ink font-medium text-paper"
                    : ok
                      ? "text-ink hover:bg-bone"
                      : "cursor-not-allowed text-mist",
                ].join(" ")}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
      {error ? <span className="field-error">{error}</span> : null}
      {value ? (
        <p className="mt-2 text-[0.8125rem] text-slate">{formatLongDate(value)}</p>
      ) : (
        <p className="mt-2 text-[0.8125rem] text-slate">
          Pickups need at least {rules.minAdvanceHours} hours&rsquo; notice.
        </p>
      )}
    </div>
  );
}
