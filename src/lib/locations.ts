/**
 * Service area + location landing pages.
 *
 * Every entry with `landingPage: true` generates a statically rendered page at
 * /<slug> with its own title, description, canonical URL, breadcrumb schema and
 * Service schema. Adding a neighbourhood to this array is the entire process
 * for adding a new local SEO page.
 */
export type Location = {
  slug: string;
  name: string;
  /** Short line used in the service-area list on the homepage. */
  note: string;
  /** Two or three sentences of genuinely location-specific copy. */
  intro: string;
  landingPage: boolean;
  /** Approximate drive time to CMH, used only where it is genuinely useful. */
  airportMinutes: number | null;
};

export const locations: Location[] = [
  {
    slug: "columbus-black-car-service",
    name: "Downtown Columbus",
    note: "Offices, hotels and the convention district",
    intro:
      "Most of our weekday work starts or ends downtown — a garage on Front Street, a hotel lobby on High, a conference exit at the Convention Center. Drivers know which entrances actually work at 7:45 in the morning and which ones will cost you ten minutes.",
    landingPage: true,
    airportMinutes: 15,
  },
  {
    slug: "columbus-airport-car-service",
    name: "Columbus Airport / CMH",
    note: "Arrivals, departures and flight-timed pickups",
    intro:
      "John Glenn Columbus International is close enough to downtown that the drive is short and the timing is unforgiving. We track the flight, not the clock.",
    landingPage: false, // handled by the dedicated /columbus-airport-car-service page
    airportMinutes: 0,
  },
  {
    slug: "dublin-black-car-service",
    name: "Dublin",
    note: "Bridge Park, corporate campuses and residential pickups",
    intro:
      "Dublin runs on early flights and corporate calendars. Bridge Park dinners and Metro Center offices are regular stops, and residential pickups out past Muirfield are routine.",
    landingPage: true,
    airportMinutes: 30,
  },
  {
    slug: "new-albany-black-car-service",
    name: "New Albany",
    note: "Residential and business park transportation",
    intro:
      "New Albany is a short run to the airport and a long one to almost everywhere else, which makes a scheduled car worth more than a rideshare gamble. We work the business park and the residential streets equally.",
    landingPage: true,
    airportMinutes: 25,
  },
  { slug: "short-north", name: "Short North", note: "Restaurants, galleries and hotels", intro: "", landingPage: false, airportMinutes: 15 },
  { slug: "german-village", name: "German Village", note: "Residential pickups on tight brick streets", intro: "", landingPage: false, airportMinutes: 20 },
  { slug: "easton", name: "Easton", note: "Hotels, offices and evening reservations", intro: "", landingPage: false, airportMinutes: 15 },
  { slug: "upper-arlington", name: "Upper Arlington", note: "Residential and university-area travel", intro: "", landingPage: false, airportMinutes: 25 },
  { slug: "grandview", name: "Grandview Heights", note: "Dinner, events and airport runs", intro: "", landingPage: false, airportMinutes: 20 },
  { slug: "worthington", name: "Worthington", note: "Residential and corporate pickups", intro: "", landingPage: false, airportMinutes: 25 },
  { slug: "westerville", name: "Westerville", note: "North-side residential travel", intro: "", landingPage: false, airportMinutes: 25 },
  { slug: "polaris", name: "Polaris", note: "Offices, hotels and event traffic", intro: "", landingPage: false, airportMinutes: 30 },
  { slug: "bexley", name: "Bexley", note: "Residential and university transportation", intro: "", landingPage: false, airportMinutes: 15 },
  { slug: "gahanna", name: "Gahanna", note: "Minutes from the airport", intro: "", landingPage: false, airportMinutes: 10 },
  { slug: "powell", name: "Powell", note: "North-side residential and family travel", intro: "", landingPage: false, airportMinutes: 35 },
  { slug: "hilliard", name: "Hilliard", note: "West-side residential and corporate", intro: "", landingPage: false, airportMinutes: 30 },
];

export const landingPageLocations = locations.filter((l) => l.landingPage);

export function getLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
