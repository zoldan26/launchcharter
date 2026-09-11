/**
 * Conversion tracking layer.
 *
 * One function, `track()`, is called from every conversion point in the UI.
 * It pushes to the GTM dataLayer, forwards to gtag (GA4 + Google Ads) and to
 * the Meta Pixel when each is present. Nothing fires and nothing errors when
 * the tags are absent, so the site works identically before tracking is set up.
 *
 * No tracking IDs are hard-coded. Set them in the environment:
 *   NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_GA4_ID,
 *   NEXT_PUBLIC_GOOGLE_ADS_ID, NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL,
 *   NEXT_PUBLIC_META_PIXEL_ID
 */

export type TrackEvent =
  | "book_ride_clicked"
  | "booking_started"
  | "booking_step_completed"
  | "booking_completed"
  | "quote_requested"
  | "phone_clicked"
  | "corporate_inquiry"
  | "contact_submitted";

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Maps our events onto the Meta Pixel's standard event names. */
const metaEvent: Partial<Record<TrackEvent, string>> = {
  booking_started: "InitiateCheckout",
  booking_completed: "Purchase",
  quote_requested: "Lead",
  corporate_inquiry: "Lead",
  contact_submitted: "Contact",
  phone_clicked: "Contact",
};

export function track(event: TrackEvent, props: Props = {}): void {
  if (typeof window === "undefined") return;
  const payload = { event, ...props };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  window.gtag?.("event", event, props);

  // Google Ads conversion, fired only for the events that are worth money and
  // only when a conversion label has been configured.
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const bookingLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL;
  if (adsId && bookingLabel && (event === "booking_completed" || event === "quote_requested")) {
    window.gtag?.("event", "conversion", { send_to: `${adsId}/${bookingLabel}` });
  }

  const meta = metaEvent[event];
  if (meta) window.fbq?.("track", meta, props);
}

/** Captures utm_* params and the referrer so leads carry their source. */
export function captureAttribution(): { source: string; referrer: string | null; utm: Record<string, string> } {
  if (typeof window === "undefined") return { source: "direct", referrer: null, utm: {} };
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key.startsWith("utm_") || key === "gclid" || key === "fbclid") utm[key] = value;
  });
  const referrer = document.referrer || null;
  const source =
    utm.utm_source ||
    (utm.gclid ? "google-ads" : null) ||
    (referrer ? new URL(referrer).hostname.replace(/^www\./, "") : null) ||
    "direct";
  return { source, referrer, utm };
}
