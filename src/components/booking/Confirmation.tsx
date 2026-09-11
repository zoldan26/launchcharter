"use client";

import Link from "next/link";
import { Summary } from "./Summary";
import { PhoneLink } from "@/components/site/PhoneLink";
import type { BookingState } from "./state";

export function Confirmation({
  state,
  reference,
}: {
  state: BookingState;
  reference: string;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="border-t-2 border-ink pt-8">
        <h1 className="text-[var(--text-h2)]">Your reservation request is in</h1>
        <p className="u-measure-wide mt-4 text-[var(--text-lede)] leading-relaxed text-graphite">
          A reservation coordinator is reviewing your trip now and will confirm by phone or email.
          A copy of the details below is already in your inbox.
        </p>
        <p className="mt-4 text-[0.875rem] text-slate">Reference {reference}</p>
      </div>

      <div className="mt-8">
        <Summary state={state} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-outline">
          Back to home
        </Link>
        <PhoneLink location="confirmation" className="btn btn-primary">
          Call reservations
        </PhoneLink>
      </div>
    </div>
  );
}
