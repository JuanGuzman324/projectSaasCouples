import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDate, fetchDates, softDeleteDate, type DateInput } from './api'

export const DATES_QUERY_KEY = ['dates'] as const

export function useDates() {
  return useQuery({ queryKey: DATES_QUERY_KEY, queryFn: fetchDates })
}

export function useCreateDate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: DateInput) => createDate(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: DATES_QUERY_KEY }),
  })
}

export function useDeleteDate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => softDeleteDate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: DATES_QUERY_KEY }),
  })
}
