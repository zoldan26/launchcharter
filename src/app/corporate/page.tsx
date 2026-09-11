import { PageHeader } from "@/components/site/PageHeader";
import { ImageSlot } from "@/components/site/ImageSlot";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Corporate Transportation in Columbus, Ohio",
  description:
    "Corporate black car accounts in Columbus: executive travel, client transportation, recurring bookings, airport pickups, events and centralized billing.",
  path: "/corporate",
});

const capabilities = [
  { h: "Executive transportation", p: "Consistent, discreet travel for leadership, on a schedule that changes at short notice." },
  { h: "Client transportation", p: "Meet clients and candidates at the terminal and deliver them to your door, not to a parking garage." },
  { h: "Recurring bookings", p: "Standing trips — the same pickup, the same time, every week — set once and left alone." },
  { h: "Airport pickups", p: "Flight-tracked CMH arrivals and departures for visiting teams and travelling staff." },
  { h: "Employee transportation", p: "Team travel between offices, sites and events without a fleet of personal cars." },
  { h: "Event transportation", p: "Conferences, client dinners and company events, with multiple vehicles when the group is large." },
  { h: "Centralized billing", p: "One invoice instead of a month of individual receipts to chase and reconcile." },
  { h: "A named contact", p: "One person to call, who already knows your account and your standing preferences." },
];

export default function CorporatePage() {
  const trail = [
    { name: "Home", href: "/" },
    { name: "Corporate", href: "/corporate" },
  ];

  return (
    <>
      <PageHeader
        title="Corporate transportation"
        lede="A transportation partner for Columbus businesses — executives, clients, visiting teams and events, on one account with one point of contact."
        trail={trail}
      />

      <div className="u-wrap section-tight">
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c) => (
            <section key={c.h} className="bg-paper p-6">
              <h2 className="text-[1.0625rem] font-medium">{c.h}</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-graphite">{c.p}</p>
            </section>
          ))}
        </div>

        <ImageSlot
          src="/corporate.jpg"
          alt="A driver holding a sedan door for an executive outside a downtown office"
          tone="dark"
          className="mt-10 aspect-[16/9] w-full md:aspect-[21/9]"
          sizes="(max-width: 1248px) 100vw, 1248px"
        />

        <div className="mt-14 grid gap-10 border-t border-rule pt-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="text-[var(--text-h2)]">Request a corporate account</h2>
            <p className="u-measure mt-4 leading-relaxed text-graphite">
              Tell us roughly how your company travels and who does the booking. We will set up the
              account, agree billing, and give you a direct contact for reservations.
            </p>
            <p className="u-measure mt-4 text-[0.9375rem] leading-relaxed text-slate">
              There is no minimum spend and no contract to sign to get started.
            </p>
          </div>
          <ContactForm
            variant="corporate"
            cta="Request a corporate account"
            notesLabel="What does your travel look like?"
            notesPlaceholder="Roughly how often you travel, who books, how you would like to be billed."
          />
        </div>
      </div>

      <JsonLd
        data={[
          breadcrumbSchema(trail),
          serviceSchema({
            name: "Corporate transportation",
            description:
              "Corporate black car accounts in Columbus, Ohio: executive and client transportation, recurring bookings, airport pickups and centralized billing.",
            url: "/corporate",
          }),
        ]}
      />
    </>
  );
}
