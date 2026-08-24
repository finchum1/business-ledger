-- Contractors move from a single global list to a per-business roster, and a
-- parallel customers roster is introduced (also per business). Zero
-- contractor rows exist yet, so this is a clean schema change, not a data
-- migration.

alter table contractors add column if not exists business_id uuid references businesses(id) on delete cascade;
alter table contractors alter column business_id set not null;
alter table contractors drop constraint if exists contractors_name_key;
alter table contractors add constraint contractors_business_id_name_key unique (business_id, name);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  address text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (business_id, name)
);

alter table customers enable row level security;

create policy "authenticated read customers" on customers
  for select using (auth.uid() is not null);
create policy "authenticated write customers" on customers
  for insert with check (auth.uid() is not null);
create policy "authenticated update customers" on customers
  for update using (auth.uid() is not null);
create policy "authenticated delete customers" on customers
  for delete using (auth.uid() is not null);
