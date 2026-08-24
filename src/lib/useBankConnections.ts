import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { BankConnection } from './types'

// Explicit column list -- deliberately excludes access_url so the SimpleFIN
// credential is never fetched into client state at all, even though RLS
// would technically allow it. Only the bank-sync Edge Function (service
// role) ever reads that column.
const COLUMNS = 'id, business_id, status, last_error, last_synced_at, created_at'

export function useBankConnections() {
  const [connections, setConnections] = useState<BankConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bank_connections')
        .select(COLUMNS)
        .order('created_at', { ascending: true })
      if (error) throw error
      setConnections(data as BankConnection[])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bank connections.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { connections, loading, error, refetch }
}
