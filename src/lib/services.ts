export type Service = {
  slug: string;
  name: string;
  shortName: string;
  blurb: string;
  detail: string;
  points: string[];
  cta: { label: string; href: string };
};

export const services: Service[] = [
  {
    slug: "airport",
    name: "Airport transportation",
    shortName: "Airport",
    blurb:
      "Private transfers to and from John Glenn Columbus International Airport, with your flight number on the reservation.",
    detail:
      "Give us your flight number when you book and your driver plans around the flight rather than the clock. Early departures and late arrivals are ordinary work for us, not exceptions.",
    points: ["CMH arrivals and departures", "Flight number on every reservation", "Curbside or meet-and-greet", "Regional airports on request"],
    cta: { label: "Book airport transportation", href: "/book?service=airport" },
  },
  {
    slug: "corporate",
    name: "Corporate transportation",
    shortName: "Corporate",
    blurb:
      "Executive travel, client pickups, roadshows and recurring schedules, billed to one account.",
    detail:
      "One point of contact, consistent standards, and a single monthly invoice instead of a pile of individual receipts to reconcile.",
    points: ["Executive and client travel", "Recurring and standing trips", "Centralized billing", "Named account contact"],
    cta: { label: "Open a corporate account", href: "/corporate" },
  },
  {
    slug: "hourly",
    name: "Hourly chauffeur",
    shortName: "Hourly",
    blurb:
      "Keep a car and driver for the evening or the afternoon, with as many stops as the day requires.",
    detail:
      "Booked by the hour rather than by the trip. The car waits between stops, so nobody is parking, circling or rebooking a ride at the end of dinner.",
    points: ["Meetings across town", "Dinner and entertainment", "Multiple stops", "Nights out"],
    cta: { label: "Reserve by the hour", href: "/book?tripType=hourly" },
  },
  {
    slug: "events",
    name: "Events",
    shortName: "Events",
    blurb:
      "Weddings, concerts, games and conferences — arrivals timed to the event, not to traffic luck.",
    detail:
      "We plan around doors, kickoffs and curtain times, and we coordinate multiple vehicles when a group needs to move together.",
    points: ["Weddings", "Concerts and sporting events", "Conferences", "Private celebrations"],
    cta: { label: "Plan event transportation", href: "/quote?service=events" },
  },
  {
    slug: "group",
    name: "Group transportation",
    shortName: "Group",
    blurb:
      "Private SUV and executive van travel for teams and families moving on one schedule.",
    detail:
      "Everyone arrives at the same time, at the same door, without a caravan of separate rideshares and a half-hour of waiting in the lobby.",
    points: ["Teams and departments", "Wedding parties", "Family travel", "Multi-vehicle coordination"],
    cta: { label: "Get a group quote", href: "/quote?service=group" },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
