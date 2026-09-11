/**
 * Address autocomplete.
 *
 * Suggestions come from Google Places via /api/places, which keeps the API key
 * on the server. When GOOGLE_PLACES_API_KEY is unset the endpoint returns an
 * empty list and the address fields behave as ordinary text inputs — the
 * booking flow still works end to end, it just does not suggest.
 */
export type PlaceSuggestion = { id: string; primary: string; secondary: string };

export async function fetchSuggestions(
  input: string,
  signal?: AbortSignal,
): Promise<PlaceSuggestion[]> {
  if (input.trim().length < 3) return [];
  try {
    const res = await fetch(`/api/places?q=${encodeURIComponent(input)}`, { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as { suggestions?: PlaceSuggestion[] };
    return data.suggestions ?? [];
  } catch {
    return [];
  }
}
