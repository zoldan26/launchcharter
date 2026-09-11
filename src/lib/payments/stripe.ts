import "server-only";
import { pricing } from "../pricing";
import type { Lead } from "../types";

/**
 * Payments, inactive by default.
 *
 * The booking flow calls `preparePayment()` after the lead is saved. While
 * PAYMENT_MODE is "off" it returns null and the customer simply gets a
 * reservation request, which is how the site ships today. Setting PAYMENT_MODE
 * to full | authorization | deposit and adding STRIPE_SECRET_KEY turns on
 * Stripe without touching the booking UI or the database schema — the lead
 * already carries payment_status and payment_ref columns.
 */
export type PaymentMode = "off" | "full" | "authorization" | "deposit";

export const paymentMode = (process.env.PAYMENT_MODE || "off") as PaymentMode;

export type PaymentIntentResult = {
  clientSecret: string;
  amountCents: number;
  mode: Exclude<PaymentMode, "off">;
};

export function paymentsEnabled(): boolean {
  return paymentMode !== "off" && Boolean(process.env.STRIPE_SECRET_KEY);
}

function amountFor(estimateCents: number): number {
  if (paymentMode === "deposit") {
    return Math.round((estimateCents * pricing.depositPercent) / 100);
  }
  return estimateCents;
}

export async function preparePayment(lead: Lead): Promise<PaymentIntentResult | null> {
  if (!paymentsEnabled()) return null;
  if (!lead.estimateCents || lead.estimateCents <= 0) return null;

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = amountFor(lead.estimateCents);
  const intent = await stripe.paymentIntents.create({
    amount,
    currency: pricing.currency.toLowerCase(),
    // "authorization" holds the card without capturing until the trip is done.
    capture_method: paymentMode === "authorization" ? "manual" : "automatic",
    receipt_email: lead.email,
    description: `${lead.kind} ${lead.id.slice(0, 8)} — ${lead.pickup ?? ""}`,
    metadata: {
      lead_id: lead.id,
      trip_type: lead.tripType ?? "",
      vehicle_id: lead.vehicleId ?? "",
      payment_mode: paymentMode,
    },
  });

  return {
    clientSecret: intent.client_secret!,
    amountCents: amount,
    mode: paymentMode as Exclude<PaymentMode, "off">,
  };
}
