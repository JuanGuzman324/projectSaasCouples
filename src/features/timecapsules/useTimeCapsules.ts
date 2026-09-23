import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTimeCapsule, fetchTimeCapsules, softDeleteTimeCapsule, type TimeCapsuleInput } from './api'

export const TIME_CAPSULES_QUERY_KEY = ['timeCapsules'] as const

export function useTimeCapsules() {
  return useQuery({ queryKey: TIME_CAPSULES_QUERY_KEY, queryFn: fetchTimeCapsules })
}

export function useCreateTimeCapsule() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['timeCapsules', 'create'],
    mutationFn: (input: TimeCapsuleInput) => createTimeCapsule(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: TIME_CAPSULES_QUERY_KEY }),
  })
}

export function useDeleteTimeCapsule() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['timeCapsules', 'delete'],
    mutationFn: (id: string) => softDeleteTimeCapsule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TIME_CAPSULES_QUERY_KEY }),
  })
}
