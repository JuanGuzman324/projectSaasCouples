import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMoment,
  fetchMoments,
  softDeleteMoment,
  togglePlanItem,
  updateMoment,
  type MomentDesign,
  type MomentInput,
} from './api'
import type { PlanItem } from './constants'

export const MOMENTS_QUERY_KEY = ['moments'] as const

export function useMoments() {
  return useQuery({ queryKey: MOMENTS_QUERY_KEY, queryFn: fetchMoments })
}

export function useCreateMoment() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['moments', 'create'],
    mutationFn: (input: MomentInput) => createMoment(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: MOMENTS_QUERY_KEY }),
  })
}

export function useUpdateMoment() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['moments', 'update'],
    mutationFn: ({ id, design }: { id: string; design: MomentDesign }) => updateMoment(id, design),
    onSuccess: () => qc.invalidateQueries({ queryKey: MOMENTS_QUERY_KEY }),
  })
}

export function useTogglePlanItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['moments', 'togglePlanItem'],
    mutationFn: ({ id, plan }: { id: string; plan: PlanItem[] }) => togglePlanItem(id, plan),
    onSuccess: () => qc.invalidateQueries({ queryKey: MOMENTS_QUERY_KEY }),
  })
}

export function useDeleteMoment() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['moments', 'delete'],
    mutationFn: (id: string) => softDeleteMoment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: MOMENTS_QUERY_KEY }),
  })
}
