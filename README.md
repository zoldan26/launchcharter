# Chartered Car

Website and booking system for a premium black car service in Columbus, Ohio.

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Supabase · Resend · Stripe (dormant)

---

## Quick start

```bash
npm install
cp .env.example .env.local     # optional — the site runs with it empty
npm run dev                    # http://localhost:3000
```

With no environment variables at all the site still works end to end: bookings
and quotes validate, save, and confirm. Leads append to `.data/leads.jsonl`,
emails print to the server console, address fields are plain text, and no
tracking scripts load. Nothing is silently lost while you set up services.

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

---

## Before you launch

Everything below is unconfirmed. Each one is either hidden or rendered as an
obvious bracketed placeholder — the site will not invent a value for it.

| What | Where | Until it's set |
|---|---|---|
| Phone number | `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_PHONE_RAW` | Every call button and tel: link is hidden, not faked |
| Email address | `NEXT_PUBLIC_EMAIL` | Shown as `[Email address]`, omitted from schema |
| Reservation hours | `site.contact.hours` in `src/lib/site.config.ts` | The hours line is omitted entirely. "Reservations available 24/7" appears **only** if you set it |
| Street address | `site.contact.address` | Omitted from the footer and from LocalBusiness schema |
| Social accounts | `site.social` | No icons render |
| Rate card | `rates` in `src/lib/pricing.ts` | No price appears anywhere; every trip is quoted by the office |
| Fleet makes/models | `example` in `src/lib/fleet.ts` | Categories show capacity and use cases, no specific vehicles claimed |
| Testimonials | `src/components/home/Testimonials.tsx` | The section hides itself |
| Photography | `/public` — see below | Labelled placeholder frames describing the shot needed |
| Legal copy | `/privacy`, `/terms` | Generic starting text — have counsel review before publishing |

No review counts, star ratings, years in business, licences, certifications or
partnerships appear anywhere in the site or its structured data. Add them only
when they are documented.

---

## Photography

There is no stock imagery. `ImageSlot` renders a frame naming the shot that
belongs in it until a real file exists. Drop files in `/public` and pass `src`:

```tsx
<ImageSlot src="/hero.jpg" alt="..." />
```

Shots the design expects: a black sedan at a downtown Columbus curb (hero,
wide, with room on the right for the booking panel); each vehicle category,
three-quarter front, black on black; a driver meeting a traveller at CMH
arrivals; a chauffeur's hand on a rear door handle. Avoid stretch limousines,
champagne, and skyline postcards — the local references should be incidental.

`/public/og.png` is a placeholder social card. Replace it once the wordmark is
final; it is 1200×630.

---

## Architecture

```
src/
  app/                    routes — one folder per page
    api/bookings          POST: validate → guard availability → save → notify
    api/quotes            POST: same pipeline, shorter form
    api/contact           POST: contact + corporate account requests
    api/places            Google Places proxy (keeps the API key server-side)
    [location]/           local SEO landing pages, generated from lib/locations
  components/
    booking/              the four-step wizard and its fields
    forms/                quote + contact forms
    home/                 homepage sections, in page order
    site/                 header, footer, mobile CTA bar, analytics, JSON-LD
  lib/
    site.config.ts        every business fact the site displays
    fleet.ts              vehicle categories
    services.ts           service copy
    locations.ts          service areas + which get landing pages
    faq.ts                FAQ content, also emitted as FAQPage schema
    availability.ts       calendar rules — shared by client and server
    validation.ts         zod schemas — shared by client and server
    pricing.ts            rate card and estimates (off by default)
    schema.ts             JSON-LD builders
    metadata.ts           titles, canonicals, Open Graph
    analytics.ts          one track() vocabulary for GA4/Ads/Meta/GTM
    db/store.ts           lead storage (Supabase, file fallback)
    email/                Resend send + templates
    sms/                  Twilio seam (no-op until configured)
    payments/stripe.ts    dormant until PAYMENT_MODE is set
supabase/schema.sql       leads table, enums, indexes, RLS
```

Two rules worth keeping:

1. **Business facts live in `lib/`, never in a component.** Adding a vehicle to
   `fleet.ts` adds it to the fleet page, the booking wizard and the quote form.
   Adding a location to `locations.ts` with `landingPage: true` generates a
   page, a sitemap entry and its schema.
2. **The client and the server validate with the same code.** `validation.ts`
   runs in the form so errors appear next to the field, and again in the route
   because a form is not a security boundary. `availability.ts` disables
   unbookable dates in the calendar and re-checks them on submit, so the two
   can never disagree.

---

## Booking rules

Set in `site.booking` (`src/lib/site.config.ts`), overridable by environment:

- `minAdvanceHours` — notice required before a pickup (default 4)
- `maxAdvanceDays` — booking horizon (default 365)
- `availableWeekdays` — days pickups are accepted
- `serviceWindow` — earliest and latest pickup time offered
- `blackoutDates` — ISO dates the calendar refuses
- `hourlyMinimumHours` — minimum billable hourly block (default 3)

The calendar greys out anything these rules exclude, and the API returns a
plain-language reason if a request arrives anyway ("Pickups need at least 4
hours' notice", "We are not scheduling pickups on that date").

For per-vehicle availability, replace `getRules()` with a database read and add
a check against confirmed leads for the same vehicle and time — no caller
changes.

---

## Database

Run `supabase/schema.sql` in the Supabase SQL editor, then set `SUPABASE_URL`
and `SUPABASE_SERVICE_ROLE_KEY`. Storage switches over automatically.

Every submission — booking, quote, contact, corporate — normalises into one
`leads` row with `status` one of `new → contacted → quoted → confirmed →
completed / cancelled`, plus attribution (`source`, `referrer`, `utm`). An
admin dashboard only needs `listLeads()` and an update on `status`; the read
side is already there.

The schema also includes `vehicles`, `drivers`, `availability_rules`,
`blackout_dates` and `assignments`. The assignments table carries an exclusion
constraint, so the database itself rejects two overlapping bookings for the
same vehicle — double-booking is prevented at the lowest level rather than in
application code. Those tables are unused by the site today; they are the shape
the admin dashboard will need.

---

## Activating the optional pieces

**Email (Resend).** Set `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`. The
customer gets a confirmation and the office gets the full lead. Without a key,
both are logged to the console.

**Payments (Stripe).** Set `PAYMENT_MODE` to `full`, `authorization` or
`deposit`, add `STRIPE_SECRET_KEY`, and — for deposits —
`STRIPE_DEPOSIT_PERCENT`. The lead table already carries `payment_status` and
`payment_ref`. Note that payments need a price, so fill in the rate card and
set `NEXT_PUBLIC_PRICING=on` first.

**SMS (Twilio).** Set the `TWILIO_*` variables and `SMS_TO`, then uncomment the
send in `src/lib/sms/send.ts`. It is already called from the notification layer.

**Address autocomplete.** Set `GOOGLE_PLACES_API_KEY`. Requests are proxied
through `/api/places` so the key never reaches the browser. Without it, address
fields are ordinary text inputs and booking works normally.

---

## Tracking

`track()` in `src/lib/analytics.ts` is the only place that talks to a vendor.
Events fired: `book_ride_clicked`, `booking_started`, `booking_step_completed`,
`booking_completed`, `quote_requested`, `phone_clicked`, `corporate_inquiry`,
`contact_submitted`.

Set `NEXT_PUBLIC_GTM_ID` or `NEXT_PUBLIC_GA4_ID`, plus
`NEXT_PUBLIC_GOOGLE_ADS_ID` with conversion labels and
`NEXT_PUBLIC_META_PIXEL_ID` if used. Nothing loads in development and no
placeholder IDs ship. Every tag loads lazily, off the critical path.

---

## Design system

Monochrome by intent: black, charcoal, warm off-white. No accent colour, no
gradients, no decorative shadows. Tokens and component classes are all in
`src/app/globals.css` — `--color-ink / paper / bone / rule / graphite / slate /
mist`, the `.btn` and `.field` systems, `.section` rhythm, `.u-wrap` container.

Type is one family, Archivo, self-hosted from npm so there is no Google Fonts
request and no layout shift. Display sizes run at weight 300 with tight
negative tracking; UI and body at 400/500. To change the face, swap the import
in `src/app/layout.tsx` and update `--font-sans-custom`.

Motion: one page-load animation, on the hero. Everything else moves only in
response to something the visitor did.

Accessibility: semantic landmarks, a skip link, labelled fields with errors tied
by `aria-describedby`, visible focus rings that are never removed, 3.25rem
minimum tap targets, 16px inputs to stop the iOS focus zoom, and
`prefers-reduced-motion` respected.

---

## Deployment

Deploy to Vercel, set the environment variables in the project settings, and
point the domain. `NEXT_PUBLIC_SITE_URL` must match the live origin — canonical
URLs, Open Graph tags and the sitemap are all built from it.

Then: submit `/sitemap.xml` in Search Console, create the Google Business
Profile, and test a real booking end to end before running ads.
