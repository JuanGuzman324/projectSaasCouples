import { useQuery } from '@tanstack/react-query'
import { getSignedPhotoUrl } from './api'

// staleTime bastante por debajo de la duración real de la URL firmada
// (1 hora, ver api.ts) para que React Query pida una nueva a tiempo y la
// imagen no se rompa a media sesión si la pantalla queda abierta mucho rato.
const STALE_TIME_MS = 45 * 60 * 1000

export function usePhotoUrl(path: string | null | undefined) {
  return useQuery({
    queryKey: ['photo-url', path],
    queryFn: () => getSignedPhotoUrl(path as string),
    enabled: !!path,
    staleTime: STALE_TIME_MS,
  })
}
