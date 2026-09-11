import { site } from "@/lib/site.config";

/**
 * Testimonials.
 *
 * This array is empty on purpose: no review has been supplied, and the site
 * will not invent one. Add real, attributable quotes here and the section
 * renders itself. Until then it stays off the page entirely — an empty
 * testimonial block is worse than no block at all.
 *
 * Shape: { quote, name, role }
 */
export const testimonials: { quote: string; name: string; role: string }[] = [];

export function Testimonials() {
  if (!testimonials.length) return null;

  return (
    <section className="section">
      <div className="u-wrap">
        <div className="section-head">
          <h2 className="text-[var(--text-h2)]">What clients say</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="border-t border-ink pt-5">
              <blockquote className="text-[1.0625rem] leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 text-[0.875rem] text-slate">
                {t.name}, {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="sr-only">Reviews for {site.name}.</p>
      </div>
    </section>
  );
}
