import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Client } from './types'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })
      if (error) throw error
      setClients(data as Client[])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clients.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { clients, loading, error, refetch }
}
