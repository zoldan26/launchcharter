"use client";

import type { CustomerState } from "./state";

export function StepCustomer({
  customer,
  set,
  errors,
  hourly,
}: {
  customer: CustomerState;
  set: (patch: Partial<CustomerState>) => void;
  errors: Record<string, string>;
  hourly: boolean;
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="field-label">
            First name
          </label>
          <input
            id="firstName"
            className="field"
            autoComplete="given-name"
            value={customer.firstName}
            aria-invalid={errors.firstName ? true : undefined}
            onChange={(e) => set({ firstName: e.target.value })}
          />
          {errors.firstName ? <span className="field-error">{errors.firstName}</span> : null}
        </div>
        <div>
          <label htmlFor="lastName" className="field-label">
            Last name
          </label>
          <input
            id="lastName"
            className="field"
            autoComplete="family-name"
            value={customer.lastName}
            aria-invalid={errors.lastName ? true : undefined}
            onChange={(e) => set({ lastName: e.target.value })}
          />
          {errors.lastName ? <span className="field-error">{errors.lastName}</span> : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="field-label">
            Phone
          </label>
          <input
            id="phone"
            className="field"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(614) 555-0134"
            value={customer.phone}
            aria-invalid={errors.phone ? true : undefined}
            onChange={(e) => set({ phone: e.target.value })}
          />
          {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input
            id="email"
            className="field"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={customer.email}
            aria-invalid={errors.email ? true : undefined}
            onChange={(e) => set({ email: e.target.value })}
          />
          {errors.email ? <span className="field-error">{errors.email}</span> : null}
        </div>
      </div>

      <div>
        <label htmlFor="company" className="field-label">
          Company (optional)
        </label>
        <input
          id="company"
          className="field"
          autoComplete="organization"
          value={customer.company}
          onChange={(e) => set({ company: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="notes" className="field-label">
          Special instructions (optional)
        </label>
        <textarea
          id="notes"
          className="field min-h-[7rem] resize-y"
          placeholder={
            hourly
              ? "Stops, timing, who the driver should ask for."
              : "Gate codes, car seats, luggage, or who the driver should ask for."
          }
          value={customer.notes}
          onChange={(e) => set({ notes: e.target.value })}
        />
      </div>

      <p className="text-[0.875rem] text-slate">
        We use your phone and email only to confirm this trip and reach you on the day.
      </p>
    </div>
  );
}
