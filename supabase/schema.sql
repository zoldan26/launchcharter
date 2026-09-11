-- ---------------------------------------------------------------------------
-- Chartered Car — lead database
-- Run this in the Supabase SQL editor (or `supabase db push`).
-- ---------------------------------------------------------------------------

create type lead_kind as enum ('booking', 'quote', 'contact', 'corporate');

create type lead_status as enum (
  'new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'
);

create type payment_status as enum ('none', 'authorized', 'deposit_paid', 'paid');

create table if not exists leads (
  id              uuid primary key,
  kind            lead_kind      not null,
  status          lead_status    not null default 'new',
  created_at      timestamptz    not null default now(),
  updated_at      timestamptz    not null default now(),

  -- Customer
  first_name      text           not null,
  last_name       text           not null default '',
  phone           text           not null default '',
  email           text           not null,
  company         text,

  -- Trip
  trip_type       text,                       -- one-way | round-trip | hourly
  pickup          text,
  dropoff         text,
  pickup_at       timestamptz,
  return_at       timestamptz,
  duration_hours  integer,
  passengers      integer,
  vehicle_id      text,                       -- matches lib/fleet.ts ids
  flight_number   text,
  notes           text,

  -- Money
  estimate_cents  integer,
  payment_status  payment_status,
  payment_ref     text,                       -- Stripe PaymentIntent id

  -- Attribution
  source          text           not null default 'direct',
  referrer        text,
  utm             jsonb,

  -- Internal, for the future admin dashboard
  assigned_to     text,
  internal_notes  text
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx     on leads (status);
create index if not exists leads_kind_idx       on leads (kind);
create index if not exists leads_pickup_at_idx  on leads (pickup_at);
create index if not exists leads_email_idx      on leads (email);

-- Keep updated_at honest.
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on leads;
create trigger leads_set_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- Row level security: the site writes with the service role key from the
-- server, which bypasses RLS. No anonymous client may read or write leads.
alter table leads enable row level security;

-- ---------------------------------------------------------------------------
-- Availability, for the future admin dashboard.
-- lib/availability.ts reads the same fields from site.config today; point
-- getRules() at this table when the dashboard is built.
-- ---------------------------------------------------------------------------

create table if not exists availability_rules (
  id                  integer primary key default 1,
  min_advance_hours   integer not null default 4,
  max_advance_days    integer not null default 365,
  available_weekdays  integer[] not null default '{0,1,2,3,4,5,6}',
  window_start_minutes integer not null default 0,
  window_end_minutes  integer not null default 1410,
  time_step_minutes   integer not null default 15,
  constraint single_row check (id = 1)
);

create table if not exists blackout_dates (
  day     date primary key,
  reason  text
);

-- ---------------------------------------------------------------------------
-- Vehicles and drivers, so a dashboard can prevent double bookings later.
-- ---------------------------------------------------------------------------

create table if not exists vehicles (
  id           text primary key,             -- 'executive-sedan-1'
  category_id  text not null,                -- matches lib/fleet.ts ids
  label        text not null,
  active       boolean not null default true
);

create table if not exists drivers (
  id      uuid primary key default gen_random_uuid(),
  name    text not null,
  phone   text,
  active  boolean not null default true
);

create table if not exists assignments (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references leads(id) on delete cascade,
  vehicle_id  text references vehicles(id),
  driver_id   uuid references drivers(id),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  created_at  timestamptz not null default now()
);

-- One vehicle cannot be in two places at once: overlapping assignments for the
-- same vehicle are rejected at the database level.
create extension if not exists btree_gist;

alter table assignments
  drop constraint if exists assignments_no_vehicle_overlap;

alter table assignments
  add constraint assignments_no_vehicle_overlap
  exclude using gist (
    vehicle_id with =,
    tstzrange(starts_at, ends_at) with &&
  );

alter table availability_rules enable row level security;
alter table blackout_dates     enable row level security;
alter table vehicles           enable row level security;
alter table drivers            enable row level security;
alter table assignments        enable row level security;
