import { supabase } from './supabase'

export interface BankSyncResult {
  ok: true
  connection_id?: string
  accountsSynced: number
  transactionsNew: number
}

async function invoke(body: Record<string, unknown>): Promise<BankSyncResult> {
  const { data, error } = await supabase.functions.invoke('bank-sync', { body })
  if (error) {
    // supabase-js surfaces a generic "Edge Function returned a non-2xx
    // status code" for any failure -- the function's own JSON error message
    // is on the FunctionsHttpError's `context` response body, so dig it out
    // when available rather than showing the generic message.
    const context = (error as { context?: Response }).context
    if (context) {
      try {
        const body = await context.clone().json()
        if (body?.error) throw new Error(body.error)
      } catch {
        // fall through to the generic error below
      }
    }
    throw new Error(error.message)
  }
  if (!data?.ok) throw new Error(data?.error ?? 'Bank sync failed.')
  return data as BankSyncResult
}

/** Claims a one-time SimpleFIN setup token, stores the resulting connection
 * under `businessId`, and runs an immediate first sync. */
export function connectBank(businessId: string, setupToken: string) {
  return invoke({ action: 'connect', business_id: businessId, setup_token: setupToken })
}

/** Re-syncs an existing connection -- pulls fresh balances and any new
 * settled transactions since the last sync (with a few days of overlap). */
export function syncBankConnection(connectionId: string) {
  return invoke({ action: 'sync', connection_id: connectionId })
}
