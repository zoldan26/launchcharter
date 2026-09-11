import { Suspense } from "react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Get a Quote",
  description:
    "Request pricing for black car service in Columbus and Central Ohio. Tell us the trip and we will come back with a rate and availability.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <div className="section-tight">
      <div className="u-wrap max-w-4xl">
        <div className="border-t-2 border-ink pt-8">
          <h1 className="text-[var(--text-h2)]">Get a quote</h1>
          <p className="u-measure-wide mt-4 text-[var(--text-lede)] leading-relaxed text-graphite">
            Not ready to reserve? Send us the trip and we will come back with pricing and
            availability. It takes about thirty seconds.
          </p>
        </div>

        <div className="mt-9">
          <Suspense fallback={<p className="text-[0.9375rem] text-slate">Loading the form…</p>}>
            <QuoteForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
