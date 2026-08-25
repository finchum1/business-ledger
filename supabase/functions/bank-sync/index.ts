// Talks to SimpleFIN (simplefin.org) on behalf of the app. Runs server-side
// specifically so the SimpleFIN access URL -- a bearer credential (HTTP
// Basic Auth embedded in the URL itself) -- never has to be read back into
// the browser after the initial connect. `verify_jwt` is enabled on this
// function's deployment, so the platform rejects any request without a
// valid Supabase session before this code runs at all.
//
// This function uses the SERVICE ROLE key, which bypasses row-level
// security entirely -- so unlike every client-side call in this app, RLS
// does not scope anything here automatically. Every write below sets
// owner_id explicitly (copied from the verified caller, or checked against
// the row being acted on) so one tenant's data can never end up attributed
// to -- or triggered by -- another tenant, the same guarantee RLS gives the
// client-side code for free.
//
// Two actions, one function so there's only one thing to redeploy:
//   { action: 'connect', business_id, setup_token } -- claims a one-time
//     SimpleFIN setup token, stores the resulting access URL under a
//     business the caller actually owns, runs an immediate first sync.
//   { action: 'sync', connection_id } -- re-syncs a connection the caller
//     owns.
//
// Synced transactions land in bank_transactions with status
// 'pending_review' -- nothing here ever writes to the real `transactions`
// table. That happens client-side when the operator reviews and imports one.

import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** Splits a SimpleFIN access URL into a credential-free base URL plus an
 * explicit `Authorization: Basic ...` header value -- SimpleFIN's own
 * developer guide recommends this over relying on fetch() to send a URL's
 * embedded userinfo automatically, which not every runtime does. */
function splitAccessUrl(accessUrl: string) {
  const u = new URL(accessUrl)
  const username = decodeURIComponent(u.username)
  const password = decodeURIComponent(u.password)
  u.username = ''
  u.password = ''
  const baseUrl = u.toString().replace(/\/$/, '')
  const authHeader = 'Basic ' + btoa(`${username}:${password}`)
  return { baseUrl, authHeader }
}

async function runSync(
  admin: ReturnType<typeof createClient>,
  connectionId: string,
  accessUrl: string,
  businessId: string,
  ownerId: string,
  lastSyncedAt: string | null,
) {
  const { baseUrl, authHeader } = splitAccessUrl(accessUrl)

  // Overlap ~5 days into the past from the last sync so nothing gets missed
  // at the boundary (SimpleFIN's own guidance); first sync pulls 90 days,
  // the maximum window the protocol allows in one request.
  const nowSec = Math.floor(Date.now() / 1000)
  const startDate = lastSyncedAt
    ? Math.floor(new Date(lastSyncedAt).getTime() / 1000) - 5 * 24 * 3600
    : nowSec - 90 * 24 * 3600

  const url = `${baseUrl}/accounts?version=2&start-date=${startDate}`
  const res = await fetch(url, { headers: { Authorization: authHeader } })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const message = `SimpleFIN returned HTTP ${res.status}${text ? `: ${text.slice(0, 300)}` : ''}`
    await admin
      .from('bank_connections')
      .update({ status: 'error', last_error: message })
      .eq('id', connectionId)
    throw new Error(message)
  }

  const data = await res.json()
  const accounts: unknown[] = Array.isArray(data.accounts) ? data.accounts : []

  let accountsSynced = 0
  let transactionsNew = 0

  for (const raw of accounts) {
    // deno-lint-ignore no-explicit-any
    const acct = raw as any
    accountsSynced++

    const accountRow = {
      connection_id: connectionId,
      business_id: businessId,
      owner_id: ownerId,
      external_account_id: String(acct.id),
      name: String(acct.name ?? 'Account'),
      org_name: acct?.org?.name ?? null,
      currency: acct.currency ?? null,
      current_balance: acct.balance != null ? Number(acct.balance) : null,
      available_balance: acct['available-balance'] != null ? Number(acct['available-balance']) : null,
      balance_date: acct['balance-date'] ? new Date(acct['balance-date'] * 1000).toISOString() : null,
    }

    const { data: existing } = await admin
      .from('bank_accounts')
      .select('id')
      .eq('connection_id', connectionId)
      .eq('external_account_id', accountRow.external_account_id)
      .maybeSingle()

    let bankAccountId: string
    if (existing) {
      bankAccountId = existing.id as string
      await admin.from('bank_accounts').update(accountRow).eq('id', bankAccountId)
    } else {
      const { data: inserted, error: insErr } = await admin
        .from('bank_accounts')
        .insert(accountRow)
        .select('id')
        .single()
      if (insErr || !inserted) continue
      bankAccountId = inserted.id as string
    }

    const txns: unknown[] = Array.isArray(acct.transactions) ? acct.transactions : []
    for (const rawTx of txns) {
      // deno-lint-ignore no-explicit-any
      const t = rawTx as any
      if (t.pending) continue // only settled transactions enter the review queue

      const row = {
        bank_account_id: bankAccountId,
        business_id: businessId,
        owner_id: ownerId,
        external_transaction_id: String(t.id),
        posted_date: t.posted ? new Date(t.posted * 1000).toISOString().slice(0, 10) : null,
        amount: Number(t.amount),
        description: t.description ?? null,
        pending: false,
      }

      const { data: upserted } = await admin
        .from('bank_transactions')
        .upsert(row, { onConflict: 'bank_account_id,external_transaction_id', ignoreDuplicates: true })
        .select('id')
      if (upserted && upserted.length > 0) transactionsNew++
    }
  }

  await admin
    .from('bank_connections')
    .update({ status: 'active', last_error: null, last_synced_at: new Date().toISOString() })
    .eq('id', connectionId)

  return { accountsSynced, transactionsNew }
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') return json({ error: 'Invalid request body' }, 400)

  // Resolve the real, verified caller from their own JWT (not the service
  // role) -- verify_jwt already proved the token is valid, but we still
  // need the actual user id to scope every write below.
  const authHeader = req.headers.get('Authorization') ?? ''
  const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: callerData, error: callerErr } = await callerClient.auth.getUser()
  if (callerErr || !callerData?.user) return json({ error: 'Not authenticated' }, 401)
  const ownerId = callerData.user.id

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  try {
    if (body.action === 'connect') {
      const { business_id, setup_token } = body
      if (!business_id || !setup_token) {
        return json({ error: 'business_id and setup_token are required' }, 400)
      }

      // The admin client bypasses RLS, so ownership has to be checked by
      // hand here -- confirm this business actually belongs to the caller
      // before creating anything under it.
      const { data: business } = await admin
        .from('businesses')
        .select('id')
        .eq('id', business_id)
        .eq('owner_id', ownerId)
        .maybeSingle()
      if (!business) return json({ error: 'Business not found.' }, 404)

      let claimUrl: string
      try {
        claimUrl = atob(String(setup_token).trim())
        if (!claimUrl.startsWith('http')) throw new Error('not a url')
      } catch {
        return json({ error: "That doesn't look like a valid SimpleFIN setup token." }, 400)
      }

      const claimRes = await fetch(claimUrl, { method: 'POST' })
      if (!claimRes.ok) {
        return json(
          {
            error: `SimpleFIN rejected the setup token (HTTP ${claimRes.status}). Setup tokens are single-use -- generate a fresh one at bridge.simplefin.org and try again.`,
          },
          400,
        )
      }
      const accessUrl = (await claimRes.text()).trim()

      const { data: connection, error: insErr } = await admin
        .from('bank_connections')
        .insert({ business_id, owner_id: ownerId, access_url: accessUrl })
        .select('id')
        .single()
      if (insErr || !connection) {
        return json({ error: insErr?.message ?? 'Failed to save the connection.' }, 500)
      }

      const result = await runSync(admin, connection.id as string, accessUrl, business_id, ownerId, null)
      return json({ ok: true, connection_id: connection.id, ...result })
    }

    if (body.action === 'sync') {
      const { connection_id } = body
      if (!connection_id) return json({ error: 'connection_id is required' }, 400)

      const { data: connection, error: connErr } = await admin
        .from('bank_connections')
        .select('*')
        .eq('id', connection_id)
        .eq('owner_id', ownerId)
        .maybeSingle()
      if (connErr || !connection) return json({ error: 'Connection not found' }, 404)

      const result = await runSync(
        admin,
        connection.id as string,
        connection.access_url as string,
        connection.business_id as string,
        ownerId,
        connection.last_synced_at as string | null,
      )
      return json({ ok: true, ...result })
    }

    return json({ error: `Unknown action "${body.action}"` }, 400)
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500)
  }
})
