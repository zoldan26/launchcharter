import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { randomUUID } from "node:crypto";
import { saveLead } from "@/lib/db/store";
import { notify, notifyInternalOnly } from "@/lib/email/send";
import type { Lead, LeadInput } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Handles both the contact form and the corporate account request form. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send valid JSON." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the details and try again." },
      { status: 422 },
    );
  }

  const c = parsed.data;
  const lead: LeadInput = {
    kind: c.source === "corporate" ? "corporate" : "contact",
    firstName: c.firstName,
    lastName: c.lastName || "",
    phone: c.phone || "",
    email: c.email,
    company: c.company || null,
    tripType: null,
    pickup: null,
    dropoff: null,
    pickupAt: null,
    returnAt: null,
    durationHours: null,
    passengers: null,
    vehicleId: null,
    flightNumber: null,
    notes: c.notes,
    estimateCents: null,
    paymentStatus: null,
    paymentRef: null,
    source: c.source || "contact",
    referrer: c.referrer ?? null,
    utm: c.utm && Object.keys(c.utm).length ? c.utm : null,
  };

  try {
    const saved = await saveLead(lead);
    await notify(saved).catch((err) => console.error("[contact] notify failed", err));
    return NextResponse.json({ id: saved.id }, { status: 201 });
  } catch (err) {
    console.error("[contact] save failed", err);
    const rescued = await rescue(lead);
    if (!rescued) {
      return NextResponse.json({ error: "We could not send that. Please try again." }, { status: 500 });
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
