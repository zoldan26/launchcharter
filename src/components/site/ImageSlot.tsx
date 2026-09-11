import Image from "next/image";

/**
 * Photography slot.
 *
 * The business has not supplied photography yet, so every image on the site
 * goes through here. With a `src` it renders a real optimised image; without
 * one it renders a quiet tonal panel of the right shape — never a stock photo
 * standing in for a vehicle this company may not operate.
 *
 * Drop files into /public and set the `image` field in lib/fleet.ts, or pass a
 * src directly, to replace a panel with the real thing.
 *
 * Positioning: the wrapper is `relative` by default, because next/image with
 * `fill` needs a positioned ancestor. A caller that needs the slot positioned
 * some other way — a full-bleed hero background, for instance — passes its own
 * position class and we step aside. Emitting both would be a silent bug:
 * Tailwind orders `.absolute` before `.relative`, so `relative` would win on
 * source order, the box would collapse to zero height, and the image would
 * simply not appear.
 */
const POSITIONED = /(^|\s)(absolute|fixed|sticky|static)(\s|$)/;
export function ImageSlot({
  src,
  alt,
  className = "",
  tone = "dark",
  priority = false,
  sizes = "100vw",
  label,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  tone?: "dark" | "light";
  priority?: boolean;
  sizes?: string;
  label?: string;
}) {
  const position = POSITIONED.test(className) ? "" : "relative";

  if (src) {
    return (
      <div className={`${position} overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label={alt}
      className={`${position} overflow-hidden ${dark ? "bg-carbon" : "bg-bone"} ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: dark
            ? "radial-gradient(120% 90% at 72% 18%, rgba(255,255,255,.09), transparent 62%)"
            : "radial-gradient(120% 90% at 72% 18%, rgba(16,17,19,.07), transparent 62%)",
        }}
      />
      <div
        aria-hidden
        className={`absolute inset-x-0 bottom-0 h-px ${dark ? "bg-white/10" : "bg-ink/10"}`}
      />
      {label ? (
        <span
          className={`absolute bottom-3 left-3 text-[11px] tracking-wide ${
            dark ? "text-white/40" : "text-slate"
          }`}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
