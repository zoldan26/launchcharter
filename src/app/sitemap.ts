import type { MetadataRoute } from "next";
import { landingPageLocations } from "@/lib/locations";
import { abs } from "@/lib/schema";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/book", priority: 0.9, freq: "monthly" },
    { path: "/quote", priority: 0.8, freq: "monthly" },
    { path: "/columbus-airport-car-service", priority: 0.9, freq: "monthly" },
    { path: "/corporate", priority: 0.8, freq: "monthly" },
    { path: "/services", priority: 0.7, freq: "monthly" },
    { path: "/fleet", priority: 0.7, freq: "monthly" },
    { path: "/about", priority: 0.5, freq: "yearly" },
    { path: "/contact", priority: 0.6, freq: "yearly" },
    { path: "/privacy", priority: 0.2, freq: "yearly" },
    { path: "/terms", priority: 0.2, freq: "yearly" },
  ];

  return [
    ...core.map((c) => ({
      url: abs(c.path),
      lastModified: now,
      changeFrequency: c.freq,
      priority: c.priority,
    })),
    ...landingPageLocations.map((l) => ({
      url: abs(`/${l.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
