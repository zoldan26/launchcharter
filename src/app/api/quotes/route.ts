import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validation";
import { randomUUID } from "node:crypto";
import { saveLead } from "@/lib/db/store";
import { notify, notifyInternalOnly } from "@/lib/email/send";
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

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the details and try again." },
      { status: 422 },
    );
  }

  const q = parsed.data;
  const lead: LeadInput = {
    kind: "quote",
    firstName: q.firstName,
    lastName: q.lastName || "",
    phone: q.phone,
    email: q.email,
    company: null,
    tripType: "one-way",
    pickup: q.pickup,
    dropoff: q.dropoff,
    pickupAt: `${q.date}T${q.time}`,
    returnAt: null,
    durationHours: null,
    passengers: q.passengers,
    vehicleId: q.vehicleId === "unsure" ? null : q.vehicleId,
    flightNumber: null,
    notes: q.notes || null,
    estimateCents: null,
    paymentStatus: null,
    paymentRef: null,
    source: q.source || "quote",
    referrer: q.referrer ?? null,
    utm: q.utm && Object.keys(q.utm).length ? q.utm : null,
  };

  try {
    const saved = await saveLead(lead);
    await notify(saved).catch((err) => console.error("[quotes] notify failed", err));
    return NextResponse.json({ id: saved.id }, { status: 201 });
  } catch (err) {
    console.error("[quotes] save failed", err);
    const rescued = await rescue(lead);
    if (!rescued) {
      return NextResponse.json({ error: "We could not send that request. Please call us instead." }, { status: 500 });
    }
    return NextResponse.json({ id: rescued.id }, { status: 201 });
  }
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
