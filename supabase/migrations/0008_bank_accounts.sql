-- Bank account connections via SimpleFIN (simplefin.org), per business. The
-- SimpleFIN access URL is a bearer credential (HTTP Basic Auth embedded in
-- the URL itself) -- it is written once by the connect flow and from then on
-- is only ever read by the sync-bank Edge Function using the service role
-- key. The client never re-fetches it; listing queries explicitly select a
-- column list that excludes it.
--
-- Synced transactions land in bank_transactions as a review queue
-- (status 'pending_review') rather than becoming real ledger transactions
-- automatically -- importing one writes a normal `transactions` row and
-- links back via transaction_id.

create table if not exists bank_connections (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  access_url text not null,
  status text not null default 'active' check (status in ('active', 'error', 'disabled')),
  last_error text,
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

alter table bank_connections enable row level security;

create policy "authenticated read bank_connections" on bank_connections
  for select using (auth.uid() is not null);
create policy "authenticated write bank_connections" on bank_connections
  for insert with check (auth.uid() is not null);
create policy "authenticated update bank_connections" on bank_connections
  for update using (auth.uid() is not null);
create policy "authenticated delete bank_connections" on bank_connections
  for delete using (auth.uid() is not null);

create table if not exists bank_accounts (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references bank_connections(id) on delete cascade,
  business_id uuid not null references businesses(id) on delete cascade,
  external_account_id text not null,
  name text not null,
  org_name text,
  currency text,
  current_balance numeric,
  available_balance numeric,
  balance_date timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (connection_id, external_account_id)
);

alter table bank_accounts enable row level security;

create policy "authenticated read bank_accounts" on bank_accounts
  for select using (auth.uid() is not null);
create policy "authenticated write bank_accounts" on bank_accounts
  for insert with check (auth.uid() is not null);
create policy "authenticated update bank_accounts" on bank_accounts
  for update using (auth.uid() is not null);
create policy "authenticated delete bank_accounts" on bank_accounts
  for delete using (auth.uid() is not null);

create table if not exists bank_transactions (
  id uuid primary key default gen_random_uuid(),
  bank_account_id uuid not null references bank_accounts(id) on delete cascade,
  business_id uuid not null references businesses(id) on delete cascade,
  external_transaction_id text not null,
  posted_date date,
  amount numeric not null,
  description text,
  pending boolean not null default false,
  status text not null default 'pending_review' check (status in ('pending_review', 'imported', 'ignored')),
  transaction_id uuid references transactions(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (bank_account_id, external_transaction_id)
);

alter table bank_transactions enable row level security;

create policy "authenticated read bank_transactions" on bank_transactions
  for select using (auth.uid() is not null);
create policy "authenticated write bank_transactions" on bank_transactions
  for insert with check (auth.uid() is not null);
create policy "authenticated update bank_transactions" on bank_transactions
  for update using (auth.uid() is not null);
create policy "authenticated delete bank_transactions" on bank_transactions
  for delete using (auth.uid() is not null);
