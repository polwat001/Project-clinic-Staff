create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  hn text unique,
  full_name text not null,
  phone text,
  dob date,
  created_at timestamptz default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  appt_code text unique,
  patient_id uuid references patients(id) on delete cascade,
  scheduled_at timestamptz not null,
  room text,
  doctor text,
  status text default 'BOOKED'
);

create table if not exists encounters (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  appointment_id uuid references appointments(id) on delete set null,
  created_at timestamptz default now(),
  urgency text default 'P3',
  status text default 'ARRIVED'
);

create table if not exists queues (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid references encounters(id) on delete cascade,
  queue_no text not null,
  kind text check (kind in ('walkin','online')) not null,
  status text default 'ARRIVED',
  room text,
  priority int default 3,
  updated_at timestamptz default now()
);

create table if not exists vitals (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid references encounters(id) on delete cascade,
  measured_at timestamptz default now(),
  sys int, dia int, hr int, rr int,
  temp_c numeric(4,1), spo2 int,
  weight_kg numeric(5,1), height_cm numeric(5,1), bmi numeric(4,1)
);

create table if not exists triage (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid references encounters(id) on delete cascade,
  chief_complaint text,
  allergies text,
  medications text,
  pmh text,
  urgency text default 'P3'
);

create table if not exists nurse_notes (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid references encounters(id) on delete cascade,
  s text, o text, a text, p text,
  created_at timestamptz default now()
);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger queues_touch before update on queues for each row execute function public.touch_updated_at();

alter publication supabase_realtime add table queues;

alter table patients enable row level security;
alter table appointments enable row level security;
alter table encounters enable row level security;
alter table queues enable row level security;
alter table vitals enable row level security;
alter table triage enable row level security;
alter table nurse_notes enable row level security;

create policy "anon all" on patients for all using (true) with check (true);
create policy "anon all" on appointments for all using (true) with check (true);
create policy "anon all" on encounters for all using (true) with check (true);
create policy "anon all" on queues for all using (true) with check (true);
create policy "anon all" on vitals for all using (true) with check (true);
create policy "anon all" on triage for all using (true) with check (true);
create policy "anon all" on nurse_notes for all using (true) with check (true);
