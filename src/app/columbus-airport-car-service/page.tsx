import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { ImageSlot } from "@/components/site/ImageSlot";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import type { FaqItem } from "@/lib/faq";

export const metadata = pageMetadata({
  title: "Columbus Airport Car Service | CMH Black Car",
  description:
    "Black car service to and from John Glenn Columbus International Airport (CMH). Flight-tracked pickups, early departures, late arrivals and professional drivers.",
  path: "/columbus-airport-car-service",
});

const blocks = [
  {
    h: "Airport pickup",
    p: "Send us your flight number and we watch it. When you land, your driver already knows — whether you are twenty minutes early or two hours late. Choose curbside at the arrivals level or a meet-and-greet inside the terminal when you book.",
  },
  {
    h: "Airport drop-off",
    p: "We build in the drive, the traffic and the terminal, then pick you up with room to spare. For early departures the car is outside before the alarm goes off a second time.",
  },
  {
    h: "Early mornings and late nights",
    p: "The first bank of departures out of CMH and the last arrivals in are the trips rideshare handles worst. They are ordinary work for us — a confirmed car, a known driver, and no surge pricing at 4:30 a.m.",
  },
  {
    h: "Business travelers",
    p: "A quiet car, a clean back seat and a driver who does not need directions. If you are moving a client or a candidate, we can meet them in the terminal with a name board.",
  },
];

const airportFaq: FaqItem[] = [
  {
    q: "What happens if my flight is delayed?",
    a: "Nothing on your end. We track the flight number on your reservation and move the pickup to match the actual arrival time.",
  },
  {
    q: "Where will I meet my driver at CMH?",
    a: "You will get pickup instructions and your driver's phone number before the trip. Curbside pickup happens at the arrivals level; a meet-and-greet driver waits inside baggage claim with a name board.",
  },
  {
    q: "How early should I be picked up for a departure?",
    a: "We recommend leaving two hours before a domestic departure, plus drive time from your pickup. Tell us your flight time when you book and we will suggest a pickup time that fits.",
  },
  {
    q: "Do you serve airports outside Columbus?",
    a: "Yes. Longer regional trips — including Cincinnati, Cleveland, Dayton and Pittsburgh — are quoted on request.",
  },
  {
    q: "Can you handle a group arriving on the same flight?",
    a: "Yes. An SUV covers up to six passengers with luggage and an executive Sprinter handles larger groups, or we can send multiple vehicles so the whole party leaves together.",
  },
];

export default function AirportPage() {
  const trail = [
    { name: "Home", href: "/" },
    { name: "Columbus airport car service", href: "/columbus-airport-car-service" },
  ];

  return (
    <>
      <PageHeader
        title="Columbus airport black car service"
        lede="Private transportation to and from John Glenn Columbus International Airport, with your flight number on the reservation and a professional driver on every trip."
        trail={trail}
      />

      <div className="u-wrap section-tight">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/book?service=airport" className="btn btn-primary sm:min-w-[15rem]">
            Book airport transportation
          </Link>
          <Link href="/quote?service=airport" className="btn btn-outline sm:min-w-[11rem]">
            Get a quote
          </Link>
        </div>

        <ImageSlot
          src="/airport.jpg"
          alt="A chauffeur loading luggage for travellers at airport arrivals"
          tone="dark"
          className="mt-10 aspect-[16/9] w-full md:aspect-[21/9]"
          sizes="(max-width: 1248px) 100vw, 1248px"
        />

        <div className="mt-12 grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {blocks.map((b) => (
            <section key={b.h} className="bg-paper p-6 lg:p-8">
              <h2 className="text-[var(--text-h3)]">{b.h}</h2>
              <p className="mt-3 leading-relaxed text-graphite">{b.p}</p>
            </section>
          ))}
        </div>

        <section className="mt-12 border-t border-rule pt-8">
          <h2 className="text-[var(--text-h2)]">Flight tracking</h2>
          <p className="u-measure-wide mt-4 leading-relaxed text-graphite">
            Every airport reservation carries a flight number field. Today our team monitors those
            flights before dispatch; automated flight-status tracking is a planned integration, and
            the booking record is already structured to support it.
          </p>
        </section>
      </div>

      <FaqSection items={airportFaq} title="Airport questions" />
      <FinalCTA />

      <JsonLd
        data={[
          breadcrumbSchema(trail),
          serviceSchema({
            name: "Airport car service",
            description:
              "Black car service to and from John Glenn Columbus International Airport (CMH), including flight-tracked pickups, early departures and late-night arrivals.",
            url: "/columbus-airport-car-service",
          }),
          faqSchema(airportFaq),
        ]}
      />
    </>
  );
}
