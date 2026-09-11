import Link from "next/link";
import { services } from "@/lib/services";

export function ServicesGrid() {
  return (
    <section id="services" className="section">
      <div className="u-wrap">
        <div className="section-head">
          <h2 className="text-[var(--text-h2)]">What we drive for</h2>
          <p className="u-measure-wide text-[var(--text-lede)] leading-relaxed text-graphite">
            Five kinds of work, one standard. Most of our week is airports and corporate travel; the
            rest is evenings, events and groups.
          </p>
        </div>

        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.slug} className="flex flex-col bg-paper p-6 lg:p-7">
              <h3 className="text-[var(--text-h3)]">{s.name}</h3>
              <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-graphite">{s.blurb}</p>
              <Link
                href={s.cta.href}
                className="mt-5 self-start text-[0.9375rem] text-ink underline decoration-mist underline-offset-4 hover:decoration-ink"
              >
                {s.cta.label}
              </Link>
            </article>
          ))}
          <div className="flex flex-col justify-between bg-ink p-6 text-paper lg:p-7">
            <h3 className="text-[var(--text-h3)]">Something else?</h3>
            <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-paper/70">
              Long-distance trips, multi-day schedules, several vehicles at once — tell us what the
              day looks like and we will price it.
            </p>
            <Link href="/quote" className="btn btn-inverse mt-5 self-start">
              Get a quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
