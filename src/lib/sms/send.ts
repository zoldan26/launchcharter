import "server-only";
import { site } from "../site.config";
import type { Lead } from "../types";

/**
 * SMS notifications, off by default.
 *
 * Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM and SMS_TO to switch
 * it on, then `npm i twilio`. The call site in email/send.ts does not change.
 */
export async function notifySms(lead: Lead): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  const to = (process.env.SMS_TO || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!sid || !token || !from || !to.length) return;

  const body = [
    `${site.name}: new ${lead.kind}`,
    `${lead.firstName} ${lead.lastName} · ${lead.phone}`,
    lead.pickup ? `${lead.pickup} → ${lead.dropoff ?? "hourly"}` : null,
    lead.pickupAt ? lead.pickupAt.replace("T", " ") : null,
  ]
    .filter(Boolean)
    .join("\n");

  // Twilio's REST API, called directly so the SDK stays out of the bundle.
  await Promise.all(
    to.map((recipient) =>
      fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ From: from, To: recipient, Body: body }),
      }),
    ),
  );
}
