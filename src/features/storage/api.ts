import { supabase } from '../../lib/supabase'

const BUCKET = 'photos'
// El bucket es privado (ver supabase/migrations/0005_storage.sql), así que
// nunca hay una URL pública fija: cada vez que se necesita mostrar la foto
// se pide una URL firmada, de corta duración.
const SIGNED_URL_TTL_SECONDS = 60 * 60 // 1 hora

// La política de storage exige que el primer segmento de la ruta sea el
// couple_id (storage_couple_id() en el SQL hace split_part(name,'/',1)).
// Si esto no coincide, Supabase rechaza la subida con un error de RLS.
export function buildPhotoPath(coupleId: string, extension: 'webp' | 'jpg' = 'webp'): string {
  return `${coupleId}/${crypto.randomUUID()}.${extension}`
}

export async function uploadPhoto(path: string, blob: Blob): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type || 'image/webp',
    upsert: false,
  })
  if (error) throw error
}

export async function deletePhoto(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}

export async function getSignedPhotoUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS)
  if (error) throw error
  return data.signedUrl
}
