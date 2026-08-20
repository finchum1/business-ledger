-- Adds a managed categories table, replacing the hardcoded suggestion lists in
-- src/lib/types.ts. Transactions.category stays free text (still typeable ad hoc
-- for one-off entries) -- this table just drives the datalist suggestions and lets
-- categories be added/renamed/deactivated from the app instead of a code change.

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('income', 'expense')),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (name, type)
);

alter table categories enable row level security;

create policy "authenticated read categories" on categories
  for select using (auth.uid() is not null);
create policy "authenticated write categories" on categories
  for insert with check (auth.uid() is not null);
create policy "authenticated update categories" on categories
  for update using (auth.uid() is not null);
create policy "authenticated delete categories" on categories
  for delete using (auth.uid() is not null);

insert into categories (name, type, sort_order) values
  ('Service Revenue', 'income', 1),
  ('Product Sales', 'income', 2),
  ('Reimbursement', 'income', 3),
  ('Interest Income', 'income', 4),
  ('Other Income', 'income', 5),
  ('Materials & Supplies', 'expense', 1),
  ('Subcontractors / Labor', 'expense', 2),
  ('Equipment', 'expense', 3),
  ('Software & Subscriptions', 'expense', 4),
  ('Insurance', 'expense', 5),
  ('Marketing & Advertising', 'expense', 6),
  ('Fees & Dues', 'expense', 7),
  ('Travel', 'expense', 8),
  ('Meals', 'expense', 9),
  ('Vehicle / Mileage', 'expense', 10),
  ('Utilities', 'expense', 11),
  ('Rent', 'expense', 12),
  ('Office Supplies', 'expense', 13),
  ('Professional Services', 'expense', 14),
  ('Taxes & Licenses', 'expense', 15),
  ('Other Expense', 'expense', 16)
on conflict (name, type) do nothing;
