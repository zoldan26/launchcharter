import Link from "next/link";

/**
 * Text logotype. Set in the site's own sans at a wide tracking, with a hairline
 * beneath the "Chartered" half — a plate-and-rule mark rather than an icon.
 * Replace with an SVG here if the business supplies one.
 */
export function Wordmark({ tone = "ink", size = "sm" }: { tone?: "ink" | "paper"; size?: "sm" | "lg" }) {
  const color = tone === "paper" ? "text-paper" : "text-ink";
  const scale = size === "lg" ? "text-[1.0625rem] md:text-[1.25rem]" : "text-[0.9375rem]";
  return (
    <Link
      href="/"
      aria-label="Chartered Car — home"
      className={`inline-flex flex-col ${color} leading-none`}
    >
      <span className={`${scale} font-semibold tracking-[0.2em]`}>CHARTERED</span>
      <span
        className={`${scale} font-normal tracking-[0.2em] ${
          tone === "paper" ? "text-paper/65" : "text-slate"
        }`}
      >
        CAR
      </span>
    </Link>
  );
}
