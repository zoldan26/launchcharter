import Link from "next/link";
import { activeFleet } from "@/lib/fleet";
import { ImageSlot } from "@/components/site/ImageSlot";

export function FleetPreview() {
  return (
    <section id="fleet" className="section">
      <div className="u-wrap">
        <div className="section-head">
          <h2 className="text-[var(--text-h2)]">The fleet</h2>
          <p className="u-measure-wide text-[var(--text-lede)] leading-relaxed text-graphite">
            Three vehicle classes covering nearly every trip. Pick by how many people and how much
            luggage are coming, and we will confirm the right car.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {activeFleet.map((v) => (
            <article key={v.id} className="flex flex-col border border-rule">
              <ImageSlot
                src={v.image}
                alt={v.name}
                tone="dark"
                className="aspect-[16/10] w-full"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[var(--text-h3)]">{v.name}</h3>
                <p className="mt-1.5 text-[0.8125rem] text-slate">
                  Up to {v.passengers} passengers · {v.luggage} bags
                </p>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-graphite">
                  {v.summary}
                </p>
                <Link
                  href={`/book?vehicle=${v.id}`}
                  className="btn btn-outline mt-5 min-h-[2.875rem] self-start px-5 text-sm"
                >
                  Book this vehicle
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-[0.875rem] text-slate">
          <Link href="/fleet" className="underline decoration-mist underline-offset-4 hover:decoration-ink">
            See capacity and luggage details for every vehicle
          </Link>
        </p>
      </div>
    </section>
  );
}
