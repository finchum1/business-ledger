import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Customer } from './types'

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
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
      setCustomers(data as Customer[])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { customers, loading, error, refetch }
}
