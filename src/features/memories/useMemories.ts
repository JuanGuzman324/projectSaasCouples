import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMemory,
  fetchMemories,
  softDeleteMemory,
  toggleFavorite,
  type MemoryInput,
} from './api'

export const MEMORIES_QUERY_KEY = ['memories'] as const

export function useMemories() {
  return useQuery({ queryKey: MEMORIES_QUERY_KEY, queryFn: fetchMemories })
}

export function useCreateMemory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: MemoryInput) => createMemory(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: MEMORIES_QUERY_KEY }),
  })
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      toggleFavorite(id, isFavorite),
    onSuccess: () => qc.invalidateQueries({ queryKey: MEMORIES_QUERY_KEY }),
  })
}

export function useDeleteMemory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => softDeleteMemory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: MEMORIES_QUERY_KEY }),
  })
}
