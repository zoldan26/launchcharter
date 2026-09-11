"use client";

import { site, isPlaceholder } from "@/lib/site.config";
import { track } from "@/lib/analytics";

/**
 * Tap-to-call. Renders nothing at all until a real number is configured, so the
 * site never shows a dead phone link or an invented number.
 */
export function PhoneLink({
  className,
  children,
  location,
}: {
  className?: string;
  children?: React.ReactNode;
  location: string;
}) {
  if (isPlaceholder(site.contact.phone) || !site.contact.phoneRaw) return null;

  return (
    <a
      href={`tel:${site.contact.phoneRaw}`}
      className={className}
      onClick={() => track("phone_clicked", { location })}
    >
      {children ?? site.contact.phone}
    </a>
  );
}

/** True at build time when a callable number exists. */
export function hasPhone(): boolean {
  return !isPlaceholder(site.contact.phone) && Boolean(site.contact.phoneRaw);
}
