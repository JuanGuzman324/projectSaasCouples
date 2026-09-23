import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database'

export type TimeCapsule = Database['public']['Tables']['time_capsules']['Row']

export interface TimeCapsuleInput {
  coupleId: string
  createdBy: string
  title: string
  body: string
  openOn: string
}

// RLS deja ver la fila completa a cualquier integrante de la pareja (mismo
// aislamiento por pareja que el resto de las tablas): el cuerpo se oculta
// en la UI, no en la base, para quien no sea el autor y todavía no llegó
// open_on. Es consistente con el resto de la app, donde los dos miembros
// siempre tienen acceso total entre sí.
export async function fetchTimeCapsules(): Promise<TimeCapsule[]> {
  const { data, error } = await supabase
    .from('time_capsules')
    .select('*')
    .is('deleted_at', null)
    .order('open_on', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createTimeCapsule(input: TimeCapsuleInput) {
  const { data, error } = await supabase
    .from('time_capsules')
    .insert({
      couple_id: input.coupleId,
      created_by: input.createdBy,
      title: input.title,
      body: input.body,
      open_on: input.openOn,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function softDeleteTimeCapsule(id: string) {
  const { error } = await supabase
    .from('time_capsules')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
