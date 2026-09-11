"use client";

import { AddressField } from "./AddressField";
import { DatePicker } from "./DatePicker";
import { TimeSelect } from "./TimeSelect";
import { TripTypeToggle } from "./TripTypeToggle";
import type { TripState } from "./state";
import { site } from "@/lib/site.config";

const looksLikeAirport = (s: string) => /airport|cmh|john glenn|terminal/i.test(s);

export function StepTrip({
  trip,
  set,
  errors,
}: {
  trip: TripState;
  set: (patch: Partial<TripState>) => void;
  errors: Record<string, string>;
}) {
  const hourly = trip.tripType === "hourly";
  const roundTrip = trip.tripType === "round-trip";
  const airport = looksLikeAirport(trip.pickup) || looksLikeAirport(trip.dropoff);

  return (
    <div className="grid gap-6">
      <TripTypeToggle value={trip.tripType} onChange={(tripType) => set({ tripType })} />

      <div className="grid gap-5 sm:grid-cols-2">
        <AddressField
          name="pickup"
          label="Pickup location"
          placeholder="Address, hotel or airport"
          value={trip.pickup}
          error={errors.pickup}
          onChange={(pickup) => set({ pickup })}
        />
        {hourly ? (
          <div>
            <label htmlFor="duration" className="field-label">
              How many hours
            </label>
            <select
              id="duration"
              className="field"
              value={trip.durationHours}
              onChange={(e) => set({ durationHours: Number(e.target.value) })}
            >
              {Array.from({ length: 13 }, (_, i) => i + site.booking.hourlyMinimumHours)
                .filter((h) => h <= 16)
                .map((h) => (
                  <option key={h} value={h}>
                    {h} hours
                  </option>
                ))}
            </select>
            <p className="mt-2 text-[0.8125rem] text-slate">
              Hourly service starts at {site.booking.hourlyMinimumHours} hours. Add your stops in the
              next step.
            </p>
          </div>
        ) : (
          <AddressField
            name="dropoff"
            label="Destination"
            placeholder="Address, venue or airport"
            value={trip.dropoff}
            error={errors.dropoff}
            onChange={(dropoff) => set({ dropoff })}
          />
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_18rem]">
        <DatePicker
          value={trip.date}
          error={errors.date}
          onChange={(date) => set({ date, time: "" })}
        />
        <div className="grid content-start gap-5">
          <TimeSelect
            date={trip.date}
            value={trip.time}
            error={errors.time}
            onChange={(time) => set({ time })}
          />
          <div>
            <label htmlFor="passengers" className="field-label">
              Passengers
            </label>
            <select
              id="passengers"
              className="field"
              value={trip.passengers}
              onChange={(e) => set({ passengers: Number(e.target.value) })}
            >
              {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "passenger" : "passengers"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {roundTrip ? (
        <fieldset className="grid gap-5 border-t border-rule pt-6 sm:grid-cols-2">
          <legend className="sr-only">Return trip</legend>
          <DatePicker
            label="Return date"
            value={trip.returnDate}
            minISO={trip.date || undefined}
            error={errors.returnDate}
            onChange={(returnDate) => set({ returnDate, returnTime: "" })}
          />
          <div className="content-start">
            <TimeSelect
              label="Return time"
              date={trip.returnDate}
              value={trip.returnTime}
              error={errors.returnTime}
              onChange={(returnTime) => set({ returnTime })}
            />
          </div>
        </fieldset>
      ) : null}

      {airport ? (
        <div className="border-t border-rule pt-6">
          <div className="sm:max-w-xs">
            <label htmlFor="flight" className="field-label">
              Flight number (optional)
            </label>
            <input
              id="flight"
              className="field"
              placeholder="DL 1422"
              autoCapitalize="characters"
              value={trip.flightNumber}
              onChange={(e) => set({ flightNumber: e.target.value })}
            />
          </div>
          <p className="mt-2 text-[0.8125rem] text-slate">
            Add the flight and your driver plans around it rather than the scheduled time.
          </p>
        </div>
      ) : null}
    </div>
  );
}
