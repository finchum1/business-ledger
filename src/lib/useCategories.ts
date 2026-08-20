import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Category } from './types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('type', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })
      if (error) throw error
      setCategories(data as Category[])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { categories, loading, error, refetch }
}
