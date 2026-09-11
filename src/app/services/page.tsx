import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/site/JsonLd";
import { services } from "@/lib/services";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Airport transfers, corporate transportation, hourly chauffeur service, events and group travel throughout Columbus and Central Ohio.",
  path: "/services",
});

export default function ServicesPage() {
  const trail = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
  ];

  return (
    <>
      <PageHeader
        title="Services"
        lede="Five kinds of work, one standard: a clean black car, a professional driver, and a trip that starts when it is supposed to."
        trail={trail}
      />

      <div className="u-wrap section-tight">
        <div className="border-t border-rule">
          {services.map((s) => (
            <section
              key={s.slug}
              id={s.slug}
              className="grid gap-6 border-b border-rule py-10 md:grid-cols-[1fr_1.3fr] md:gap-12"
            >
              <h2 className="text-[var(--text-h2)]">{s.name}</h2>
              <div>
                <p className="text-[var(--text-lede)] leading-relaxed text-graphite">{s.blurb}</p>
                <p className="u-measure-wide mt-4 leading-relaxed text-graphite">{s.detail}</p>
                <ul className="mt-5 grid gap-2 text-[0.9375rem] text-graphite sm:grid-cols-2">
                  {s.points.map((p) => (
                    <li key={p} className="border-l border-mist pl-3">
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href={s.cta.href} className="btn btn-outline mt-6">
                  {s.cta.label}
                </Link>
              </div>
            </section>
          ))}
        </div>
      </div>

      <FinalCTA />
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          ...services.map((s) =>
            serviceSchema({ name: s.name, description: s.blurb, url: `/services#${s.slug}` }),
          ),
        ]}
      />
    </>
  );
}
