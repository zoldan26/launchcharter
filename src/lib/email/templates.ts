import { site } from "../site.config";
import { getVehicle } from "../fleet";
import { formatLongDate, minutesToLabel, timeToMinutes } from "../availability";
import { formatCents } from "../pricing";
import type { Lead } from "../types";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function row(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 16px 8px 0;color:#6b6b6b;font-size:13px;vertical-align:top;white-space:nowrap">${esc(label)}</td>
    <td style="padding:8px 0;color:#101113;font-size:14px;vertical-align:top">${esc(value)}</td>
  </tr>`;
}

function tripRows(lead: Lead): string {
  const vehicle = lead.vehicleId ? getVehicle(lead.vehicleId)?.name : null;
  const [date, time] = (lead.pickupAt || "").split("T");
  const when = date ? `${formatLongDate(date)} at ${minutesToLabel(timeToMinutes((time || "00:00").slice(0, 5)))}` : null;
  const [rDate, rTime] = (lead.returnAt || "").split("T");
  const back = rDate ? `${formatLongDate(rDate)} at ${minutesToLabel(timeToMinutes((rTime || "00:00").slice(0, 5)))}` : null;

  const typeLabel =
    lead.tripType === "round-trip" ? "Round trip" : lead.tripType === "hourly" ? "Hourly" : lead.tripType === "one-way" ? "One way" : null;

  return [
    row("Service", typeLabel),
    row("Pickup", lead.pickup),
    row("Destination", lead.dropoff),
    row("Date and time", when),
    row("Return", back),
    row("Duration", lead.durationHours ? `${lead.durationHours} hours` : null),
    row("Passengers", lead.passengers ? String(lead.passengers) : null),
    row("Vehicle", vehicle),
    row("Flight", lead.flightNumber),
    row("Estimate", lead.estimateCents ? formatCents(lead.estimateCents) : null),
    row("Notes", lead.notes),
  ].join("");
}

function shell(title: string, intro: string, body: string, footer: string) {
  return `<!doctype html><html><body style="margin:0;background:#f5f3ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e3e0da">
        <tr><td style="background:#101113;padding:20px 28px">
          <span style="color:#ffffff;font-size:15px;letter-spacing:.14em;font-weight:600">CHARTERED CAR</span>
        </td></tr>
        <tr><td style="padding:28px">
          <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;color:#101113;font-weight:600">${esc(title)}</h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3a3d42">${intro}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #e3e0da">${body}</table>
        </td></tr>
        <tr><td style="padding:0 28px 28px;font-size:13px;line-height:1.6;color:#6b6b6b">${footer}</td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

const contactLine = () => {
  const bits: string[] = [];
  if (!site.contact.phone.startsWith("[")) bits.push(esc(site.contact.phone));
  if (!site.contact.email.startsWith("[")) bits.push(esc(site.contact.email));
  return bits.length ? bits.join(" &nbsp;·&nbsp; ") : "";
};

export function customerBookingEmail(lead: Lead) {
  return {
    subject: `We have your reservation request — ${site.name}`,
    html: shell(
      "Your reservation request is in",
      "A reservation coordinator is reviewing the details below and will confirm your trip shortly. No further action is needed right now.",
      tripRows(lead),
      `Need to change something? Reply to this email${contactLine() ? ` or reach us at ${contactLine()}` : ""}.<br>Reference ${esc(lead.id.slice(0, 8))}`,
    ),
  };
}

export function customerQuoteEmail(lead: Lead) {
  return {
    subject: `Your quote request — ${site.name}`,
    html: shell(
      "We're working on your quote",
      "Thanks for the details. We'll come back to you with pricing and availability for the trip below.",
      tripRows(lead),
      `Reply to this email if anything changes.<br>Reference ${esc(lead.id.slice(0, 8))}`,
    ),
  };
}

export function customerContactEmail(lead: Lead) {
  return {
    subject: `We received your message — ${site.name}`,
    html: shell(
      "Thanks for getting in touch",
      "Your message is with our team and someone will reply shortly.",
      row("Message", lead.notes),
      `Reference ${esc(lead.id.slice(0, 8))}`,
    ),
  };
}

export function internalLeadEmail(lead: Lead) {
  const kind =
    lead.kind === "booking" ? "Booking request" : lead.kind === "quote" ? "Quote request" : lead.kind === "corporate" ? "Corporate account request" : "Contact form";
  const who = `${lead.firstName} ${lead.lastName}`.trim();
  const utm = lead.utm && Object.keys(lead.utm).length ? JSON.stringify(lead.utm) : null;

  return {
    subject: `${kind} — ${who}${lead.pickup ? ` — ${lead.pickup}` : ""}`,
    html: shell(
      kind,
      `New lead from the website. Full details below.`,
      [
        row("Name", who),
        row("Phone", lead.phone),
        row("Email", lead.email),
        row("Company", lead.company),
        tripRows(lead),
        row("Source", lead.source),
        row("Referrer", lead.referrer),
        row("Campaign", utm),
        row("Received", new Date(lead.createdAt).toLocaleString("en-US")),
        row("Lead ID", lead.id),
      ].join(""),
      "",
    ),
  };
}
