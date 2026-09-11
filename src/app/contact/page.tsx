import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { PhoneLink } from "@/components/site/PhoneLink";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { site, isPlaceholder } from "@/lib/site.config";
import { locations } from "@/lib/locations";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Chartered Car for black car service in Columbus, Ohio. Call, email, or send a message and we will reply shortly.",
  path: "/contact",
});

export default function ContactPage() {
  const trail = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
  ];
  const phoneKnown = !isPlaceholder(site.contact.phone) && Boolean(site.contact.phoneRaw);
  const emailKnown = !isPlaceholder(site.contact.email);

  return (
    <>
      <PageHeader
        title="Contact"
        lede="Reservations, changes, corporate accounts or a question about a trip — whichever is easiest."
        trail={trail}
      />

      <div className="u-wrap section-tight grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <dl className="grid gap-6">
            <div className="border-t border-ink pt-4">
              <dt className="text-[0.8125rem] text-slate">Phone</dt>
              <dd className="mt-1 text-[1.0625rem]">
                {phoneKnown ? (
                  <PhoneLink location="contact-page" className="underline decoration-mist underline-offset-4 hover:decoration-ink" />
                ) : (
                  <span className="text-slate">[Phone number to be added]</span>
                )}
              </dd>
            </div>
            <div className="border-t border-ink pt-4">
              <dt className="text-[0.8125rem] text-slate">Email</dt>
              <dd className="mt-1 text-[1.0625rem]">
                {emailKnown ? (
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="underline decoration-mist underline-offset-4 hover:decoration-ink"
                  >
                    {site.contact.email}
                  </a>
                ) : (
                  <span className="text-slate">[Email address to be added]</span>
                )}
              </dd>
            </div>
            {site.contact.hours ? (
              <div className="border-t border-ink pt-4">
                <dt className="text-[0.8125rem] text-slate">Hours</dt>
                <dd className="mt-1 text-[1.0625rem]">{site.contact.hours}</dd>
              </div>
            ) : null}
            <div className="border-t border-ink pt-4">
              <dt className="text-[0.8125rem] text-slate">Service area</dt>
              <dd className="mt-2 text-[0.9375rem] leading-relaxed text-graphite">
                Columbus and Central Ohio, including{" "}
                {locations
                  .filter((l) => l.slug !== "columbus-airport-car-service")
                  .slice(0, 8)
                  .map((l) => l.name)
                  .join(", ")}
                , and John Glenn Columbus International Airport. Longer regional trips on request.
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="text-[var(--text-h2)]">Send a message</h2>
          <p className="u-measure mt-3 text-[0.9375rem] leading-relaxed text-slate">
            For a specific trip, the booking form is faster — it collects everything we need in one
            pass.
          </p>
          <div className="mt-7">
            <ContactForm />
          </div>
        </div>
      </div>

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
