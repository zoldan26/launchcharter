import type { FaqItem } from "@/lib/faq";

export function FaqSection({
  items,
  title = "Questions, answered",
  intro,
}: {
  items: FaqItem[];
  title?: string;
  intro?: string;
}) {
  return (
    <section className="section border-t border-rule bg-bone">
      <div className="u-wrap">
        <div className="section-head">
          <h2 className="text-[var(--text-h2)]">{title}</h2>
          {intro ? (
            <p className="u-measure-wide text-[var(--text-lede)] leading-relaxed text-graphite">
              {intro}
            </p>
          ) : null}
        </div>

        <div className="border-t border-rule">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-rule">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.0625rem] text-ink marker:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="shrink-0 text-[1.25rem] leading-none text-slate transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="u-measure-wide pb-6 text-[0.9375rem] leading-relaxed text-graphite">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
