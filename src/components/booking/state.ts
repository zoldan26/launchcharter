import { site } from "@/lib/site.config";
import type { TripType } from "@/lib/types";

export type TripState = {
  tripType: TripType;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  returnDate: string;
  returnTime: string;
  durationHours: number;
  passengers: number;
  flightNumber: string;
};

export type CustomerState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  notes: string;
};

export type BookingState = {
  trip: TripState;
  vehicleId: string;
  customer: CustomerState;
};

export const emptyBooking = (): BookingState => ({
  trip: {
    tripType: "one-way",
    pickup: "",
    dropoff: "",
    date: "",
    time: "",
    returnDate: "",
    returnTime: "",
    durationHours: site.booking.hourlyMinimumHours,
    passengers: 1,
    flightNumber: "",
  },
  vehicleId: "",
  customer: { firstName: "", lastName: "", phone: "", email: "", company: "", notes: "" },
});

/** Reads pre-fill values handed over from the homepage hero or a service link. */
export function fromSearchParams(params: URLSearchParams): Partial<TripState> & { vehicleId?: string } {
  const out: Partial<TripState> & { vehicleId?: string } = {};
  const type = params.get("tripType");
  if (type === "one-way" || type === "round-trip" || type === "hourly") out.tripType = type;
  const pickup = params.get("pickup");
  if (pickup) out.pickup = pickup;
  const dropoff = params.get("dropoff");
  if (dropoff) out.dropoff = dropoff;
  const date = params.get("date");
  if (date) out.date = date;
  const time = params.get("time");
  if (time) out.time = time;
  const pax = Number(params.get("passengers"));
  if (Number.isInteger(pax) && pax > 0) out.passengers = pax;
  const vehicle = params.get("vehicle");
  if (vehicle) out.vehicleId = vehicle;
  if (params.get("service") === "airport" && !out.pickup) {
    out.pickup = "John Glenn Columbus International Airport (CMH)";
  }
  return out;
}
