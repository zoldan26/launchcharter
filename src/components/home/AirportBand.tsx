import Link from "next/link";

export function AirportBand() {
  return (
    <section className="section bg-ink text-paper">
      <div className="u-wrap grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <h2 className="text-[var(--text-h2)]">Columbus airport transportation</h2>
          <p className="u-measure-wide mt-5 text-[var(--text-lede)] leading-relaxed text-paper/70">
            John Glenn Columbus International is a fifteen-minute drive from downtown and a much
            longer one from the suburbs at 6 a.m. Give us your flight number and we plan around the
            flight, not the schedule — delays, early arrivals and late nights included.
          </p>
          <ul className="mt-7 grid gap-2.5 text-[0.9375rem] text-paper/80 sm:grid-cols-2">
            <li>Arrivals and departures at CMH</li>
            <li>Curbside or meet-and-greet</li>
            <li>Early-morning departures</li>
            <li>Late-night arrivals</li>
            <li>Flight number on every trip</li>
            <li>Business and group travel</li>
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/book?service=airport" className="btn btn-inverse sm:min-w-[14rem]">
              Book airport transportation
            </Link>
            <Link href="/columbus-airport-car-service" className="btn btn-outline-light sm:min-w-[10rem]">
              Airport details
            </Link>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px border border-rule-dark bg-[#2c2f34]">
          {[
            { t: "CMH", d: "John Glenn Columbus International" },
            { t: "15 min", d: "Typical drive from downtown" },
            { t: "24 hrs", d: "Early departures and late arrivals" },
            { t: "Tracked", d: "Your flight, watched before pickup" },
          ].map((item) => (
            <div key={item.t} className="bg-ink px-5 py-7">
              <dt className="text-[1.375rem] font-medium">{item.t}</dt>
              <dd className="mt-1.5 text-[0.875rem] leading-relaxed text-paper/55">{item.d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
