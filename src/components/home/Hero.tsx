import Link from "next/link";
import { HeroBooking } from "./HeroBooking";
import { PhoneLink } from "@/components/site/PhoneLink";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <link rel="preload" as="image" href="/hero.jpg" />
      {/*
        Backdrop: downtown Columbus at dusk, desaturated so it reads as tone
        behind the headline rather than competing with it. Replace
        /public/hero.jpg to change it.

        This is a plain CSS background rather than next/image on purpose. A
        fill image depends on its wrapper having a resolved height, and a
        negative z-index depends on the stacking context behaving — two ways
        for a hero to silently render as a black box. background-size:cover on
        an inset-0 element has neither dependency. The file is preloaded above
        so it still paints early.
      */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />
      {/*
        Scrims, as two mutually exclusive elements rather than one element with
        a responsive variant. That matters: a flat scrim compiles to
        background-color and a gradient compiles to background-image, so a
        `lg:` variant does NOT replace the base — the two stack and multiply.
        Reading them as "88% at the left" when they are really "88% over 72%"
        is how a photograph ends up invisible under near-opaque black.
      */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-[rgba(10,11,12,.72)] lg:hidden"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0 hidden lg:block lg:bg-[linear-gradient(to_right,rgba(10,11,12,.88)_0%,rgba(10,11,12,.72)_45%,rgba(10,11,12,.42)_100%)]"
      />

      <div className="u-wrap relative z-10 grid gap-10 py-14 md:py-20 lg:grid-cols-[1.05fr_26rem] lg:items-center lg:gap-16 lg:py-24">
        <div className="hero-rise">
          <p className="text-[0.875rem] text-paper/55">Columbus, Ohio</p>
          <h1 className="mt-4 text-[var(--text-h1)]">
            Private transportation.
            <br />
            Professionally driven.
          </h1>
          <p className="u-measure-wide mt-6 text-[var(--text-lede)] leading-relaxed text-paper/70">
            Premium black car service throughout Columbus and Central Ohio — airport transfers,
            corporate travel, events, hourly service and private trips, with a professional driver
            every time.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/book" className="btn btn-inverse sm:min-w-[11rem]">
              Book a ride
            </Link>
            <Link href="/quote" className="btn btn-outline-light sm:min-w-[11rem]">
              Get a quote
            </Link>
            <PhoneLink location="hero" className="btn btn-outline-light sm:min-w-[11rem]">
              Call reservations
            </PhoneLink>
          </div>
        </div>

        <div className="text-ink lg:sticky lg:top-24">
          <HeroBooking />
        </div>
      </div>
    </section>
  );
}
