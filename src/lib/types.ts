/**
 * Shared domain types.
 *
 * `LeadInput` is the single shape every submission — booking, quote, contact,
 * corporate — is normalised into before it reaches storage or notifications.
 * One shape means one database table, one email template and, later, one admin
 * dashboard.
 */

export type TripType = "one-way" | "round-trip" | "hourly";

/** Vehicle ids come from lib/fleet.ts so categories can be added there alone. */
export type VehicleId = string;

export type LeadKind = "booking" | "quote" | "contact" | "corporate";

export type LeadStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "confirmed"
  | "completed"
  | "cancelled";

/** Null until payments are switched on; see lib/payments/stripe.ts. */
export type PaymentStatus = "none" | "authorized" | "deposit_paid" | "paid";

export type LeadInput = {
  kind: LeadKind;

  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string | null;

  tripType: TripType | null;
  pickup: string | null;
  dropoff: string | null;
  /** Local date and time, "YYYY-MM-DDTHH:mm". Not UTC: trips are local events. */
  pickupAt: string | null;
  returnAt: string | null;
  durationHours: number | null;
  passengers: number | null;
  vehicleId: VehicleId | null;
  flightNumber: string | null;
  notes: string | null;

  /** Cents. Null whenever the office quotes the trip by hand. */
  estimateCents: number | null;
  paymentStatus: PaymentStatus | null;
  paymentRef: string | null;

  /** Attribution, captured client-side from utm params and the referrer. */
  source: string;
  referrer: string | null;
  utm: Record<string, string> | null;
};

export type Lead = LeadInput & {
  id: string;
  status: LeadStatus;
  createdAt: string;
};
