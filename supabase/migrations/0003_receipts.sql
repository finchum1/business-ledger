-- Lets an expense carry an attached receipt (photo or PDF). The bucket is
-- PRIVATE (not public) since receipts are financial documents -- viewing one
-- requires a short-lived signed URL, generated client-side on demand.

alter table transactions add column if not exists receipt_path text;

insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

create policy "authenticated read receipts" on storage.objects
  for select using (bucket_id = 'receipts' and auth.uid() is not null);
create policy "authenticated upload receipts" on storage.objects
  for insert with check (bucket_id = 'receipts' and auth.uid() is not null);
create policy "authenticated update receipts" on storage.objects
  for update using (bucket_id = 'receipts' and auth.uid() is not null);
create policy "authenticated delete receipts" on storage.objects
  for delete using (bucket_id = 'receipts' and auth.uid() is not null);
