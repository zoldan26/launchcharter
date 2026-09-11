"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StepTrip } from "./StepTrip";
import { StepVehicle } from "./StepVehicle";
import { StepCustomer } from "./StepCustomer";
import { Summary } from "./Summary";
import { Confirmation } from "./Confirmation";
import { emptyBooking, fromSearchParams, type BookingState, type CustomerState, type TripState } from "./state";
import { tripSchema, customerSchema } from "@/lib/validation";
import { captureAttribution, track } from "@/lib/analytics";
import type { ZodError } from "zod";

const STEPS = [
  { key: "trip", label: "Trip", heading: "Where are you going?" },
  { key: "vehicle", label: "Vehicle", heading: "Choose your vehicle" },
  { key: "details", label: "Details", heading: "Your details" },
  { key: "review", label: "Confirm", heading: "Review and send" },
] as const;

function toErrorMap(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[issue.path.length - 1] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function BookingWizard() {
  const params = useSearchParams();
  const [state, setState] = useState<BookingState>(emptyBooking);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  // Pre-fill from the homepage hero, a service link, or a shared URL.
  useEffect(() => {
    const prefill = fromSearchParams(new URLSearchParams(params.toString()));
    const { vehicleId, ...trip } = prefill;
    setState((s) => ({
      ...s,
      trip: { ...s.trip, ...trip },
      vehicleId: vehicleId ?? s.vehicleId,
    }));
    // If the hero already collected a usable trip, open on the vehicle step.
    if (trip.pickup && trip.date && trip.time) setStep(1);
    track("booking_started", { entry: trip.pickup ? "hero" : "direct" });
    started.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTrip = (patch: Partial<TripState>) => {
    setState((s) => ({ ...s, trip: { ...s.trip, ...patch } }));
    setErrors({});
  };
  const setCustomer = (patch: Partial<CustomerState>) => {
    setState((s) => ({ ...s, customer: { ...s.customer, ...patch } }));
    setErrors({});
  };

  function goTo(next: number) {
    setStep(next);
    setErrors({});
    setFormError(null);
    requestAnimationFrame(() => top.current?.scrollIntoView({ block: "start" }));
  }

  function next() {
    if (step === 0) {
      const result = tripSchema.safeParse(state.trip);
      if (!result.success) return setErrors(toErrorMap(result.error));
    }
    if (step === 1 && !state.vehicleId) {
      return setErrors({ vehicleId: "Choose a vehicle to continue" });
    }
    if (step === 2) {
      const result = customerSchema.safeParse(state.customer);
      if (!result.success) return setErrors(toErrorMap(result.error));
    }
    track("booking_step_completed", { step: STEPS[step].key });
    goTo(step + 1);
  }

  async function submit() {
    setSubmitting(true);
    setFormError(null);
    try {
      const attribution = captureAttribution();
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip: state.trip,
          vehicleId: state.vehicleId,
          customer: state.customer,
          source: attribution.source,
          referrer: attribution.referrer ?? undefined,
          utm: attribution.utm,
        }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) {
        setFormError(data.error || "We could not send that. Check the details and try again.");
        return;
      }
      track("booking_completed", {
        vehicle: state.vehicleId,
        trip_type: state.trip.tripType,
        passengers: state.trip.passengers,
      });
      setReference(data.id.slice(0, 8).toUpperCase());
      requestAnimationFrame(() => top.current?.scrollIntoView({ block: "start" }));
    } catch {
      setFormError("We could not reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div ref={top} className="scroll-mt-24">
        <Confirmation state={state} reference={reference} />
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <div ref={top} className="scroll-mt-24">
      {/* Progress rail: four segments, the completed ones filled. */}
      <ol className="grid grid-cols-4 gap-1.5" aria-label="Booking progress">
        {STEPS.map((s, i) => (
          <li key={s.key} className="grid gap-2">
            <span
              aria-hidden
              className={`h-[3px] w-full ${i <= step ? "bg-ink" : "bg-mist"}`}
            />
            <button
              type="button"
              disabled={i > step}
              onClick={() => i < step && goTo(i)}
              aria-current={i === step ? "step" : undefined}
              className={`text-left text-[0.8125rem] ${
                i === step ? "text-ink" : i < step ? "text-slate hover:text-ink" : "text-mist"
              } ${i < step ? "cursor-pointer" : "cursor-default"}`}
            >
              {s.label}
            </button>
          </li>
        ))}
      </ol>

      <h1 className="mt-8 text-[var(--text-h2)]">{current.heading}</h1>
      <p className="mt-3 text-[0.9375rem] text-slate">
        {step === 0
          ? "No account required. Request your ride in under a minute."
          : step === 1
            ? "Every vehicle comes with a professional driver."
            : step === 2
              ? "So we can confirm the trip and reach you on the day."
              : "Check the details, then send it to our reservations team."}
      </p>

      <div className="mt-8">
        {step === 0 ? <StepTrip trip={state.trip} set={setTrip} errors={errors} /> : null}
        {step === 1 ? (
          <StepVehicle
            value={state.vehicleId}
            passengers={state.trip.passengers}
            error={errors.vehicleId}
            onChange={(vehicleId) => {
              setState((s) => ({ ...s, vehicleId }));
              setErrors({});
            }}
          />
        ) : null}
        {step === 2 ? (
          <StepCustomer
            customer={state.customer}
            set={setCustomer}
            errors={errors}
            hourly={state.trip.tripType === "hourly"}
          />
        ) : null}
        {step === 3 ? (
          <div className="grid gap-6">
            <Summary state={state} />
            <p className="text-[0.875rem] leading-relaxed text-slate">
              Sending this places a reservation request. We confirm every trip by phone or email
              before it is final, and there is nothing to pay now.
            </p>
          </div>
        ) : null}
      </div>

      {formError ? (
        <p role="alert" className="mt-6 border-l-2 border-[#9b2c2c] bg-bone px-4 py-3 text-[0.9375rem] text-[#9b2c2c]">
          {formError}
        </p>
      ) : null}

      {Object.keys(errors).length && step !== 1 ? (
        <p role="alert" className="mt-6 text-[0.9375rem] text-[#9b2c2c]">
          Check the highlighted fields above.
        </p>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button type="button" className="btn btn-outline sm:min-w-[8rem]" onClick={() => goTo(step - 1)}>
            Back
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {step < 3 ? (
          <button type="button" className="btn btn-primary sm:min-w-[12rem]" onClick={next}>
            Continue
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary sm:min-w-[12rem]"
            disabled={submitting}
            onClick={submit}
          >
            {submitting ? "Sending…" : "Request booking"}
          </button>
        )}
      </div>
    </div>
  );
}
