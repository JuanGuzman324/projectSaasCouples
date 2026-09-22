import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createCouple, fetchMyCouple, joinCouple } from './api'

export const COUPLE_QUERY_KEY = ['couple'] as const

export function useMyCouple() {
  return useQuery({ queryKey: COUPLE_QUERY_KEY, queryFn: fetchMyCouple })
}

export function useCreateCouple() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ startDate, locale }: { startDate: string | null; locale: string }) =>
      createCouple(startDate, locale),
    onSuccess: () => qc.invalidateQueries({ queryKey: COUPLE_QUERY_KEY }),
  })
}

export function useJoinCouple() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (inviteCode: string) => joinCouple(inviteCode),
    onSuccess: () => qc.invalidateQueries({ queryKey: COUPLE_QUERY_KEY }),
  })
}
