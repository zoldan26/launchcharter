"use client";

import { useEffect, useId, useRef, useState } from "react";
import { fetchSuggestions, type PlaceSuggestion } from "@/lib/places";

/**
 * Address input with Google Places suggestions.
 * Degrades to a plain text field when no Places key is configured — the
 * customer can always type a location and the reservation still completes.
 */
export function AddressField({
  label,
  value,
  onChange,
  placeholder,
  error,
  name,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  name: string;
  autoFocus?: boolean;
}) {
  const id = useId();
  const [items, setItems] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const skip = useRef(true);

  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      const next = await fetchSuggestions(value, controller.signal);
      setItems(next);
      setOpen(next.length > 0);
      setActive(-1);
    }, 220);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function choose(s: PlaceSuggestion) {
    onChange([s.primary, s.secondary].filter(Boolean).join(", "));
    skip.current = true;
    setOpen(false);
    setItems([]);
  }

  return (
    <div ref={box} className="relative">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck={false}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className="field"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (!open || !items.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => (i + 1) % items.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => (i - 1 + items.length) % items.length);
          } else if (e.key === "Enter" && active >= 0) {
            e.preventDefault();
            choose(items[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {error ? (
        <span id={`${id}-err`} className="field-error">
          {error}
        </span>
      ) : null}

      {open && items.length ? (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="absolute z-30 mt-1 w-full overflow-hidden border border-ink bg-paper shadow-[0_12px_32px_-12px_rgba(16,17,19,.35)]"
        >
          {items.map((s, i) => (
            <li key={s.id} role="option" aria-selected={i === active}>
              <button
                type="button"
                className={`block w-full px-3.5 py-3 text-left text-[0.9375rem] ${
                  i === active ? "bg-bone" : "bg-paper hover:bg-bone"
                }`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(s)}
              >
                <span className="block text-ink">{s.primary}</span>
                {s.secondary ? (
                  <span className="block text-[0.8125rem] text-slate">{s.secondary}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
