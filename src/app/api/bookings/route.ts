import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { validatePickup } from "@/lib/availability";
import { randomUUID } from "node:crypto";
import { saveLead } from "@/lib/db/store";
import { notify, notifyInternalOnly } from "@/lib/email/send";
import { estimate } from "@/lib/pricing";
import { preparePayment, paymentsEnabled } from "@/lib/payments/stripe";
import type { Lead, LeadInput } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send valid JSON." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the details and try again." },
      { status: 422 },
    );
  }

  const { trip, vehicleId, customer, source, referrer, utm } = parsed.data;

  // The calendar disables unavailable slots; this is the matching server guard.
  const check = validatePickup(trip.date, trip.time);
  if (!check.ok) return NextResponse.json({ error: check.reason }, { status: 422 });

  if (trip.tripType === "round-trip" && trip.returnDate && trip.returnTime) {
    const back = validatePickup(trip.returnDate, trip.returnTime);
    if (!back.ok) return NextResponse.json({ error: back.reason }, { status: 422 });
  }

  // Distance-based pricing stays null until a rate card and a Maps key exist.
  const estimateCents = estimate(trip, vehicleId, null);

  const lead: LeadInput = {
    kind: "booking",
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,
    email: customer.email,
    company: customer.company || null,
    tripType: trip.tripType,
    pickup: trip.pickup,
    dropoff: trip.tripType === "hourly" ? null : trip.dropoff,
    pickupAt: `${trip.date}T${trip.time}`,
    returnAt:
      trip.tripType === "round-trip" && trip.returnDate && trip.returnTime
        ? `${trip.returnDate}T${trip.returnTime}`
        : null,
    durationHours: trip.tripType === "hourly" ? (trip.durationHours ?? null) : null,
    passengers: trip.passengers,
    vehicleId,
    flightNumber: trip.flightNumber || null,
    notes: customer.notes || null,
    estimateCents,
    paymentStatus: paymentsEnabled() ? "none" : null,
    paymentRef: null,
    source: source || "booking",
    referrer: referrer ?? null,
    utm: utm && Object.keys(utm).length ? utm : null,
  };

  let saved;
  try {
    saved = await saveLead(lead);
  } catch (err) {
    console.error("[bookings] save failed", err);
    const rescued = await rescue(lead);
    if (!rescued) {
      return NextResponse.json(
        { error: "We could not save that request. Call us and we will take it directly." },
        { status: 500 },
      );
    }
    // The office has the booking by email even though the database is down.
    return NextResponse.json({ id: rescued.id, payment: null }, { status: 201 });
  }

  // Notifications must never fail the request: the lead is already persisted.
  await notify(saved).catch((err) => console.error("[bookings] notify failed", err));

  // Returns null while PAYMENT_MODE=off. The client already handles both cases.
  let payment = null;
  try {
    payment = await preparePayment(saved);
  } catch (err) {
    console.error("[bookings] payment setup failed", err);
  }

  return NextResponse.json({ id: saved.id, payment }, { status: 201 });
}

/**
 * If the database write fails, the lead is not lost: we email it to the office
 * directly and only report failure to the customer if even that does not land.
 * A booking request is revenue — it must not evaporate because of an outage.
 */
async function rescue(lead: LeadInput): Promise<Lead | null> {
  const stamped: Lead = {
    ...lead,
    id: randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  const delivered = await notifyInternalOnly(stamped);
  return delivered ? stamped : null;
}
