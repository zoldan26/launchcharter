"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TripTypeToggle } from "@/components/booking/TripTypeToggle";
import { availableTimes, earliestBookable, getRules, minutesToLabel, timeToMinutes, toISODate } from "@/lib/availability";
import { track } from "@/lib/analytics";
import type { TripType } from "@/lib/types";

/**
 * The hero's start-a-booking panel. It collects only what is genuinely needed
 * to begin, then hands off to the full wizard, which opens on step two with
 * everything already filled in. Nobody has to hunt for how to book.
 */
export function HeroBooking() {
  const router = useRouter();
  const rules = useMemo(() => getRules(), []);
  const minDate = useMemo(() => toISODate(earliestBookable(rules)), [rules]);

  const [tripType, setTripType] = useState<TripType>("one-way");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const times = useMemo(() => (date ? availableTimes(date, rules) : []), [date, rules]);
  const hourly = tripType === "hourly";

  function start() {
    const params = new URLSearchParams({ tripType });
    if (pickup) params.set("pickup", pickup);
    if (dropoff && !hourly) params.set("dropoff", dropoff);
    if (date) params.set("date", date);
    if (time) params.set("time", time);
    track("book_ride_clicked", { location: "hero-panel" });
    router.push(`/book?${params.toString()}`);
  }

  return (
    <div className="border border-rule bg-paper p-5 sm:p-6">
      <h2 className="text-[1.0625rem] font-medium">Start your reservation</h2>
      <p className="mt-1 text-[0.875rem] text-slate">
        No account required. Request your ride in under a minute.
      </p>

      <div className="mt-5 grid gap-4">
        <TripTypeToggle value={tripType} onChange={setTripType} />

        <div>
          <label htmlFor="hero-pickup" className="field-label">
            Pickup location
          </label>
          <input
            id="hero-pickup"
            className="field"
            placeholder="Address, hotel or airport"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
        </div>

        {hourly ? null : (
          <div>
            <label htmlFor="hero-dropoff" className="field-label">
              Destination
            </label>
            <input
              id="hero-dropoff"
              className="field"
              placeholder="Address, venue or airport"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="hero-date" className="field-label">
              Date
            </label>
            <input
              id="hero-date"
              type="date"
              className="field"
              min={minDate}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
            />
          </div>
          <div>
            <label htmlFor="hero-time" className="field-label">
              Time
            </label>
            <select
              id="hero-time"
              className="field"
              value={time}
              disabled={!date}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">{date ? "Select" : "Pick a date"}</option>
              {times.map((t) => (
                <option key={t} value={t}>
                  {minutesToLabel(timeToMinutes(t))}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="button" className="btn btn-primary w-full" onClick={start}>
          Book a ride
        </button>
      </div>
    </div>
  );
}
