import { get, set, del } from 'idb-keyval'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import type { QueryClient } from '@tanstack/react-query'
import { createMemory, toggleFavorite, softDeleteMemory } from '../features/memories/api'
import { createDate, softDeleteDate } from '../features/dates/api'
import { createMoment, updateMoment, togglePlanItem, softDeleteMoment } from '../features/moments/api'

export const idbPersister = createAsyncStoragePersister({
  storage: {
    getItem: (key: string) => get(key),
    setItem: (key: string, value: string) => set(key, value),
    removeItem: (key: string) => del(key),
  },
  key: 'nh-query-cache',
})

/** Registra los mutationFn de cada feature para que las mutaciones pausadas
 * offline (guardadas en IndexedDB) se puedan reanudar tras recargar la página. */
export function registerOfflineMutations(queryClient: QueryClient) {
  queryClient.setMutationDefaults(['memories', 'create'], { mutationFn: createMemory })
  queryClient.setMutationDefaults(['memories', 'toggleFavorite'], {
    mutationFn: (vars: { id: string; isFavorite: boolean }) => toggleFavorite(vars.id, vars.isFavorite),
  })
  queryClient.setMutationDefaults(['memories', 'delete'], { mutationFn: (id: string) => softDeleteMemory(id) })

  queryClient.setMutationDefaults(['dates', 'create'], { mutationFn: createDate })
  queryClient.setMutationDefaults(['dates', 'delete'], { mutationFn: (id: string) => softDeleteDate(id) })

  queryClient.setMutationDefaults(['moments', 'create'], { mutationFn: createMoment })
  queryClient.setMutationDefaults(['moments', 'update'], {
    mutationFn: (vars: { id: string; design: Parameters<typeof updateMoment>[1] }) =>
      updateMoment(vars.id, vars.design),
  })
  queryClient.setMutationDefaults(['moments', 'togglePlanItem'], {
    mutationFn: (vars: { id: string; plan: Parameters<typeof togglePlanItem>[1] }) =>
      togglePlanItem(vars.id, vars.plan),
  })
  queryClient.setMutationDefaults(['moments', 'delete'], { mutationFn: (id: string) => softDeleteMoment(id) })
}
