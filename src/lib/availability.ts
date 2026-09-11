import { site } from "./site.config";

/**
 * Availability rules for the booking calendar.
 *
 * Everything here is deliberately pure and date-string based ("YYYY-MM-DD",
 * "HH:mm") so the client calendar and the server guard in the API routes run
 * the identical checks and can never disagree about what is bookable.
 *
 * Rules come from site.config with optional environment overrides, so the
 * office can change lead time or add a blackout date without a code change.
 * Moving these into a `booking_rules` table later only means changing
 * `getRules()` — no caller cares where the values come from.
 */

export type BookingRules = {
  minAdvanceHours: number;
  maxAdvanceDays: number;
  /** 0 = Sunday. */
  availableWeekdays: readonly number[];
  serviceWindow: { startMinutes: number; endMinutes: number };
  timeStepMinutes: number;
  blackoutDates: readonly string[];
  hourlyMinimumHours: number;
};

function envNumber(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function getRules(): BookingRules {
  const base = site.booking;
  return {
    minAdvanceHours: envNumber(process.env.NEXT_PUBLIC_MIN_ADVANCE_HOURS, base.minAdvanceHours),
    maxAdvanceDays: envNumber(process.env.NEXT_PUBLIC_MAX_ADVANCE_DAYS, base.maxAdvanceDays),
    availableWeekdays: base.availableWeekdays,
    serviceWindow: base.serviceWindow,
    timeStepMinutes: base.timeStepMinutes,
    blackoutDates: (process.env.NEXT_PUBLIC_BLACKOUT_DATES || "")
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean)
      .concat(base.blackoutDates),
    hourlyMinimumHours: base.hourlyMinimumHours,
  };
}

/* --- Date helpers -------------------------------------------------------- */

/** Local calendar date as "YYYY-MM-DD". Never uses UTC: a 1am pickup on the
 *  5th must not become the 4th for a customer east of Greenwich. */
export function toISODate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${`${h}`.padStart(2, "0")}:${`${m}`.padStart(2, "0")}`;
}

/** "7:45 AM" — how a time is written to a customer. */
export function minutesToLabel(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${`${m}`.padStart(2, "0")} ${period}`;
}

/** "Thursday, September 10, 2026" */
export function formatLongDate(iso: string): string {
  if (!iso) return "";
  return fromISODate(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** "Thu, Sep 10" — for summaries and confirmation lines. */
export function formatShortDate(iso: string): string {
  if (!iso) return "";
  return fromISODate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/* --- Availability -------------------------------------------------------- */

/** The earliest moment a pickup may be scheduled, given the notice required. */
export function earliestBookable(rules: BookingRules, now: Date = new Date()): Date {
  return new Date(now.getTime() + rules.minAdvanceHours * 60 * 60 * 1000);
}

/**
 * True when the business can serve any pickup on this date. A date is
 * available if it is a served weekday, not blacked out, inside the booking
 * horizon, and still has at least one time slot left after the notice window.
 */
export function isDateAvailable(
  iso: string,
  rules: BookingRules = getRules(),
  now: Date = new Date(),
): boolean {
  const date = fromISODate(iso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (date < today) return false;
  if (rules.blackoutDates.includes(iso)) return false;
  if (!rules.availableWeekdays.includes(date.getDay())) return false;

  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + rules.maxAdvanceDays);
  if (date > horizon) return false;

  // The last slot of the day may already be inside the notice window.
  const lastSlot = new Date(date);
  lastSlot.setHours(0, rules.serviceWindow.endMinutes, 0, 0);
  return lastSlot >= earliestBookable(rules, now);
}

/**
 * Pickup times the business can actually accept on a given date, as "HH:mm".
 * Slots inside the minimum-notice window are omitted rather than shown
 * disabled — an empty list is what makes the customer pick another day.
 */
export function availableTimes(
  iso: string,
  rules: BookingRules = getRules(),
  now: Date = new Date(),
): string[] {
  if (!iso || !isDateAvailable(iso, rules, now)) return [];

  const date = fromISODate(iso);
  const earliest = earliestBookable(rules, now);
  const { startMinutes, endMinutes } = rules.serviceWindow;
  const times: string[] = [];

  for (let m = startMinutes; m <= endMinutes; m += rules.timeStepMinutes) {
    const slot = new Date(date);
    slot.setHours(0, m, 0, 0);
    if (slot < earliest) continue;
    times.push(minutesToTime(m));
  }
  return times;
}

/**
 * Server-side guard. The calendar disables unavailable dates and times; this
 * repeats the check on submission so a stale page or a direct API call gets
 * the same answer, with a reason the customer can act on.
 */
export function validatePickup(
  iso: string,
  time: string,
  rules: BookingRules = getRules(),
  now: Date = new Date(),
): { ok: true } | { ok: false; reason: string } {
  if (!iso || !time) {
    return { ok: false, reason: "Choose a pickup date and time." };
  }

  const date = fromISODate(iso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (date < today) {
    return { ok: false, reason: "That pickup date has already passed." };
  }
  if (rules.blackoutDates.includes(iso)) {
    return { ok: false, reason: "We are not scheduling pickups on that date. Choose another day." };
  }
  if (!rules.availableWeekdays.includes(date.getDay())) {
    return { ok: false, reason: "We do not run pickups on that day of the week." };
  }

  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + rules.maxAdvanceDays);
  if (date > horizon) {
    return {
      ok: false,
      reason: `We take reservations up to ${rules.maxAdvanceDays} days ahead. Call us for anything further out.`,
    };
  }

  const minutes = timeToMinutes(time);
  if (minutes < rules.serviceWindow.startMinutes || minutes > rules.serviceWindow.endMinutes) {
    return { ok: false, reason: "That pickup time is outside our scheduling window." };
  }

  const pickup = fromISODate(iso);
  pickup.setHours(0, minutes, 0, 0);
  if (pickup < earliestBookable(rules, now)) {
    return {
      ok: false,
      reason: `Pickups need at least ${rules.minAdvanceHours} hours' notice. Call us and we will see what is free sooner.`,
    };
  }

  return { ok: true };
}
