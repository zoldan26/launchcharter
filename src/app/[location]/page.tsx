import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/PageHeader";
import { FinalCTA } from "@/components/home/FinalCTA";
import { FaqSection } from "@/components/home/FaqSection";
import { JsonLd } from "@/components/site/JsonLd";
import { getLocation, landingPageLocations } from "@/lib/locations";
import { activeFleet } from "@/lib/fleet";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import type { FaqItem } from "@/lib/faq";

/**
 * Location landing pages for local SEO.
 *
 * One page per entry in lib/locations.ts with `landingPage: true`. Adding a
 * neighbourhood there creates a new statically rendered page with its own
 * title, description, canonical, breadcrumb and Service schema.
 */
export function generateStaticParams() {
  return landingPageLocations.map((l) => ({ location: l.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ location: string }> };

export async function generateMetadata({ params }: Props) {
  const { location } = await params;
  const place = getLocation(location);
  if (!place || !place.landingPage) return {};
  return pageMetadata({
    title: `${place.name} Black Car Service`,
    description: `Private black car service in ${place.name}, Ohio. Airport transfers to CMH, corporate travel, hourly service and events with professional drivers.`,
    path: `/${place.slug}`,
  });
}

export default async function LocationPage({ params }: Props) {
  const { location } = await params;
  const place = getLocation(location);
  if (!place || !place.landingPage) notFound();

  const trail = [
    { name: "Home", href: "/" },
    { name: `${place.name} black car service`, href: `/${place.slug}` },
  ];

  const localFaq: FaqItem[] = [
    {
      q: `Do you serve ${place.name}?`,
      a: `Yes. ${place.name} is inside our regular Columbus service area for airport transfers, corporate travel, hourly service and events.`,
    },
    {
      q: `How long is the drive from ${place.name} to Columbus airport?`,
      a: place.airportMinutes
        ? `Roughly ${place.airportMinutes} minutes without traffic. We build in extra time for the hour you are travelling and, for arrivals, we track your flight.`
        : `It depends on the hour. Tell us your flight time when you book and we will suggest a pickup that leaves enough room.`,
    },
    {
      q: `Can I set up recurring trips from ${place.name}?`,
      a: "Yes. Standing trips run on a corporate account with one contact and one invoice, which is simpler than rebooking the same ride every week.",
    },
  ];

  return (
    <>
      <PageHeader
        title={`${place.name} black car service`}
        lede={`Private transportation in ${place.name} and across Central Ohio — airport transfers, corporate travel, hourly service and events, with a professional driver on every trip.`}
        trail={trail}
      />

      <div className="u-wrap section-tight">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/book" className="btn btn-primary sm:min-w-[11rem]">
            Book a ride
          </Link>
          <Link href="/quote" className="btn btn-outline sm:min-w-[11rem]">
            Get a quote
          </Link>
        </div>

        <div className="u-measure-wide mt-12 border-t border-rule pt-8">
          <h2 className="text-[var(--text-h2)]">Driving in {place.name}</h2>
          <p className="mt-4 text-[var(--text-lede)] leading-relaxed text-graphite">{place.intro}</p>
        </div>

        <section className="mt-12 border-t border-rule pt-8">
          <h2 className="text-[var(--text-h2)]">What we handle here</h2>
          <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Airport transfers", "CMH arrivals and departures, with your flight number on the reservation."],
              ["Corporate travel", "Executives, clients and visiting teams, billed to one account."],
              ["Hourly service", "A car and driver for the evening, with as many stops as you need."],
              ["Events", "Weddings, concerts, games and conferences, timed to the event."],
              ["Group travel", "SUVs and executive Sprinters so everyone arrives together."],
              ["Private trips", "Dinner, appointments, or anywhere you would rather not park."],
            ].map(([h, p]) => (
              <li key={h} className="border-t border-mist pt-3">
                <h3 className="text-[1.0625rem] font-medium">{h}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-graphite">{p}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 border-t border-rule pt-8">
          <h2 className="text-[var(--text-h2)]">Vehicles available in {place.name}</h2>
          <div className="mt-6 grid gap-px border border-rule bg-rule sm:grid-cols-3">
            {activeFleet.map((v) => (
              <div key={v.id} className="bg-paper p-5">
                <h3 className="text-[1.0625rem] font-medium">{v.name}</h3>
                <p className="mt-1 text-[0.8125rem] text-slate">
                  Up to {v.passengers} passengers · {v.luggage} bags
                </p>
                <Link
                  href={`/book?vehicle=${v.id}`}
                  className="mt-3 inline-block text-[0.9375rem] underline decoration-mist underline-offset-4 hover:decoration-ink"
                >
                  Book this vehicle
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      <FaqSection items={localFaq} title={`${place.name} questions`} />
      <FinalCTA />

      <JsonLd
        data={[
          breadcrumbSchema(trail),
          serviceSchema({
            name: `${place.name} black car service`,
            description: `Private black car and chauffeur service in ${place.name}, Ohio, including airport transfers to CMH, corporate travel, hourly service and events.`,
            url: `/${place.slug}`,
            areaName: `${place.name}, OH`,
          }),
          faqSchema(localFaq),
        ]}
      />
    </>
  );
}
