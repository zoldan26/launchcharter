import type { Metadata } from "next";
import { site } from "./site.config";
import { abs } from "./schema";

/**
 * One place that builds page metadata: title, description, canonical URL and
 * Open Graph/Twitter cards. Every page calls this so nothing is ever missing a
 * canonical or an OG image.
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = abs(opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      images: [{ url: abs("/og.jpg"), width: 1200, height: 630, alt: site.tagline }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [abs("/og.jpg")],
    },
  };
}
