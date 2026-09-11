import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { FinalCTA } from "@/components/home/FinalCTA";
import { ImageSlot } from "@/components/site/ImageSlot";
import { JsonLd } from "@/components/site/JsonLd";
import { activeFleet } from "@/lib/fleet";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Fleet",
  description:
    "Executive sedans, luxury SUVs and executive Sprinters for Columbus black car service. Passenger and luggage capacity for every vehicle class.",
  path: "/fleet",
});

export default function FleetPage() {
  const trail = [
    { name: "Home", href: "/" },
    { name: "Fleet", href: "/fleet" },
  ];

  return (
    <>
      <PageHeader
        title="Fleet"
        lede="Three vehicle classes that cover nearly every trip. Choose by passengers and luggage — we confirm the exact vehicle when we confirm the reservation."
        trail={trail}
      />

      <div className="u-wrap section-tight grid gap-10">
        {activeFleet.map((v) => (
          <article
            key={v.id}
            className="grid gap-6 border-t border-rule pt-8 md:grid-cols-[22rem_1fr] md:gap-10"
          >
            <div className="grid gap-3">
              <ImageSlot
                src={v.image}
                alt={v.name}
                tone="dark"
                className="aspect-[16/10] w-full"
                sizes="(max-width: 768px) 100vw, 22rem"
              />
              <ImageSlot
                src={v.interiorImage}
                alt={`Interior of the ${v.name.toLowerCase()}`}
                tone="dark"
                className="aspect-[16/10] w-full"
                sizes="(max-width: 768px) 100vw, 22rem"
              />
            </div>
            <div>
              <h2 className="text-[var(--text-h2)]">{v.name}</h2>
              {v.example ? (
                <p className="mt-2 text-[0.9375rem] text-slate">Typically a {v.example}.</p>
              ) : null}
              <p className="u-measure-wide mt-4 text-[var(--text-lede)] leading-relaxed text-graphite">
                {v.summary}
              </p>

              <dl className="mt-6 grid max-w-md grid-cols-2 gap-px border border-rule bg-rule">
                <div className="bg-paper px-4 py-4">
                  <dt className="text-[0.8125rem] text-slate">Passengers</dt>
                  <dd className="mt-1 text-[1.25rem]">Up to {v.passengers}</dd>
                </div>
                <div className="bg-paper px-4 py-4">
                  <dt className="text-[0.8125rem] text-slate">Luggage</dt>
                  <dd className="mt-1 text-[1.25rem]">Up to {v.luggage} bags</dd>
                </div>
              </dl>

              <h3 className="mt-6 text-[0.9375rem] font-medium">Best for</h3>
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.9375rem] text-graphite">
                {v.bestFor.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>

              <Link href={`/book?vehicle=${v.id}`} className="btn btn-primary mt-7">
                Book the {v.shortName.toLowerCase()}
              </Link>
            </div>
          </article>
        ))}

        <p className="text-[0.875rem] leading-relaxed text-slate">
          Vehicle photography and specific makes and models will be listed here once confirmed by the
          business. We do not publish a vehicle we cannot put at your curb.
        </p>
      </div>

      <FinalCTA />
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
