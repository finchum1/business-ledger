import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Contractor } from './types'

export function useContractors() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('contractors')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })
      if (error) throw error
      setContractors(data as Contractor[])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contractors.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { contractors, loading, error, refetch }
}
