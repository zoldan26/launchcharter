import { z } from "zod";
import { site } from "./site.config";

/**
 * One set of schemas, used on both sides.
 *
 * The forms parse with these before a request is made, so a customer sees the
 * problem next to the field instead of after a round trip; the API routes parse
 * the same schemas again, because a form is not a security boundary.
 *
 * Error messages are written to be read by a customer: what is wrong and what
 * to do, never "invalid input".
 */

const trimmed = z.string().trim();

const phone = trimmed
  .min(10, "Enter a phone number we can reach you on")
  .max(24, "That phone number looks too long")
  .regex(/^[\d\s()+.\-]+$/, "Enter a phone number using digits only");

const email = trimmed
  .min(1, "Enter an email address")
  .email("Enter an email address we can send the confirmation to")
  .max(160);

/** "" and null both become null, so client and server parses agree. */
const optionalText = (max = 240) =>
  z
    .union([z.string(), z.null()])
    .optional()
    .transform((v) => (typeof v === "string" ? v.trim() || null : null))
    .pipe(z.string().max(max).nullable());

const isoDate = trimmed.regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date");
const isoTime = trimmed.regex(/^\d{2}:\d{2}$/, "Choose a time");

export const tripTypeSchema = z.enum(["one-way", "round-trip", "hourly"]);

/* --- Trip ---------------------------------------------------------------- */

export const tripSchema = z
  .object({
    tripType: tripTypeSchema,
    pickup: trimmed.min(3, "Enter a pickup address").max(240),
    dropoff: optionalText(),
    date: isoDate,
    time: isoTime,
    returnDate: z.union([isoDate, z.literal(""), z.null()]).optional(),
    returnTime: z.union([isoTime, z.literal(""), z.null()]).optional(),
    durationHours: z.coerce
      .number()
      .int("Choose a whole number of hours")
      .min(1)
      .max(24, "For more than 24 hours, call us and we will plan it with you")
      .optional(),
    passengers: z.coerce
      .number()
      .int()
      .min(1, "At least one passenger")
      .max(14, "For more than 14 passengers we will arrange multiple vehicles — call us"),
    flightNumber: optionalText(16),
  })
  .superRefine((trip, ctx) => {
    if (trip.tripType !== "hourly" && !trip.dropoff) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dropoff"],
        message: "Enter where you are going",
      });
    }

    if (trip.tripType === "round-trip") {
      if (!trip.returnDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["returnDate"],
          message: "Choose a return date",
        });
      }
      if (!trip.returnTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["returnTime"],
          message: "Choose a return time",
        });
      }
      if (
        trip.returnDate &&
        trip.returnTime &&
        `${trip.returnDate}T${trip.returnTime}` <= `${trip.date}T${trip.time}`
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["returnDate"],
          message: "The return needs to be after the pickup",
        });
      }
    }

    if (trip.tripType === "hourly") {
      const minimum = site.booking.hourlyMinimumHours;
      if (!trip.durationHours || trip.durationHours < minimum) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["durationHours"],
          message: `Hourly service starts at ${minimum} hours`,
        });
      }
    }
  });

/* --- Customer ------------------------------------------------------------ */

export const customerSchema = z.object({
  firstName: trimmed.min(1, "Enter your first name").max(60),
  lastName: trimmed.min(1, "Enter your last name").max(60),
  phone,
  email,
  company: optionalText(120),
  notes: optionalText(2000),
});

/* --- Attribution --------------------------------------------------------- */

const attribution = {
  source: trimmed.max(120).optional(),
  referrer: z.union([z.string().max(500), z.null()]).optional(),
  utm: z.record(z.string().max(200)).optional(),
};

/* --- Requests ------------------------------------------------------------ */

export const bookingSchema = z.object({
  trip: tripSchema,
  vehicleId: trimmed.min(1, "Choose a vehicle"),
  customer: customerSchema,
  ...attribution,
});

/** The quote form is deliberately flatter and shorter than a booking. */
export const quoteSchema = z.object({
  pickup: trimmed.min(3, "Enter a pickup address").max(240),
  dropoff: optionalText(),
  date: isoDate,
  time: isoTime,
  passengers: z.coerce
    .number()
    .int()
    .min(1, "At least one passenger")
    .max(14, "For more than 14 passengers we will arrange multiple vehicles — call us"),
  /** "unsure" is a real answer — plenty of customers do not know yet. */
  vehicleId: trimmed.max(40).default("unsure"),
  firstName: trimmed.min(1, "Enter your first name").max(60),
  lastName: optionalText(60),
  phone,
  email,
  notes: optionalText(2000),
  ...attribution,
});

export const contactSchema = z.object({
  firstName: trimmed.min(1, "Enter your name").max(60),
  lastName: optionalText(60),
  phone: z
    .union([phone, z.literal(""), z.null()])
    .optional()
    .transform((v) => (typeof v === "string" ? v.trim() || null : null)),
  email,
  company: optionalText(120),
  notes: trimmed.min(5, "Tell us how we can help").max(2000),
  ...attribution,
});

export type TripInput = z.infer<typeof tripSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type BookingRequest = z.infer<typeof bookingSchema>;
export type QuoteRequest = z.infer<typeof quoteSchema>;
export type ContactRequest = z.infer<typeof contactSchema>;
