/**
 * Vehicle categories. Adding a category here adds it to the fleet page, the
 * booking wizard and the quote form automatically — no component edits needed.
 *
 * `example` is deliberately null everywhere. The business has not confirmed
 * specific makes and models, and the site will not claim them in copy. When
 * real fleet information is supplied, fill in `example` and it appears under
 * the category name as "Typically a <example>".
 *
 * Photography lives in /public/fleet. Each class has an exterior and an
 * interior shot — the interior is what actually sells a black car booking,
 * since it is the part of the trip the customer spends an hour in.
 */
export type Vehicle = {
  id: string;
  name: string;
  shortName: string;
  passengers: number;
  luggage: number;
  summary: string;
  bestFor: string[];
  example: string | null;
  image: string | null;
  interiorImage: string | null;
  order: number;
  active: boolean;
};

export const fleet: Vehicle[] = [
  {
    id: "executive-sedan",
    name: "Executive Sedan",
    shortName: "Sedan",
    passengers: 3,
    luggage: 3,
    summary:
      "The default choice for one to three passengers. Quiet, unmarked, and easy to meet at a curb or a terminal.",
    bestFor: ["Airport transfers", "Client pickups", "Meetings downtown", "Dinner reservations"],
    example: null,
    image: "/fleet/executive-sedan.jpg",
    interiorImage: "/fleet/executive-sedan-interior.jpg",
    order: 1,
    active: true,
  },
  {
    id: "luxury-suv",
    name: "Luxury SUV",
    shortName: "SUV",
    passengers: 6,
    luggage: 6,
    summary:
      "More room for luggage, golf bags and winter coats. The right call for families, small teams and long airport runs.",
    bestFor: ["Families", "Small teams", "Heavy luggage", "Evening events"],
    example: null,
    image: "/fleet/luxury-suv.jpg",
    interiorImage: "/fleet/luxury-suv-interior.jpg",
    order: 2,
    active: true,
  },
  {
    id: "executive-sprinter",
    name: "Executive Sprinter",
    shortName: "Sprinter",
    passengers: 14,
    luggage: 14,
    summary:
      "Executive van seating for larger groups travelling together, with space to work or talk on the way.",
    bestFor: ["Group travel", "Conferences", "Wedding parties", "Roadshows"],
    example: null,
    image: "/fleet/executive-sprinter.jpg",
    interiorImage: "/fleet/executive-sprinter-interior.jpg",
    order: 3,
    active: true,
  },
];

export const activeFleet = fleet.filter((v) => v.active).sort((a, b) => a.order - b.order);

export function getVehicle(id: string): Vehicle | undefined {
  return fleet.find((v) => v.id === id);
}
