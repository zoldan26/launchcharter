"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AddressField } from "@/components/booking/AddressField";
import { DatePicker } from "@/components/booking/DatePicker";
import { TimeSelect } from "@/components/booking/TimeSelect";
import { activeFleet } from "@/lib/fleet";
import { quoteSchema } from "@/lib/validation";
import { captureAttribution, track } from "@/lib/analytics";

type Values = {
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  passengers: number;
  vehicleId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes: string;
};

const initial: Values = {
  pickup: "",
  dropoff: "",
  date: "",
  time: "",
  passengers: 1,
  vehicleId: "unsure",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  notes: "",
};

export function QuoteForm() {
  const params = useSearchParams();
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (params.get("service") === "airport") {
      setValues((v) => ({ ...v, pickup: "John Glenn Columbus International Airport (CMH)" }));
    }
  }, [params]);

  const set = (patch: Partial<Values>) => {
    setValues((v) => ({ ...v, ...patch }));
    setErrors({});
  };

  async function submit() {
    const attribution = captureAttribution();
    const parsed = quoteSchema.safeParse({ ...values, source: attribution.source });
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[issue.path.length - 1] ?? "form");
        if (!map[key]) map[key] = issue.message;
      }
      setErrors(map);
      return;
    }

    setSending(true);
    setFormError(null);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          referrer: attribution.referrer ?? undefined,
          utm: attribution.utm,
        }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) {
        setFormError(data.error || "We could not send that. Check the details and try again.");
        return;
      }
      track("quote_requested", { vehicle: values.vehicleId, passengers: values.passengers });
      setDone(true);
    } catch {
      setFormError("We could not reach the server. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="border-t-2 border-ink pt-8">
        <h2 className="text-[var(--text-h2)]">Your quote request is in</h2>
        <p className="u-measure-wide mt-4 text-[var(--text-lede)] leading-relaxed text-graphite">
          We have the details and will come back to you with pricing and availability. A copy is in
          your inbox, and you can reply to it with anything you forgot to mention.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <AddressField
          name="pickup"
          label="Pickup location"
          placeholder="Address, hotel or airport"
          value={values.pickup}
          error={errors.pickup}
          onChange={(pickup) => set({ pickup })}
        />
        <AddressField
          name="dropoff"
          label="Destination"
          placeholder="Address, venue or airport"
          value={values.dropoff}
          error={errors.dropoff}
          onChange={(dropoff) => set({ dropoff })}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_18rem]">
        <DatePicker value={values.date} error={errors.date} onChange={(date) => set({ date, time: "" })} />
        <div className="grid content-start gap-5">
          <TimeSelect date={values.date} value={values.time} error={errors.time} onChange={(time) => set({ time })} />
          <div>
            <label htmlFor="q-passengers" className="field-label">
              Passengers
            </label>
            <select
              id="q-passengers"
              className="field"
              value={values.passengers}
              onChange={(e) => set({ passengers: Number(e.target.value) })}
            >
              {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="q-vehicle" className="field-label">
              Vehicle preference
            </label>
            <select
              id="q-vehicle"
              className="field"
              value={values.vehicleId}
              onChange={(e) => set({ vehicleId: e.target.value })}
            >
              <option value="unsure">Not sure yet</option>
              {activeFleet.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-5 border-t border-rule pt-6 sm:grid-cols-2">
        <div>
          <label htmlFor="q-first" className="field-label">
            First name
          </label>
          <input
            id="q-first"
            className="field"
            autoComplete="given-name"
            value={values.firstName}
            aria-invalid={errors.firstName ? true : undefined}
            onChange={(e) => set({ firstName: e.target.value })}
          />
          {errors.firstName ? <span className="field-error">{errors.firstName}</span> : null}
        </div>
        <div>
          <label htmlFor="q-last" className="field-label">
            Last name (optional)
          </label>
          <input
            id="q-last"
            className="field"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(e) => set({ lastName: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="q-phone" className="field-label">
            Phone
          </label>
          <input
            id="q-phone"
            className="field"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            aria-invalid={errors.phone ? true : undefined}
            onChange={(e) => set({ phone: e.target.value })}
          />
          {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
        </div>
        <div>
          <label htmlFor="q-email" className="field-label">
            Email
          </label>
          <input
            id="q-email"
            className="field"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            aria-invalid={errors.email ? true : undefined}
            onChange={(e) => set({ email: e.target.value })}
          />
          {errors.email ? <span className="field-error">{errors.email}</span> : null}
        </div>
      </div>

      <div>
        <label htmlFor="q-notes" className="field-label">
          Anything else (optional)
        </label>
        <textarea
          id="q-notes"
          className="field min-h-[6rem] resize-y"
          placeholder="Stops, flight number, luggage, timing."
          value={values.notes}
          onChange={(e) => set({ notes: e.target.value })}
        />
      </div>

      {formError ? (
        <p role="alert" className="border-l-2 border-[#9b2c2c] bg-bone px-4 py-3 text-[0.9375rem] text-[#9b2c2c]">
          {formError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="button" className="btn btn-primary sm:min-w-[12rem]" disabled={sending} onClick={submit}>
          {sending ? "Sending…" : "Get my quote"}
        </button>
        <p className="text-[0.875rem] text-slate">
          No account required. We usually reply the same day.
        </p>
      </div>
    </div>
  );
}
