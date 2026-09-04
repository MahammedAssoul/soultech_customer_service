-- ============================================================
-- Soultech Vending — Seed data (optional, for local development)
-- ============================================================

insert into public.machines (machine_code, name, location, is_active) values
  ('ST-001', 'ST-001', 'Main Entrance', true),
  ('ST-002', 'ST-002', 'Second Floor', true),
  ('ST-003', 'ST-003', 'Cafeteria', true)
on conflict (machine_code) do nothing;

insert into public.products (name, category, brand, is_active) values
  ('Doritos', 'Snacks', 'Doritos', true),
  ('Lay''s Classic', 'Snacks', 'Lay''s', true),
  ('Oreo', 'Snacks', 'Oreo', true),
  ('Red Bull', 'Drinks', 'Red Bull', true),
  ('Pepsi', 'Drinks', 'Pepsi', true),
  ('Coca-Cola', 'Drinks', 'Coca-Cola', true),
  ('Water 500ml', 'Drinks', 'Aquafina', true),
  ('Water 1.5L', 'Drinks', 'Aquafina', true),
  ('KitKat', 'Snacks', 'Nestlé', true),
  ('Snickers', 'Snacks', 'Mars', true),
  ('Mountain Dew', 'Drinks', 'PepsiCo', true),
  ('7UP', 'Drinks', 'PepsiCo', true)
on conflict do nothing;