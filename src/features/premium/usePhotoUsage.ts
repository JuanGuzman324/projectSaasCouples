import { useMemories } from '../memories/useMemories'
import { useMoments } from '../moments/useMoments'

/** Total de fotos entre recuerdos y momentos (lo que cuenta para el límite
 * del plan gratuito). Ambas queries ya están en caché en cuanto se visitó
 * Recuerdos o Momentos una vez, así que esto casi nunca dispara un fetch
 * nuevo. */
export function usePhotoUsage(): number {
  const { data: memories } = useMemories()
  const { data: moments } = useMoments()
  const memoryPhotos = (memories ?? []).filter((m) => m.photo_path).length
  const momentPhotos = (moments ?? []).filter((m) => m.photo_path).length
  return memoryPhotos + momentPhotos
}
