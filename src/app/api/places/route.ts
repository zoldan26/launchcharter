import { NextResponse } from "next/server";
import { site } from "@/lib/site.config";

export const runtime = "nodejs";

/**
 * Server-side proxy for Google Places Autocomplete, so the API key is never
 * shipped to the browser. Returns an empty list when no key is configured,
 * which makes the address fields behave as plain text inputs.
 */
export async function GET(request: Request) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!key || q.length < 3) return NextResponse.json({ suggestions: [] });

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat",
      },
      body: JSON.stringify({
        input: q,
        includedRegionCodes: [site.area.country.toLowerCase()],
        locationBias: {
          circle: {
            center: { latitude: site.geo.lat, longitude: site.geo.lng },
            radius: site.area.radiusMiles * 1609,
          },
        },
      }),
      // Autocomplete results are stable enough to cache briefly.
      next: { revalidate: 60 },
    });

    if (!res.ok) return NextResponse.json({ suggestions: [] });

    const data = (await res.json()) as {
      suggestions?: {
        placePrediction?: {
          placeId: string;
          structuredFormat?: { mainText?: { text: string }; secondaryText?: { text: string } };
        };
      }[];
    };

    const suggestions = (data.suggestions ?? [])
      .map((s) => s.placePrediction)
      .filter(Boolean)
      .slice(0, 5)
      .map((p) => ({
        id: p!.placeId,
        primary: p!.structuredFormat?.mainText?.text ?? "",
        secondary: p!.structuredFormat?.secondaryText?.text ?? "",
      }))
      .filter((s) => s.primary);

    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("[places] lookup failed", err);
    return NextResponse.json({ suggestions: [] });
  }
}
