-- ============================================================
-- Soultech Vending — Product Request Voting System
-- Run this in the Supabase SQL editor after schema.sql.
-- ============================================================

-- ---------- requested_products ----------
-- A product that has been requested for a specific machine and can be voted on.
create table if not exists public.requested_products (
  id uuid primary key default gen_random_uuid(),
  machine_id uuid not null references public.machines (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  category text,
  photo_url text,
  admin_note text,
  vote_count integer not null default 0 check (vote_count >= 0),
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'approved', 'available', 'rejected')),
  created_at timestamptz not null default now()
);

comment on table public.requested_products is
  'Products requested for a specific machine. Customers vote on these.';

-- Prevent duplicate requests for the same product on the same machine
-- (when the product exists in the products table).
create unique index if not exists requested_products_machine_product_uidx
  on public.requested_products (machine_id, product_id)
  where product_id is not null;

create index if not exists requested_products_machine_id_idx
  on public.requested_products (machine_id);
create index if not exists requested_products_vote_count_idx
  on public.requested_products (vote_count desc);

-- ---------- product_request_votes ----------
-- One row per anonymous voter per requested product.
create table if not exists public.product_request_votes (
  id uuid primary key default gen_random_uuid(),
  product_request_id uuid not null references public.requested_products (id) on delete cascade,
  voter_id text not null,
  created_at timestamptz not null default now(),
  unique (product_request_id, voter_id)
);

comment on table public.product_request_votes is
  'Votes on requested products. The unique (product_request_id, voter_id)
   constraint prevents the same anonymous customer from voting twice.';

create index if not exists product_request_votes_product_request_id_idx
  on public.product_request_votes (product_request_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.requested_products enable row level security;
alter table public.product_request_votes enable row level security;

-- Requested products: anyone can read.
drop policy if exists "requested_products_select" on public.requested_products;
create policy "requested_products_select"
  on public.requested_products for select
  using (true);

-- Requested products: customers can create (a new request).
drop policy if exists "requested_products_insert" on public.requested_products;
create policy "requested_products_insert"
  on public.requested_products for insert
  with check (true);

-- Requested products: only admins can update (photos, notes, status, vote_count).
drop policy if exists "requested_products_admin_update" on public.requested_products;
create policy "requested_products_admin_update"
  on public.requested_products for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Votes: anyone can insert (voting).
drop policy if exists "product_request_votes_insert" on public.product_request_votes;
create policy "product_request_votes_insert"
  on public.product_request_votes for insert
  with check (true);

-- Votes: anyone can read.
drop policy if exists "product_request_votes_select" on public.product_request_votes;
create policy "product_request_votes_select"
  on public.product_request_votes for select
  using (true);

-- Votes: anyone can delete their own vote (unvote).
drop policy if exists "product_request_votes_delete" on public.product_request_votes;
create policy "product_request_votes_delete"
  on public.product_request_votes for delete
  using (true);