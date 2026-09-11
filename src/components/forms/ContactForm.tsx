"use client";

import { useState } from "react";
import { contactSchema } from "@/lib/validation";
import { captureAttribution, track } from "@/lib/analytics";

type Values = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  notes: string;
};

const initial: Values = { firstName: "", lastName: "", phone: "", email: "", company: "", notes: "" };

/**
 * Shared by the contact page and the corporate account request.
 * `variant` changes the labels, the CTA and the tracking event — nothing else.
 */
export function ContactForm({
  variant = "contact",
  notesLabel,
  notesPlaceholder,
  cta,
  successTitle,
  successBody,
}: {
  variant?: "contact" | "corporate";
  notesLabel?: string;
  notesPlaceholder?: string;
  cta?: string;
  successTitle?: string;
  successBody?: string;
}) {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const corporate = variant === "corporate";
  const set = (patch: Partial<Values>) => {
    setValues((v) => ({ ...v, ...patch }));
    setErrors({});
  };

  async function submit() {
    const attribution = captureAttribution();
    const parsed = contactSchema.safeParse({ ...values, source: variant });
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
      const res = await fetch("/api/contact", {
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
      track(corporate ? "corporate_inquiry" : "contact_submitted", {});
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
        <h2 className="text-[var(--text-h3)]">
          {successTitle ?? (corporate ? "Your request is in" : "Thanks — we have your message")}
        </h2>
        <p className="u-measure-wide mt-3 leading-relaxed text-graphite">
          {successBody ??
            (corporate
              ? "Someone from our team will reach out to set up the account and walk through billing and standing trips."
              : "Someone will reply shortly. If it is urgent, calling is the fastest way to reach us.")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-first" className="field-label">
            First name
          </label>
          <input
            id="c-first"
            className="field"
            autoComplete="given-name"
            value={values.firstName}
            aria-invalid={errors.firstName ? true : undefined}
            onChange={(e) => set({ firstName: e.target.value })}
          />
          {errors.firstName ? <span className="field-error">{errors.firstName}</span> : null}
        </div>
        <div>
          <label htmlFor="c-last" className="field-label">
            Last name (optional)
          </label>
          <input
            id="c-last"
            className="field"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(e) => set({ lastName: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-email" className="field-label">
            Email
          </label>
          <input
            id="c-email"
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
        <div>
          <label htmlFor="c-phone" className="field-label">
            Phone (optional)
          </label>
          <input
            id="c-phone"
            className="field"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set({ phone: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="c-company" className="field-label">
          Company {corporate ? "" : "(optional)"}
        </label>
        <input
          id="c-company"
          className="field"
          autoComplete="organization"
          value={values.company}
          onChange={(e) => set({ company: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="c-notes" className="field-label">
          {notesLabel ?? (corporate ? "What does your travel look like?" : "How can we help?")}
        </label>
        <textarea
          id="c-notes"
          className="field min-h-[8rem] resize-y"
          placeholder={
            notesPlaceholder ??
            (corporate
              ? "Roughly how often you travel, who books, how you would like to be billed."
              : "Tell us about the trip or the question.")
          }
          value={values.notes}
          aria-invalid={errors.notes ? true : undefined}
          onChange={(e) => set({ notes: e.target.value })}
        />
        {errors.notes ? <span className="field-error">{errors.notes}</span> : null}
      </div>

      {formError ? (
        <p role="alert" className="border-l-2 border-[#9b2c2c] bg-bone px-4 py-3 text-[0.9375rem] text-[#9b2c2c]">
          {formError}
        </p>
      ) : null}

      <div>
        <button type="button" className="btn btn-primary sm:min-w-[14rem]" disabled={sending} onClick={submit}>
          {sending ? "Sending…" : (cta ?? (corporate ? "Request a corporate account" : "Send message"))}
        </button>
      </div>
    </div>
  );
}
