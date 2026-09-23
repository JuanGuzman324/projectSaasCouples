import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteTemplate, fetchTemplates, publishTemplate, type PublishTemplateInput } from './api'

export const MOMENT_TEMPLATES_QUERY_KEY = ['momentTemplates'] as const

export function useMomentTemplates() {
  return useQuery({ queryKey: MOMENT_TEMPLATES_QUERY_KEY, queryFn: fetchTemplates })
}

export function usePublishTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['momentTemplates', 'publish'],
    mutationFn: (input: PublishTemplateInput) => publishTemplate(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: MOMENT_TEMPLATES_QUERY_KEY }),
  })
}

export function useDeleteTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['momentTemplates', 'delete'],
    mutationFn: (id: string) => deleteTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: MOMENT_TEMPLATES_QUERY_KEY }),
  })
}
