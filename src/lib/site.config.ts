/**
 * ---------------------------------------------------------------------------
 * CHARTERED CAR — SITE CONFIGURATION
 * ---------------------------------------------------------------------------
 * Every business fact the site displays lives here. Nothing about the company
 * is hard-coded into a component.
 *
 * Values marked TODO are placeholders. They have NOT been supplied by the
 * business and must be replaced before launch. Anything that is still a
 * placeholder is either hidden from the page or rendered as an obvious
 * bracketed value so it can never be mistaken for a real detail.
 * ---------------------------------------------------------------------------
 */

export const PLACEHOLDER = "__TODO__" as const;

/** True when a config value has not been supplied yet. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || value === PLACEHOLDER || value.startsWith("[");
}

export const site = {
  name: "Chartered Car",
  legalName: "Chartered Car", // TODO: replace with registered entity name if different
  tagline: "Private transportation. Professionally driven.",
  description:
    "Premium black car service throughout Columbus and Central Ohio for airport transfers, corporate transportation, events, hourly service, and private travel.",

  /** Canonical production origin. Set NEXT_PUBLIC_SITE_URL in the environment. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://charteredcar.com", // TODO: confirm domain

  contact: {
    /** TODO: replace with the real reservations line. Digits only in `phoneRaw`. */
    phone: process.env.NEXT_PUBLIC_PHONE || "[Phone number]",
    phoneRaw: process.env.NEXT_PUBLIC_PHONE_RAW || "",
    /** TODO: replace with the real reservations inbox. */
    email: process.env.NEXT_PUBLIC_EMAIL || "[Email address]",
    /**
     * TODO: confirm hours before publishing. The brief is explicit that
     * "Reservations available 24/7" may only appear if the business confirms it.
     * Set to a string to display; leave null to omit the line entirely.
     */
    hours: null as string | null,
    /** TODO: add a street address only if the business operates a public office. */
    address: null as null | {
      street: string;
      city: string;
      region: string;
      postalCode: string;
    },
  },

  /** Geographic centre used for LocalBusiness schema — downtown Columbus. */
  geo: { lat: 39.9612, lng: -82.9988 },

  area: {
    city: "Columbus",
    region: "Ohio",
    regionCode: "OH",
    country: "US",
    radiusMiles: 60,
  },

  /** Only real, verified accounts belong here. Empty array renders no icons. */
  social: [] as { label: string; href: string }[],

  /** Legal/operating credentials. Leave empty unless documented by the business. */
  credentials: [] as string[],

  booking: {
    /** Minimum lead time, in hours, between "now" and a pickup. */
    minAdvanceHours: 4,
    /** How far ahead the calendar will accept reservations. */
    maxAdvanceDays: 365,
    /** 0 = Sunday. Days the business accepts pickups. */
    availableWeekdays: [0, 1, 2, 3, 4, 5, 6],
    /** Earliest and latest pickup time offered, in 24h minutes from midnight. */
    serviceWindow: { startMinutes: 0, endMinutes: 24 * 60 - 30 },
    /** Pickup times are offered on this interval, in minutes. */
    timeStepMinutes: 15,
    /** ISO dates (YYYY-MM-DD) the business will not accept pickups. */
    blackoutDates: [] as string[],
    /** Minimum billable duration for hourly service. */
    hourlyMinimumHours: 3,
  },
} as const;

export type Site = typeof site;
