-- ปรับตาราง prescription_items ให้รองรับ meal_timing
-- ตาราง prescription_items พร้อมเชื่อมโยง prescription_id กับ prescriptions (ซึ่งมี advice)
create table public.prescription_items (
  id uuid not null default gen_random_uuid(),
  prescription_id uuid not null,
  drug_code text null,
  name text null,
  strength text null,
  frequency text null,
  period text null,
  note text null,
  qty_per_dose integer null default 1,
  doses_per_day integer null default 1,
  period_days integer null default 1,
  meal_timing text null,
  dispensed_date date null default CURRENT_DATE,
  dispensed_time time without time zone null default CURRENT_TIME,
  total_units integer GENERATED ALWAYS as (
    (
      (
        COALESCE(qty_per_dose, 1) * COALESCE(doses_per_day, 1)
      ) * COALESCE(period_days, 1)
    )
  ) STORED,
  citizen_id text null,
  constraint prescription_items_pkey primary key (id),
  constraint prescription_items_prescription_id_fkey foreign key (prescription_id) references prescriptions (id) on delete cascade
) tablespace pg_default;

create index if not exists idx_items_rx_prescription on public.prescription_items using btree (prescription_id) tablespace pg_default;

-- ตาราง prescriptions (ต้องมี advice เพื่อเชื่อมโยงคำแนะนำหมอ)
create table if not exists public.prescriptions (
  id uuid not null default gen_random_uuid(),
  patient_id uuid not null,
  visit_id uuid null,
  doctor_id uuid null,
  advice text null,
  created_at timestamptz not null default now(),
  constraint prescriptions_pkey primary key (id)
) tablespace pg_default;

create index if not exists idx_prescriptions_patient on public.prescriptions using btree (patient_id) tablespace pg_default;