import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { PhoneLink } from "./PhoneLink";
import { site, isPlaceholder } from "@/lib/site.config";

const columns = [
  {
    heading: "Services",
    links: [
      { href: "/columbus-airport-car-service", label: "Airport transportation" },
      { href: "/corporate", label: "Corporate transportation" },
      { href: "/book?tripType=hourly", label: "Hourly chauffeur" },
      { href: "/services", label: "Events and groups" },
      { href: "/fleet", label: "Fleet" },
    ],
  },
  {
    heading: "Reservations",
    links: [
      { href: "/book", label: "Book a ride" },
      { href: "/quote", label: "Get a quote" },
      { href: "/contact", label: "Contact" },
      { href: "/about", label: "About" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule-dark bg-ink text-paper">
      <div className="u-wrap grid gap-12 py-14 md:grid-cols-[1.2fr_1fr_1fr] md:py-16">
        <div>
          <Wordmark tone="paper" />
          <p className="u-measure mt-5 text-[0.9375rem] leading-relaxed text-paper/60">
            Private black car service for Columbus and Central Ohio. Airport transfers, corporate
            travel, hourly service and events.
          </p>
          <p className="mt-5 text-[0.9375rem] text-paper/50">Columbus, Ohio</p>

          <div className="mt-5 flex flex-col gap-1.5 text-[0.9375rem]">
            <PhoneLink location="footer" className="text-paper hover:text-paper/70" />
            {!isPlaceholder(site.contact.email) ? (
              <a href={`mailto:${site.contact.email}`} className="text-paper hover:text-paper/70">
                {site.contact.email}
              </a>
            ) : null}
            {site.contact.hours ? <span className="text-paper/50">{site.contact.hours}</span> : null}
          </div>

          {site.social.length ? (
            <div className="mt-5 flex gap-4 text-[0.9375rem]">
              {site.social.map((s) => (
                <a key={s.href} href={s.href} className="text-paper/60 hover:text-paper">
                  {s.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="text-[0.9375rem] font-medium text-paper">{col.heading}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-[0.9375rem] text-paper/60 hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-rule-dark">
        <div className="u-wrap flex flex-col gap-3 py-6 text-[0.8125rem] text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. Columbus, Ohio.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-paper/80">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-paper/80">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
