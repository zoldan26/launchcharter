import { PageHeader } from "@/components/site/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { site, isPlaceholder } from "@/lib/site.config";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms that apply when you reserve transportation with Chartered Car.",
  path: "/terms",
});

/**
 * Starting point only. Cancellation windows, wait-time rules, payment terms and
 * liability language must be set by the business and reviewed by counsel.
 */
export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms of service"
        trail={[
          { name: "Home", href: "/" },
          { name: "Terms", href: "/terms" },
        ]}
      />
      <div className="u-wrap section-tight">
        <div className="u-measure-wide grid gap-8 leading-relaxed text-graphite">
          <p className="text-[0.875rem] text-slate">
            Last updated: [Date]. Bracketed items must be set by the business and this page reviewed
            by counsel before publication.
          </p>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Reservations</h2>
            <p className="mt-3">
              Submitting the booking form places a reservation request. A trip is confirmed when we
              confirm it by phone or email. We may decline or reschedule a request when no vehicle
              is available.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Changes and cancellations</h2>
            <p className="mt-3">
              Changes and cancellations made at least [cancellation window] before the scheduled
              pickup are accepted without charge. Later than that, [late cancellation terms] apply.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Wait time</h2>
            <p className="mt-3">
              [Complimentary wait time] is included at each pickup. Airport arrivals include
              [airport wait time] from the actual landing time. Additional waiting is billed at
              [wait rate].
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Payment</h2>
            <p className="mt-3">
              Rates are confirmed before the trip. [Payment terms — when payment is collected, what
              methods are accepted, how gratuity and tolls are handled.]
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Conduct and condition of the vehicle</h2>
            <p className="mt-3">
              Passengers are responsible for damage beyond ordinary use, billed at [damage terms].
              Drivers may end a trip where behaviour is unsafe or unlawful.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Delays and liability</h2>
            <p className="mt-3">
              We plan generously and track flights, but we are not liable for delays caused by
              conditions outside our control, including weather, traffic and road closures.
              [Liability terms.]
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Contact</h2>
            <p className="mt-3">
              Questions about these terms can go to{" "}
              {isPlaceholder(site.contact.email) ? "[Email address]" : site.contact.email}
              {isPlaceholder(site.contact.phone) ? "" : ` or ${site.contact.phone}`}.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
