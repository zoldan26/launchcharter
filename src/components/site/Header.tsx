"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";
import { PhoneLink } from "./PhoneLink";
import { track } from "@/lib/analytics";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/fleet", label: "Fleet" },
  { href: "/corporate", label: "Corporate" },
  { href: "/columbus-airport-car-service", label: "Airport" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    /*
      The blur lives on the inner bar, not on <header>. backdrop-filter creates
      a containing block for fixed-position descendants, so a blurred header
      would position the mobile panel below against the 4rem bar instead of the
      viewport — top-16 and bottom-0 inside a 4rem box collapse it to zero
      height, and the menu opens onto nothing.
    */
    <header className="sticky top-0 z-50">
      <div className="border-b border-rule bg-paper/95 backdrop-blur-sm">
        <div className="u-wrap flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
          <Wordmark />

          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[0.9375rem] transition-colors ${
                    active ? "text-ink" : "text-slate hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <PhoneLink
              location="header"
              className="hidden text-[0.9375rem] text-ink underline decoration-mist underline-offset-4 hover:decoration-ink md:inline"
            />
            <Link
              href="/book"
              onClick={() => track("book_ride_clicked", { location: "header" })}
              className="btn btn-primary hidden min-h-[2.75rem] px-5 text-sm sm:inline-flex"
            >
              Book a ride
            </Link>
            <button
              type="button"
              className="btn btn-outline min-h-[2.75rem] px-4 text-sm lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="fixed inset-x-0 top-16 bottom-0 z-50 bg-paper lg:hidden">
          <nav aria-label="Main" className="u-wrap flex h-full flex-col pt-2 pb-28">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-rule py-5 text-[1.375rem] tracking-[-0.015em]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-8 grid gap-3">
              <Link
                href="/book"
                onClick={() => track("book_ride_clicked", { location: "mobile-nav" })}
                className="btn btn-primary w-full"
              >
                Book a ride
              </Link>
              <Link href="/quote" className="btn btn-outline w-full">
                Get a quote
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
