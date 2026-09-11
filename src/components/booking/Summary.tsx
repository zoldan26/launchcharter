"use client";

import { getVehicle } from "@/lib/fleet";
import { formatLongDate, minutesToLabel, timeToMinutes } from "@/lib/availability";
import type { BookingState } from "./state";

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-rule py-3 last:border-b-0">
      <dt className="text-[0.8125rem] text-slate">{label}</dt>
      <dd className="text-[0.9375rem] text-ink">{value}</dd>
    </div>
  );
}

export function Summary({ state }: { state: BookingState }) {
  const { trip, customer } = state;
  const vehicle = getVehicle(state.vehicleId);
  const when = trip.date
    ? `${formatLongDate(trip.date)}${trip.time ? ` at ${minutesToLabel(timeToMinutes(trip.time))}` : ""}`
    : null;
  const back =
    trip.tripType === "round-trip" && trip.returnDate
      ? `${formatLongDate(trip.returnDate)}${
          trip.returnTime ? ` at ${minutesToLabel(timeToMinutes(trip.returnTime))}` : ""
        }`
      : null;

  const typeLabel =
    trip.tripType === "round-trip" ? "Round trip" : trip.tripType === "hourly" ? "Hourly" : "One way";

  return (
    <dl className="border border-rule px-4 sm:px-5">
      <Row label="Service" value={typeLabel} />
      <Row label="Pickup" value={trip.pickup} />
      <Row label="Destination" value={trip.tripType === "hourly" ? "As directed" : trip.dropoff} />
      <Row label="Date and time" value={when} />
      <Row label="Return" value={back} />
      <Row
        label="Duration"
        value={trip.tripType === "hourly" ? `${trip.durationHours} hours` : null}
      />
      <Row label="Passengers" value={`${trip.passengers}`} />
      <Row label="Vehicle" value={vehicle?.name ?? null} />
      <Row label="Flight" value={trip.flightNumber || null} />
      <Row label="Name" value={`${customer.firstName} ${customer.lastName}`.trim() || null} />
      <Row label="Phone" value={customer.phone || null} />
      <Row label="Email" value={customer.email || null} />
      <Row label="Company" value={customer.company || null} />
      <Row label="Instructions" value={customer.notes || null} />
    </dl>
  );
}
