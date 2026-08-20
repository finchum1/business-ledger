-- Business Ledger schema
-- Run this once in the Supabase project's SQL editor.
-- Auth model: single hand-created login (Auth -> Users -> Add user, Auto Confirm),
-- no public sign-up. Any authenticated user has full access to all rows below
-- (there's only ever one real user), same pattern as OFS Office.

create extension if not exists "pgcrypto";

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete restrict,
  date date not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  amount numeric(12, 2) not null check (amount > 0),
  description text,
  created_at timestamptz not null default now()
);

create index if not exists transactions_business_id_idx on transactions(business_id);
create index if not exists transactions_date_idx on transactions(date);
create index if not exists transactions_type_idx on transactions(type);

alter table businesses enable row level security;
alter table transactions enable row level security;

create policy "authenticated read businesses" on businesses
  for select using (auth.uid() is not null);
create policy "authenticated write businesses" on businesses
  for insert with check (auth.uid() is not null);
create policy "authenticated update businesses" on businesses
  for update using (auth.uid() is not null);
create policy "authenticated delete businesses" on businesses
  for delete using (auth.uid() is not null);

create policy "authenticated read transactions" on transactions
  for select using (auth.uid() is not null);
create policy "authenticated write transactions" on transactions
  for insert with check (auth.uid() is not null);
create policy "authenticated update transactions" on transactions
  for update using (auth.uid() is not null);
create policy "authenticated delete transactions" on transactions
  for delete using (auth.uid() is not null);

-- Seed a starter business or two. Add/rename/deactivate the rest right in the app
-- (Businesses page) -- this list is just a starting point, not a hardcoded limit.
insert into businesses (name, sort_order) values
  ('Oklahoma Film Solutions', 1)
on conflict (name) do nothing;
