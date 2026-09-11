import "server-only";
import { site } from "../site.config";
import type { Lead } from "../types";
import {
  customerBookingEmail,
  customerContactEmail,
  customerQuoteEmail,
  internalLeadEmail,
} from "./templates";

/**
 * Transactional email via Resend.
 *
 * When RESEND_API_KEY is missing the messages are logged to the server console
 * instead of being sent, so local development works without credentials and a
 * misconfigured environment never takes down a form submission.
 */

const KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || `${site.name} <reservations@example.com>`; // TODO: verified sending domain
const INTERNAL_TO = (process.env.EMAIL_TO || "").split(",").map((s) => s.trim()).filter(Boolean);

type Message = { to: string[]; subject: string; html: string; replyTo?: string };

async function deliver(msg: Message): Promise<void> {
  if (!msg.to.length) return;
  if (!KEY) {
    console.info(`[email:dry-run] to=${msg.to.join(",")} subject="${msg.subject}"`);
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(KEY);
  const { error } = await resend.emails.send({
    from: FROM,
    to: msg.to,
    subject: msg.subject,
    html: msg.html,
    replyTo: msg.replyTo,
  });
  if (error) throw new Error(`Email failed: ${error.message}`);
}

/**
 * Sends the customer confirmation and the internal lead notification.
 * Failures are caught and logged: a mail outage must never lose a lead that is
 * already saved to the database.
 */
export async function notify(lead: Lead): Promise<void> {
  const customer =
    lead.kind === "booking"
      ? customerBookingEmail(lead)
      : lead.kind === "quote"
        ? customerQuoteEmail(lead)
        : customerContactEmail(lead);

  const internal = internalLeadEmail(lead);
  const replyTo = INTERNAL_TO[0];

  const results = await Promise.allSettled([
    deliver({ to: [lead.email], subject: customer.subject, html: customer.html, replyTo }),
    deliver({ to: INTERNAL_TO, subject: internal.subject, html: internal.html, replyTo: lead.email }),
    // SMS is wired the same way and no-ops until Twilio is configured.
    import("../sms/send").then((m) => m.notifySms(lead)),
  ]);

  results.forEach((r) => {
    if (r.status === "rejected") console.error("[notify]", r.reason);
  });
}

/**
 * Last-resort delivery, used when the database write failed. Returns true only
 * if the lead genuinely reached the business — a dry run with no API key, or
 * no configured recipient, counts as false. Callers use this to decide whether
 * to tell the customer their request went through.
 */
export async function notifyInternalOnly(lead: Lead): Promise<boolean> {
  if (!KEY || !INTERNAL_TO.length) return false;
  const internal = internalLeadEmail(lead);
  try {
    await deliver({
      to: INTERNAL_TO,
      subject: `[DB FAILED — ACTION NEEDED] ${internal.subject}`,
      html: internal.html,
      replyTo: lead.email,
    });
    return true;
  } catch (err) {
    console.error("[notify] fallback delivery failed", err);
    return false;
  }
}
