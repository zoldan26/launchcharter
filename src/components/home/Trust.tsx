/**
 * Trust section. Every line here describes how the service operates — nothing
 * claims a review count, a fleet size, years in business, or a certification,
 * because none of that has been supplied.
 */
const points = [
  {
    title: "Professional drivers",
    body: "Vetted, background-checked drivers who know Columbus and dress for the room you are walking into.",
  },
  {
    title: "Clean, premium vehicles",
    body: "Late-model black sedans and SUVs, detailed between trips. No branding on the car.",
  },
  {
    title: "On time, tracked",
    body: "We watch your flight and the traffic. If something moves, the pickup moves with it.",
  },
  {
    title: "Private by default",
    body: "No shared rides, no surge pricing, no guessing who is pulling up. One car, one trip, yours.",
  },
];

export function Trust() {
  return (
    <section className="section-tight border-b border-rule bg-bone">
      <div className="u-wrap grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((p) => (
          <div key={p.title} className="border-t border-ink pt-4">
            <h2 className="text-[1.0625rem] font-medium">{p.title}</h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-graphite">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
