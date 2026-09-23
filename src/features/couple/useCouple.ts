import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCouple,
  fetchMyCouple,
  joinCouple,
  setPlan,
  updateCouple,
  updateMyMember,
  type CoupleUpdate,
  type MemberUpdate,
} from './api'

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

export function useUpdateCouple() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ coupleId, patch }: { coupleId: string; patch: CoupleUpdate }) =>
      updateCouple(coupleId, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: COUPLE_QUERY_KEY }),
  })
}

export function useSetPlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ coupleId, plan }: { coupleId: string; plan: 'free' | 'premium' }) => setPlan(coupleId, plan),
    onSuccess: () => qc.invalidateQueries({ queryKey: COUPLE_QUERY_KEY }),
  })
}

export function useUpdateMyMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      coupleId,
      userId,
      patch,
    }: {
      coupleId: string
      userId: string
      patch: MemberUpdate
    }) => updateMyMember(coupleId, userId, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: COUPLE_QUERY_KEY }),
  })
}
