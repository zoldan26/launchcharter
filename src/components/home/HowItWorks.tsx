/** A genuine three-step sequence, so numbering it is information, not decoration. */
const steps = [
  {
    title: "Tell us where you're going",
    body: "Pickup, destination, date and time. It takes about a minute and there is no account to create.",
  },
  {
    title: "Choose your vehicle",
    body: "Sedan, SUV or Sprinter, based on how many people and how much luggage are coming along.",
  },
  {
    title: "Ride",
    body: "We confirm the trip, send you your driver's details, and handle the rest on the day.",
  },
];

export function HowItWorks() {
  return (
    <section className="section border-y border-rule bg-bone">
      <div className="u-wrap">
        <div className="section-head">
          <h2 className="text-[var(--text-h2)]">How it works</h2>
        </div>
        <ol className="grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center border border-ink text-[0.9375rem]"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-[var(--text-h3)]">{s.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-graphite">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
