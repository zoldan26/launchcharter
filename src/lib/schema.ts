import { site, isPlaceholder } from "./site.config";
import { locations } from "./locations";
import { services } from "./services";
import type { FaqItem } from "./faq";

/**
 * Structured data. Every builder returns a plain object that <JsonLd /> emits.
 *
 * Nothing unverified is ever published: no rating, no review count, no
 * founding date, no credentials. Contact details appear only once the real
 * values are configured, so the markup can never disagree with the page.
 */

/** Absolute URL from a site-relative path. */
export function abs(path: string): string {
  return new URL(path, site.url).toString();
}

const BUSINESS_ID = `${site.url}/#business`;

function areaServed() {
  return [
    { "@type": "City", name: `${site.area.city}, ${site.area.regionCode}` },
    ...locations
      .filter((l) => l.name !== "Columbus Airport / CMH")
      .map((l) => ({ "@type": "Place", name: l.name })),
  ];
}

export function localBusinessSchema() {
  const { contact } = site;
  const hasPhone = !isPlaceholder(contact.phone) && Boolean(contact.phoneRaw);
  const hasEmail = !isPlaceholder(contact.email);

  return {
    "@context": "https://schema.org",
    "@type": "LimousineService",
    "@id": BUSINESS_ID,
    name: site.name,
    description: site.description,
    url: site.url,
    ...(hasPhone ? { telephone: contact.phoneRaw } : {}),
    ...(hasEmail ? { email: contact.email } : {}),
    address: contact.address
      ? {
          "@type": "PostalAddress",
          streetAddress: contact.address.street,
          addressLocality: contact.address.city,
          addressRegion: contact.address.region,
          postalCode: contact.address.postalCode,
          addressCountry: site.area.country,
        }
      : {
          "@type": "PostalAddress",
          addressLocality: site.area.city,
          addressRegion: site.area.regionCode,
          addressCountry: site.area.country,
        },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
      geoRadius: site.area.radiusMiles * 1609,
    },
    areaServed: areaServed(),
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Private transportation",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.blurb,
          url: abs(`/services#${service.slug}`),
        },
      })),
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": BUSINESS_ID },
    inLanguage: "en-US",
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  /** Narrows areaServed to one place — used by the local landing pages. */
  areaName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.name,
    url: abs(opts.url),
    provider: { "@id": BUSINESS_ID },
    areaServed: opts.areaName ? [{ "@type": "Place", name: opts.areaName }] : areaServed(),
  };
}

export function breadcrumbSchema(trail: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: abs(crumb.href),
    })),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
