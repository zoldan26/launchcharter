import Link from "next/link";

export default function NotFound() {
  return (
    <div className="u-wrap section">
      <div className="u-measure-wide border-t-2 border-ink pt-8">
        <h1 className="text-[var(--text-h2)]">That page isn&rsquo;t here</h1>
        <p className="mt-4 text-[var(--text-lede)] leading-relaxed text-graphite">
          The link may be old or slightly off. You can book a ride, ask for a quote, or head back to
          the homepage.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/book" className="btn btn-primary sm:min-w-[11rem]">
            Book a ride
          </Link>
          <Link href="/" className="btn btn-outline sm:min-w-[11rem]">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
