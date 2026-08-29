-- Adds a per-transaction client tag, mirroring the existing `contractor` free-text
-- column (0006/0007) but for income instead of expenses -- drives a new Client
-- Report ("money received from certain clients"). No RLS changes needed: this is
-- just a new nullable column on the existing `transactions` table, which already
-- has owner_id-based RLS from 0009.

alter table transactions add column if not exists client text;
