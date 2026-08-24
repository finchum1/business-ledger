-- Lets an expense be tagged with which contractor/vendor it was paid to, so
-- "how much have I paid X" is a real report instead of a manual search.
-- Mirrors the categories table pattern exactly: a managed, self-service list
-- (add/rename/deactivate/delete) that drives suggestions, while
-- transactions.contractor stays free text so a one-off payee never blocks
-- entry or needs a code change.

create table if not exists contractors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table contractors enable row level security;

create policy "authenticated read contractors" on contractors
  for select using (auth.uid() is not null);
create policy "authenticated write contractors" on contractors
  for insert with check (auth.uid() is not null);
create policy "authenticated update contractors" on contractors
  for update using (auth.uid() is not null);
create policy "authenticated delete contractors" on contractors
  for delete using (auth.uid() is not null);

alter table transactions add column if not exists contractor text;
