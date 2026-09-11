import { Suspense } from "react";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { PhoneLink } from "@/components/site/PhoneLink";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Book a Ride",
  description:
    "Reserve a black car in Columbus, Ohio. Choose your trip, pick a vehicle, and send the request — no account required.",
  path: "/book",
  noIndex: false,
});

export default function BookPage() {
  return (
    <div className="section-tight">
      <div className="u-wrap max-w-4xl">
        <Suspense
          fallback={
            <p className="py-12 text-[0.9375rem] text-slate">Loading the reservation form…</p>
          }
        >
          <BookingWizard />
        </Suspense>

        <p className="mt-10 border-t border-rule pt-6 text-[0.9375rem] text-slate">
          Prefer to talk it through?{" "}
          <PhoneLink
            location="book-footer"
            className="text-ink underline decoration-mist underline-offset-4 hover:decoration-ink"
          />
          {" "}
          Our reservations team can take the booking directly.
        </p>
      </div>
    </div>
  );
}
