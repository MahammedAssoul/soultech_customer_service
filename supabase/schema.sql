-- ============================================================
-- Soultech Vending — Customer Support Portal
-- Supabase schema + Row Level Security
-- Run this in the Supabase SQL editor (or via supabase db push).
-- ============================================================

-- ---------- machines ----------
create table if not exists public.machines (
  id uuid primary key default gen_random_uuid(),
  machine_code text not null unique,
  name text not null,
  name_ar text,
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.machines is
  'Vending machines. machine_code is the public identifier used in QR codes.';

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  brand text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.products is
  'Products that can be stocked in vending machines.';

-- ---------- customer_issues ----------
create table if not exists public.customer_issues (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  machine_id uuid not null references public.machines (id) on delete cascade,
  issue_type text not null,
  description text,
  photo_url text,
  customer_phone text,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'resolved', 'rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

comment on table public.customer_issues is
  'Issues reported by customers for a specific machine.';

-- ---------- product_requests ----------
create table if not exists public.product_requests (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  machine_id uuid not null references public.machines (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  description text,
  customer_phone text,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'resolved', 'rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

comment on table public.product_requests is
  'Product requests from customers. product_id is nullable because customers
   can request products that do not exist in the product database yet.';

-- ---------- indexes for analytics ----------
create index if not exists customer_issues_machine_id_idx
  on public.customer_issues (machine_id);
create index if not exists customer_issues_status_idx
  on public.customer_issues (status);
create index if not exists customer_issues_issue_type_idx
  on public.customer_issues (issue_type);
create index if not exists product_requests_machine_id_idx
  on public.product_requests (machine_id);
create index if not exists product_requests_product_id_idx
  on public.product_requests (product_id);
create index if not exists product_requests_status_idx
  on public.product_requests (status);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.machines enable row level security;
alter table public.products enable row level security;
alter table public.customer_issues enable row level security;
alter table public.product_requests enable row level security;

-- Machines: anyone can read active machines only.
drop policy if exists "machines_select_active" on public.machines;
create policy "machines_select_active"
  on public.machines for select
  using (is_active = true);

-- Products: anyone can read active products only.
drop policy if exists "products_select_active" on public.products;
create policy "products_select_active"
  on public.products for select
  using (is_active = true);

-- Customer issues: anyone can create.
drop policy if exists "customer_issues_insert" on public.customer_issues;
create policy "customer_issues_insert"
  on public.customer_issues for insert
  with check (true);

-- Customer issues: anyone can read a submission by its reference number.
drop policy if exists "customer_issues_select_by_reference" on public.customer_issues;
create policy "customer_issues_select_by_reference"
  on public.customer_issues for select
  using (reference_number is not null);

-- Product requests: anyone can create.
drop policy if exists "product_requests_insert" on public.product_requests;
create policy "product_requests_insert"
  on public.product_requests for insert
  with check (true);

-- Product requests: anyone can read a submission by its reference number.
drop policy if exists "product_requests_select_by_reference" on public.product_requests;
create policy "product_requests_select_by_reference"
  on public.product_requests for select
  using (reference_number is not null);

-- ============================================================
-- Storage bucket for customer photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('customer-photos', 'customer-photos', true)
on conflict (id) do nothing;

-- Anyone can upload to the customer-photos bucket.
drop policy if exists "customer_photos_insert" on storage.objects;
create policy "customer_photos_insert"
  on storage.objects for insert
  with check (bucket_id = 'customer-photos');

-- Anyone can read photos from the customer-photos bucket.
drop policy if exists "customer_photos_select" on storage.objects;
create policy "customer_photos_select"
  on storage.objects for select
  using (bucket_id = 'customer-photos');