-- Business profile fields (logo + contact info), used as invoice letterhead
alter table businesses add column if not exists logo_path text;
alter table businesses add column if not exists contact_name text;
alter table businesses add column if not exists email text;
alter table businesses add column if not exists phone text;
alter table businesses add column if not exists website text;
alter table businesses add column if not exists address text;
alter table businesses add column if not exists payment_instructions text;

-- Logos bucket: PUBLIC (unlike receipts) since a logo is meant to be visible on invoices,
-- not sensitive, and a stable public URL is simplest to embed in a PDF.
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

create policy "authenticated read logos" on storage.objects
  for select using (bucket_id = 'logos');
create policy "authenticated upload logos" on storage.objects
  for insert with check (bucket_id = 'logos' and auth.uid() is not null);
create policy "authenticated update logos" on storage.objects
  for update using (bucket_id = 'logos' and auth.uid() is not null);
create policy "authenticated delete logos" on storage.objects
  for delete using (bucket_id = 'logos' and auth.uid() is not null);

-- Invoices
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete restrict,
  invoice_number text not null,
  status text not null default 'unpaid' check (status in ('unpaid', 'paid')),
  client_name text not null,
  client_email text,
  client_address text,
  issue_date date not null,
  due_date date,
  notes text,
  created_at timestamptz not null default now(),
  unique (business_id, invoice_number)
);

create table if not exists invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity numeric(12, 2) not null default 1,
  rate numeric(12, 2) not null default 0,
  amount numeric(12, 2) generated always as (quantity * rate) stored,
  sort_order integer not null default 0
);

create index if not exists invoices_business_id_idx on invoices(business_id);
create index if not exists invoice_line_items_invoice_id_idx on invoice_line_items(invoice_id);

alter table invoices enable row level security;
alter table invoice_line_items enable row level security;

create policy "authenticated read invoices" on invoices
  for select using (auth.uid() is not null);
create policy "authenticated write invoices" on invoices
  for insert with check (auth.uid() is not null);
create policy "authenticated update invoices" on invoices
  for update using (auth.uid() is not null);
create policy "authenticated delete invoices" on invoices
  for delete using (auth.uid() is not null);

create policy "authenticated read invoice line items" on invoice_line_items
  for select using (auth.uid() is not null);
create policy "authenticated write invoice line items" on invoice_line_items
  for insert with check (auth.uid() is not null);
create policy "authenticated update invoice line items" on invoice_line_items
  for update using (auth.uid() is not null);
create policy "authenticated delete invoice line items" on invoice_line_items
  for delete using (auth.uid() is not null);
