-- ============================================================
-- Soultech Vending — Machine Visits (analytics)
-- Run this in the Supabase SQL editor after schema.sql.
-- ============================================================

-- ---------- machine_visits ----------
-- One row per visitor per machine page view. Used to count how many
-- visitors entered a machine page through each machine.
create table if not exists public.machine_visits (
  id uuid primary key default gen_random_uuid(),
  machine_id uuid not null references public.machines (id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now()
);

comment on table public.machine_visits is
  'Visitor events for machine pages. The app dedupes the same visitor per
   machine in localStorage, so one row ≈ one unique visitor per machine.';

create index if not exists machine_visits_machine_id_idx
  on public.machine_visits (machine_id);
create index if not exists machine_visits_created_at_idx
  on public.machine_visits (created_at);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.machine_visits enable row level security;

-- Anyone can insert (a page view).
drop policy if exists "machine_visits_insert" on public.machine_visits;
create policy "machine_visits_insert"
  on public.machine_visits for insert
  with check (true);

-- Visitors can read their own events.
drop policy if exists "machine_visits_select_own" on public.machine_visits;
create policy "machine_visits_select_own"
  on public.machine_visits for select
  using (visitor_id = (select auth.uid()::text));

-- Admins can read all visitor events.
drop policy if exists "machine_visits_admin_select" on public.machine_visits;
create policy "machine_visits_admin_select"
  on public.machine_visits for select
  using (auth.role() = 'authenticated');