import Link from "next/link";
import { ImageSlot } from "@/components/site/ImageSlot";
import { PageHeader } from "@/components/site/PageHeader";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site.config";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Chartered Car is a black car service based in Columbus, Ohio, providing private transportation for airports, corporate travel, events and hourly service.",
  path: "/about",
});

export default function AboutPage() {
  const trail = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      <PageHeader
        title="About Chartered Car"
        lede="A Columbus black car service built around one idea: the car should be the least eventful part of your day."
        trail={trail}
      />

      <div className="u-wrap">
        <ImageSlot
          src="/arrival.jpg"
          alt="A chauffeur holding the rear door open for an arriving passenger"
          tone="dark"
          className="aspect-[16/9] w-full md:aspect-[21/8]"
          sizes="(max-width: 1248px) 100vw, 1248px"
        />
      </div>

      <div className="u-wrap section-tight grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <div className="u-measure-wide grid gap-5 leading-relaxed text-graphite">
          <p>
            Most transportation goes wrong in small ways. The car is late. The driver calls twice for
            directions. Nobody is sure which entrance. The bill arrives as four separate receipts.
            None of it is dramatic and all of it costs you time and attention on a day you had
            planned to spend on something else.
          </p>
          <p>
            Chartered Car is built to remove those small failures. Every trip is reserved in advance
            with a named passenger, a confirmed vehicle and a professional driver. Airport pickups
            carry a flight number so the schedule follows the flight. Corporate travel runs on one
            account with one contact. The vehicles are unmarked, late-model and clean.
          </p>
          <p>
            We work in Columbus and across Central Ohio — downtown offices, Dublin and New Albany
            campuses, Short North restaurants, and a great many trips to and from CMH at hours that
            no one enjoys. Being local is not a slogan here; it is why our drivers know which airport
            door is quickest at 6 a.m. and which downtown garage will cost you ten minutes.
          </p>
          <p>
            If you want the long version, call us. If you want a car, the booking takes about a
            minute.
          </p>
        </div>

        <aside className="border-t-2 border-ink pt-6">
          <h2 className="text-[var(--text-h3)]">The short version</h2>
          <dl className="mt-5 grid gap-4 text-[0.9375rem]">
            <div>
              <dt className="text-slate">Based in</dt>
              <dd className="text-ink">
                {site.area.city}, {site.area.region}
              </dd>
            </div>
            <div>
              <dt className="text-slate">Service area</dt>
              <dd className="text-ink">Columbus and Central Ohio, plus regional trips on request</dd>
            </div>
            <div>
              <dt className="text-slate">What we drive</dt>
              <dd className="text-ink">Executive sedans, luxury SUVs, executive Sprinters</dd>
            </div>
            <div>
              <dt className="text-slate">How to reserve</dt>
              <dd className="text-ink">
                <Link href="/book" className="underline decoration-mist underline-offset-4 hover:decoration-ink">
                  Online
                </Link>
                , by phone, or through a corporate account
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-[0.875rem] leading-relaxed text-slate">
            Licensing, insurance details and company history will appear here once supplied by the
            business. We do not publish credentials we have not verified.
          </p>
        </aside>
      </div>

      <FinalCTA />
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
