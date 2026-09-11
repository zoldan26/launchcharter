"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, isPlaceholder } from "@/lib/site.config";
import { track } from "@/lib/analytics";

/**
 * Persistent mobile action bar: Call and Book, always one thumb away.
 * Hidden on the booking flow itself, where it would compete with the wizard's
 * own primary action. The matching bottom padding lives on <main> so the bar
 * never covers page content.
 */
export function MobileCTABar() {
  const pathname = usePathname();
  if (pathname.startsWith("/book")) return null;

  const callable = !isPlaceholder(site.contact.phone) && Boolean(site.contact.phoneRaw);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule-dark bg-ink/95 backdrop-blur-sm lg:hidden">
      <div
        className={`grid ${callable ? "grid-cols-2" : "grid-cols-1"}`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {callable ? (
          <a
            href={`tel:${site.contact.phoneRaw}`}
            onClick={() => track("phone_clicked", { location: "mobile-bar" })}
            className="flex min-h-[3.5rem] items-center justify-center border-r border-rule-dark text-[0.9375rem] text-paper"
          >
            Call
          </a>
        ) : null}
        <Link
          href="/book"
          onClick={() => track("book_ride_clicked", { location: "mobile-bar" })}
          className="flex min-h-[3.5rem] items-center justify-center bg-paper text-[0.9375rem] font-medium text-ink"
        >
          Book a ride
        </Link>
      </div>
    </div>
  );
}
