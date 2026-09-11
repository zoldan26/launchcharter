import type { TripType } from "./types";

/**
 * ---------------------------------------------------------------------------
 * PRICING
 * ---------------------------------------------------------------------------
 * Chartered Car has not supplied a rate card, so estimates are OFF. Every
 * request is confirmed and priced by the office, and the site says exactly
 * that rather than inventing a number.
 *
 * To switch estimates on:
 *   1. fill in `rates` below with real figures, in cents;
 *   2. set NEXT_PUBLIC_PRICING=on.
 * `estimate()` starts returning cents, the confirmation screen and the emails
 * show a range, and — if Stripe is also enabled — deposits and authorizations
 * are calculated from the same number. Nothing else has to change.
 * ---------------------------------------------------------------------------
 */

export const pricing = {
  currency: "USD",
  /** Percentage taken up front when PAYMENT_MODE is "deposit". */
  depositPercent: Number(process.env.STRIPE_DEPOSIT_PERCENT || 25),
  /** Estimates stay hidden until the business confirms rates. */
  estimatesEnabled: process.env.NEXT_PUBLIC_PRICING === "on",
  /**
   * The band shown around a computed figure, as a fraction. An estimate is an
   * estimate: tolls, waiting time and gratuity move the final number.
   */
  spread: 0.12,
} as const;

/** All figures in cents. Zero means "not configured". */
export const rates: Record<string, { baseCents: number; perMileCents: number; hourlyCents: number }> = {
  "executive-sedan": { baseCents: 0, perMileCents: 0, hourlyCents: 0 },
  "luxury-suv": { baseCents: 0, perMileCents: 0, hourlyCents: 0 },
  "executive-sprinter": { baseCents: 0, perMileCents: 0, hourlyCents: 0 },
};

type EstimateTrip = {
  tripType: TripType;
  durationHours?: number | null;
};

/**
 * Returns a cents figure, or null when the trip cannot be priced automatically
 * — which is the default today. Callers treat null as "quoted by the office",
 * so an unpriced trip is a normal path, not an error.
 *
 * `miles` comes from the Google Distance Matrix API once routing is wired up;
 * until then transfers have no distance and only hourly work can be computed.
 */
export function estimate(
  trip: EstimateTrip,
  vehicleId: string | null,
  miles: number | null,
): number | null {
  if (!pricing.estimatesEnabled) return null;
  if (!vehicleId) return null;

  const rate = rates[vehicleId];
  if (!rate) return null;

  if (trip.tripType === "hourly") {
    if (!rate.hourlyCents) return null;
    const hours = trip.durationHours ?? 0;
    if (hours <= 0) return null;
    return rate.hourlyCents * hours;
  }

  if (!rate.baseCents && !rate.perMileCents) return null;
  if (miles == null) return null;

  const oneWay = rate.baseCents + Math.round(rate.perMileCents * miles);
  return trip.tripType === "round-trip" ? oneWay * 2 : oneWay;
}

/** The range shown to a customer around an estimate. */
export function estimateRange(cents: number): { lowCents: number; highCents: number } {
  const low = Math.round((cents * (1 - pricing.spread)) / 500) * 500;
  const high = Math.round((cents * (1 + pricing.spread)) / 500) * 500;
  return { lowCents: low, highCents: high };
}

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: pricing.currency,
    maximumFractionDigits: 0,
  });
}
