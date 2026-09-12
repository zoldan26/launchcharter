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
 * Cancellation windows, wait times and payment terms are the business's stated
 * policy. Update this page and the "Last updated" date whenever they change.
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
            Last updated: September 12, 2026.
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
              Sedan and SUV reservations may be changed or cancelled without charge up to four
              hours before the scheduled pickup. Executive Sprinter reservations, weddings and
              event bookings require twenty-four hours. Inside those windows, half the quoted
              fare applies. Where the vehicle has been dispatched and the passenger does not
              appear, the full fare applies.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Wait time</h2>
            <p className="mt-3">
              Fifteen minutes of waiting is included at each pickup. Airport arrivals include
              sixty minutes from the actual landing time, tracked from the flight rather than the
              scheduled time, so a delayed flight does not shorten it. Waiting beyond that is
              billed in fifteen-minute increments at the vehicle's hourly rate, quoted before
              the trip.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Payment</h2>
            <p className="mt-3">
              Rates are confirmed before the trip and do not change afterwards unless the trip
              itself changes. Payment is collected after the trip is complete; corporate accounts
              are invoiced. Tolls, parking and airport fees are added at cost. Gratuity is at your
              discretion and is not included in a quoted rate.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Conduct and condition of the vehicle</h2>
            <p className="mt-3">
              Passengers are responsible for damage beyond ordinary use. A cleaning fee starting
              at $150 applies where a vehicle needs more than routine cleaning, and repairs are
              billed at cost.
              Drivers may end a trip where behaviour is unsafe or unlawful.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Delays and liability</h2>
            <p className="mt-3">
              We plan generously and track flights, but we are not liable for delays caused by
              conditions outside our control, including weather, traffic, road closures and
              airport operations. Where we are at fault, our responsibility is limited to the
              fare paid for the trip in question. We are not responsible for consequential
              losses such as missed flights, missed connections or missed events. Personal
              property left in a vehicle is returned where we can, but is carried at your own
              risk.
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
