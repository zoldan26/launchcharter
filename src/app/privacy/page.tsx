import { PageHeader } from "@/components/site/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { site, isPlaceholder } from "@/lib/site.config";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Chartered Car collects, uses and protects the information you share when booking transportation.",
  path: "/privacy",
});

/**
 * Plain-language starting point, accurate to what this site actually does.
 * Have counsel review before launch — the bracketed items need real values.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy policy"
        trail={[
          { name: "Home", href: "/" },
          { name: "Privacy", href: "/privacy" },
        ]}
      />
      <div className="u-wrap section-tight">
        <div className="u-measure-wide grid gap-8 leading-relaxed text-graphite">
          <p className="text-[0.875rem] text-slate">
            Last updated: [Date]. This policy should be reviewed by counsel before publication.
          </p>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">What we collect</h2>
            <p className="mt-3">
              When you book a ride, request a quote, or send us a message, we collect the
              information you enter: your name, phone number, email address, company if you provide
              it, and the details of your trip, including pickup and drop-off locations, dates,
              times, passenger count, flight number and any instructions you add.
            </p>
            <p className="mt-3">
              If analytics or advertising tags are enabled on this site, they may also record
              standard web data such as pages viewed, approximate location, device type and the
              source that brought you here.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">How we use it</h2>
            <p className="mt-3">
              We use your information to confirm and provide transportation, to reach you about a
              trip, to send confirmations and receipts, and to improve how the service runs. We do
              not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Who we share it with</h2>
            <p className="mt-3">
              We share what is necessary with the driver assigned to your trip and with the service
              providers that run this website — our database host, our email provider and, when
              payments are enabled, our payment processor. Each handles the data only to deliver
              their part of the service. We may also disclose information where the law requires it.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">How long we keep it</h2>
            <p className="mt-3">
              Trip records are retained for [retention period] for accounting, dispute resolution and
              service history. You can ask us to delete information we are not required to keep.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Your choices</h2>
            <p className="mt-3">
              You can ask us for a copy of the information we hold about you, ask us to correct it,
              or ask us to delete it. You can opt out of non-essential messages at any time. Most
              browsers also let you block cookies, though parts of the site may work less well.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-h3)] text-ink">Contact</h2>
            <p className="mt-3">
              Questions about this policy can go to{" "}
              {isPlaceholder(site.contact.email) ? "[Email address]" : site.contact.email}
              {isPlaceholder(site.contact.phone) ? "" : ` or ${site.contact.phone}`}.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
