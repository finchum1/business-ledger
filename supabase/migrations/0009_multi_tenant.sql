-- Converts the app from single-tenant ("any authenticated user sees
-- everything") to multi-tenant ("each user only ever sees their own data").
-- Every table gets an owner_id (the Supabase Auth user who owns the row),
-- every RLS policy is rewritten to check it, and the two constraints that
-- assumed a single tenant (a globally-unique business name, a globally-
-- unique category name+type) become scoped per-owner instead.
--
-- owner_id defaults to auth.uid() so none of the app's many insert
-- call-sites need to change -- every existing `.insert(...)` that never
-- set owner_id keeps working, with Postgres filling it in from the
-- request's own JWT. The one exception is the bank-sync Edge Function,
-- which writes via the service role (no JWT, so no default) and sets
-- owner_id explicitly by copying it from the parent row.
--
-- All rows that already existed before this migration belong to the
-- product's original single operator -- backfilled to their real user id
-- so none of the already-in-use, real data changes hands or disappears.

-- 1. Add owner_id everywhere, nullable for now so the backfill below can run
--    before the column is locked down.
alter table businesses add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table categories add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table contractors add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table customers add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table transactions add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table invoices add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table invoice_line_items add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table bank_connections add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table bank_accounts add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table bank_transactions add column if not exists owner_id uuid references auth.users(id) on delete cascade;

-- 2. Backfill every existing row to the original operator's real user id.
update businesses set owner_id = 'b94ca3dc-5882-47fa-a675-50baadd85a36' where owner_id is null;
update categories set owner_id = 'b94ca3dc-5882-47fa-a675-50baadd85a36' where owner_id is null;
update contractors set owner_id = 'b94ca3dc-5882-47fa-a675-50baadd85a36' where owner_id is null;
update customers set owner_id = 'b94ca3dc-5882-47fa-a675-50baadd85a36' where owner_id is null;
update transactions set owner_id = 'b94ca3dc-5882-47fa-a675-50baadd85a36' where owner_id is null;
update invoices set owner_id = 'b94ca3dc-5882-47fa-a675-50baadd85a36' where owner_id is null;
update invoice_line_items set owner_id = 'b94ca3dc-5882-47fa-a675-50baadd85a36' where owner_id is null;
update bank_connections set owner_id = 'b94ca3dc-5882-47fa-a675-50baadd85a36' where owner_id is null;
update bank_accounts set owner_id = 'b94ca3dc-5882-47fa-a675-50baadd85a36' where owner_id is null;
update bank_transactions set owner_id = 'b94ca3dc-5882-47fa-a675-50baadd85a36' where owner_id is null;

-- 3. Lock owner_id down: required from now on, defaulting to the caller.
alter table businesses alter column owner_id set not null, alter column owner_id set default auth.uid();
alter table categories alter column owner_id set not null, alter column owner_id set default auth.uid();
alter table contractors alter column owner_id set not null, alter column owner_id set default auth.uid();
alter table customers alter column owner_id set not null, alter column owner_id set default auth.uid();
alter table transactions alter column owner_id set not null, alter column owner_id set default auth.uid();
alter table invoices alter column owner_id set not null, alter column owner_id set default auth.uid();
alter table invoice_line_items alter column owner_id set not null, alter column owner_id set default auth.uid();
alter table bank_connections alter column owner_id set not null, alter column owner_id set default auth.uid();
alter table bank_accounts alter column owner_id set not null, alter column owner_id set default auth.uid();
alter table bank_transactions alter column owner_id set not null, alter column owner_id set default auth.uid();

-- 4. Re-scope the two constraints that assumed there was only one tenant.
alter table businesses drop constraint businesses_name_key;
alter table businesses add constraint businesses_owner_id_name_key unique (owner_id, name);
alter table categories drop constraint categories_name_type_key;
alter table categories add constraint categories_owner_id_name_type_key unique (owner_id, name, type);

-- 5. Rewrite every RLS policy from "any authenticated user" to "rows you own".

drop policy "authenticated read businesses" on businesses;
drop policy "authenticated write businesses" on businesses;
drop policy "authenticated update businesses" on businesses;
drop policy "authenticated delete businesses" on businesses;
create policy "owner read businesses" on businesses for select using (auth.uid() = owner_id);
create policy "owner write businesses" on businesses for insert with check (auth.uid() = owner_id);
create policy "owner update businesses" on businesses for update using (auth.uid() = owner_id);
create policy "owner delete businesses" on businesses for delete using (auth.uid() = owner_id);

drop policy "authenticated read categories" on categories;
drop policy "authenticated write categories" on categories;
drop policy "authenticated update categories" on categories;
drop policy "authenticated delete categories" on categories;
create policy "owner read categories" on categories for select using (auth.uid() = owner_id);
create policy "owner write categories" on categories for insert with check (auth.uid() = owner_id);
create policy "owner update categories" on categories for update using (auth.uid() = owner_id);
create policy "owner delete categories" on categories for delete using (auth.uid() = owner_id);

drop policy "authenticated read contractors" on contractors;
drop policy "authenticated write contractors" on contractors;
drop policy "authenticated update contractors" on contractors;
drop policy "authenticated delete contractors" on contractors;
create policy "owner read contractors" on contractors for select using (auth.uid() = owner_id);
create policy "owner write contractors" on contractors for insert with check (auth.uid() = owner_id);
create policy "owner update contractors" on contractors for update using (auth.uid() = owner_id);
create policy "owner delete contractors" on contractors for delete using (auth.uid() = owner_id);

drop policy "authenticated read customers" on customers;
drop policy "authenticated write customers" on customers;
drop policy "authenticated update customers" on customers;
drop policy "authenticated delete customers" on customers;
create policy "owner read customers" on customers for select using (auth.uid() = owner_id);
create policy "owner write customers" on customers for insert with check (auth.uid() = owner_id);
create policy "owner update customers" on customers for update using (auth.uid() = owner_id);
create policy "owner delete customers" on customers for delete using (auth.uid() = owner_id);

drop policy "authenticated read transactions" on transactions;
drop policy "authenticated write transactions" on transactions;
drop policy "authenticated update transactions" on transactions;
drop policy "authenticated delete transactions" on transactions;
create policy "owner read transactions" on transactions for select using (auth.uid() = owner_id);
create policy "owner write transactions" on transactions for insert with check (auth.uid() = owner_id);
create policy "owner update transactions" on transactions for update using (auth.uid() = owner_id);
create policy "owner delete transactions" on transactions for delete using (auth.uid() = owner_id);

drop policy "authenticated read invoices" on invoices;
drop policy "authenticated write invoices" on invoices;
drop policy "authenticated update invoices" on invoices;
drop policy "authenticated delete invoices" on invoices;
create policy "owner read invoices" on invoices for select using (auth.uid() = owner_id);
create policy "owner write invoices" on invoices for insert with check (auth.uid() = owner_id);
create policy "owner update invoices" on invoices for update using (auth.uid() = owner_id);
create policy "owner delete invoices" on invoices for delete using (auth.uid() = owner_id);

drop policy "authenticated read invoice line items" on invoice_line_items;
drop policy "authenticated write invoice line items" on invoice_line_items;
drop policy "authenticated update invoice line items" on invoice_line_items;
drop policy "authenticated delete invoice line items" on invoice_line_items;
create policy "owner read invoice line items" on invoice_line_items for select using (auth.uid() = owner_id);
create policy "owner write invoice line items" on invoice_line_items for insert with check (auth.uid() = owner_id);
create policy "owner update invoice line items" on invoice_line_items for update using (auth.uid() = owner_id);
create policy "owner delete invoice line items" on invoice_line_items for delete using (auth.uid() = owner_id);

drop policy "authenticated read bank_connections" on bank_connections;
drop policy "authenticated write bank_connections" on bank_connections;
drop policy "authenticated update bank_connections" on bank_connections;
drop policy "authenticated delete bank_connections" on bank_connections;
create policy "owner read bank_connections" on bank_connections for select using (auth.uid() = owner_id);
create policy "owner write bank_connections" on bank_connections for insert with check (auth.uid() = owner_id);
create policy "owner update bank_connections" on bank_connections for update using (auth.uid() = owner_id);
create policy "owner delete bank_connections" on bank_connections for delete using (auth.uid() = owner_id);

drop policy "authenticated read bank_accounts" on bank_accounts;
drop policy "authenticated write bank_accounts" on bank_accounts;
drop policy "authenticated update bank_accounts" on bank_accounts;
drop policy "authenticated delete bank_accounts" on bank_accounts;
create policy "owner read bank_accounts" on bank_accounts for select using (auth.uid() = owner_id);
create policy "owner write bank_accounts" on bank_accounts for insert with check (auth.uid() = owner_id);
create policy "owner update bank_accounts" on bank_accounts for update using (auth.uid() = owner_id);
create policy "owner delete bank_accounts" on bank_accounts for delete using (auth.uid() = owner_id);

drop policy "authenticated read bank_transactions" on bank_transactions;
drop policy "authenticated write bank_transactions" on bank_transactions;
drop policy "authenticated update bank_transactions" on bank_transactions;
drop policy "authenticated delete bank_transactions" on bank_transactions;
create policy "owner read bank_transactions" on bank_transactions for select using (auth.uid() = owner_id);
create policy "owner write bank_transactions" on bank_transactions for insert with check (auth.uid() = owner_id);
create policy "owner update bank_transactions" on bank_transactions for update using (auth.uid() = owner_id);
create policy "owner delete bank_transactions" on bank_transactions for delete using (auth.uid() = owner_id);
