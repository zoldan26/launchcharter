import Link from "next/link";
import { locations } from "@/lib/locations";

export function ServiceArea() {
  return (
    <section className="section">
      <div className="u-wrap">
        <div className="section-head">
          <h2 className="text-[var(--text-h2)]">Where we drive</h2>
          <p className="u-measure-wide text-[var(--text-lede)] leading-relaxed text-graphite">
            Columbus and the communities around it, plus longer regional trips on request. If your
            pickup is outside this list, ask — we usually cover it.
          </p>
        </div>

        <ul className="grid gap-x-8 gap-y-px border-t border-rule sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => (
            <li key={l.slug} className="border-b border-rule py-4">
              {l.landingPage ? (
                <Link href={`/${l.slug}`} className="group block">
                  <span className="text-[1.0625rem] text-ink underline decoration-mist underline-offset-4 group-hover:decoration-ink">
                    {l.name}
                  </span>
                  <span className="mt-0.5 block text-[0.875rem] text-slate">{l.note}</span>
                </Link>
              ) : (
                <div>
                  <span className="text-[1.0625rem] text-ink">{l.name}</span>
                  <span className="mt-0.5 block text-[0.875rem] text-slate">{l.note}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
