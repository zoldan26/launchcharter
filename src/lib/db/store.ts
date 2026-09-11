import "server-only";
import { randomUUID } from "node:crypto";
import type { Lead, LeadInput, LeadStatus } from "../types";

/**
 * Lead storage.
 *
 * Supabase is the production target. When SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY are present, leads are inserted into the `leads`
 * table (see supabase/schema.sql). When they are absent — a fresh clone, a
 * local dev machine — leads are appended to .data/leads.jsonl instead, so no
 * submission is ever silently lost while the database is being set up.
 *
 * The rest of the app only ever calls `saveLead()` and `listLeads()`, so an
 * admin dashboard can be built against this interface unchanged.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const storageMode: "supabase" | "file" = SUPABASE_URL && SUPABASE_KEY ? "supabase" : "file";

/** snake_case row shape, matching supabase/schema.sql. */
function toRow(lead: Lead) {
  return {
    id: lead.id,
    kind: lead.kind,
    status: lead.status,
    created_at: lead.createdAt,
    first_name: lead.firstName,
    last_name: lead.lastName,
    phone: lead.phone,
    email: lead.email,
    company: lead.company,
    trip_type: lead.tripType,
    pickup: lead.pickup,
    dropoff: lead.dropoff,
    pickup_at: lead.pickupAt,
    return_at: lead.returnAt,
    duration_hours: lead.durationHours,
    passengers: lead.passengers,
    vehicle_id: lead.vehicleId,
    flight_number: lead.flightNumber,
    notes: lead.notes,
    estimate_cents: lead.estimateCents,
    payment_status: lead.paymentStatus,
    payment_ref: lead.paymentRef,
    source: lead.source,
    referrer: lead.referrer,
    utm: lead.utm,
  };
}

async function supabase() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(SUPABASE_URL!, SUPABASE_KEY!, {
    auth: { persistSession: false },
  });
}

async function appendToFile(lead: Lead) {
  const { mkdir, appendFile } = await import("node:fs/promises");
  await mkdir(".data", { recursive: true });
  await appendFile(".data/leads.jsonl", `${JSON.stringify(lead)}\n`, "utf8");
}

export async function saveLead(input: LeadInput): Promise<Lead> {
  const lead: Lead = {
    ...input,
    id: randomUUID(),
    status: "new" satisfies LeadStatus,
    createdAt: new Date().toISOString(),
  };

  if (storageMode === "supabase") {
    const client = await supabase();
    const { error } = await client.from("leads").insert(toRow(lead));
    if (error) throw new Error(`Could not save lead: ${error.message}`);
    return lead;
  }

  await appendToFile(lead);
  return lead;
}

/** Read side, ready for an admin dashboard. */
export async function listLeads(limit = 100): Promise<Lead[]> {
  if (storageMode === "supabase") {
    const client = await supabase();
    const { data, error } = await client
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as Lead[];
  }

  const { readFile } = await import("node:fs/promises");
  try {
    const raw = await readFile(".data/leads.jsonl", "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Lead)
      .reverse()
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  if (storageMode !== "supabase") {
    throw new Error("Status updates require Supabase. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  const client = await supabase();
  const { error } = await client.from("leads").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}
