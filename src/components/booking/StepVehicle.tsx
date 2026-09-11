"use client";

import { activeFleet } from "@/lib/fleet";
import { ImageSlot } from "@/components/site/ImageSlot";

export function StepVehicle({
  value,
  passengers,
  onChange,
  error,
}: {
  value: string;
  passengers: number;
  onChange: (id: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div role="radiogroup" aria-label="Vehicle" className="grid gap-4 sm:grid-cols-3">
        {activeFleet.map((v) => {
          const selected = value === v.id;
          const tooSmall = passengers > v.passengers;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={tooSmall}
              onClick={() => onChange(v.id)}
              className={[
                "group flex flex-col border text-left transition-colors",
                selected ? "border-ink" : "border-rule hover:border-graphite",
                tooSmall ? "cursor-not-allowed opacity-45" : "",
              ].join(" ")}
            >
              <ImageSlot
                src={v.image}
                alt={v.name}
                tone="dark"
                className="aspect-[16/10] w-full"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <span className="flex flex-1 flex-col gap-2 p-4">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[1.0625rem] font-medium">{v.name}</span>
                  <span
                    aria-hidden
                    className={`mt-1 h-4 w-4 shrink-0 rounded-full border ${
                      selected ? "border-[5px] border-ink" : "border-mist"
                    }`}
                  />
                </span>
                <span className="text-[0.8125rem] text-slate">
                  Up to {v.passengers} passengers · {v.luggage} bags
                </span>
                <span className="text-[0.875rem] leading-relaxed text-graphite">{v.summary}</span>
                {tooSmall ? (
                  <span className="text-[0.8125rem] text-slate">
                    Not enough seats for {passengers} passengers.
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
      {error ? <span className="field-error">{error}</span> : null}
      <p className="mt-4 text-[0.875rem] text-slate">
        Not sure which to choose? Pick the closest fit — we will confirm the right vehicle when we
        call.
      </p>
    </div>
  );
}
