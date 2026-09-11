import Link from "next/link";
import { PhoneLink } from "@/components/site/PhoneLink";

export function FinalCTA() {
  return (
    <section className="section bg-ink text-paper">
      <div className="u-wrap">
        <h2 className="u-measure-wide text-[var(--text-h2)]">Ready when you are</h2>
        <p className="u-measure-wide mt-5 text-[var(--text-lede)] leading-relaxed text-paper/70">
          Tell us where you are going and we will take it from there. No account, no app, about a
          minute.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/book" className="btn btn-inverse sm:min-w-[11rem]">
            Book a ride
          </Link>
          <Link href="/quote" className="btn btn-outline-light sm:min-w-[11rem]">
            Get a quote
          </Link>
          <PhoneLink location="final-cta" className="btn btn-outline-light sm:min-w-[11rem]">
            Call reservations
          </PhoneLink>
        </div>
      </div>
    </section>
  );
}
