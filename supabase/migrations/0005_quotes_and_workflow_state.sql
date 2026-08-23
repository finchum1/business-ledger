-- Unifies quotes and invoices into the same 'invoices' table (doc_type
-- distinguishes them) rather than a separate table -- they share every
-- other column (client info, line items, numbering, PDF shape).

alter table invoices add column if not exists doc_type text not null default 'invoice' check (doc_type in ('quote', 'invoice'));
alter table invoices add column if not exists sent_at timestamptz;
alter table invoices add column if not exists approved_at timestamptz;
alter table invoices add column if not exists converted_to_invoice_id uuid references invoices(id) on delete set null;
create index if not exists invoices_doc_type_idx on invoices(business_id, doc_type);
