import Link from "next/link";

export function CorporateBand() {
  return (
    <section className="section border-y border-rule bg-bone">
      <div className="u-wrap grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <h2 className="text-[var(--text-h2)]">Transportation partner for Columbus businesses</h2>
          <p className="u-measure-wide mt-5 text-[var(--text-lede)] leading-relaxed text-graphite">
            A corporate account puts your executives, your clients and your visiting teams on one
            billing relationship with one point of contact, instead of a pile of individual receipts
            for someone to reconcile at month end.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link href="/corporate" className="btn btn-primary sm:min-w-[15rem]">
            Open a corporate account
          </Link>
        </div>
      </div>
    </section>
  );
}
