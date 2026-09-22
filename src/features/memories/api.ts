import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database'

export type Memory = Database['public']['Tables']['memories']['Row']
export type MemoryTag = Memory['tag']

export interface MemoryInput {
  coupleId: string
  title: string
  happenedOn: string
  tag: MemoryTag
  place: string | null
  body: string | null
  photoPath: string | null
}

// Solo recuerdos no borrados, más recientes primero. El borrado es lógico
// (deleted_at) para que la futura sincronización offline pueda propagarlo
// igual que una edición, en vez de perder la fila.
export async function fetchMemories(): Promise<Memory[]> {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .is('deleted_at', null)
    .order('happened_on', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createMemory(input: MemoryInput) {
  const { data, error } = await supabase
    .from('memories')
    .insert({
      couple_id: input.coupleId,
      title: input.title,
      happened_on: input.happenedOn,
      tag: input.tag,
      place: input.place,
      body: input.body,
      photo_path: input.photoPath,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  const { error } = await supabase.from('memories').update({ is_favorite: isFavorite }).eq('id', id)
  if (error) throw error
}

export async function softDeleteMemory(id: string) {
  const { error } = await supabase
    .from('memories')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
