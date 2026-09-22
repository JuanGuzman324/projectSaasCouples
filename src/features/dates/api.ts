import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database'

export type CoupleDate = Database['public']['Tables']['couple_dates']['Row']
export type DateKind = CoupleDate['kind']
export type DateRepeat = CoupleDate['repeat']

export interface DateInput {
  coupleId: string
  title: string
  happensOn: string
  kind: DateKind
  repeat: DateRepeat
  place: string | null
  note: string | null
}

export async function fetchDates(): Promise<CoupleDate[]> {
  const { data, error } = await supabase
    .from('couple_dates')
    .select('*')
    .is('deleted_at', null)
    .order('happens_on', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createDate(input: DateInput) {
  const { data, error } = await supabase
    .from('couple_dates')
    .insert({
      couple_id: input.coupleId,
      title: input.title,
      happens_on: input.happensOn,
      kind: input.kind,
      repeat: input.repeat,
      place: input.place,
      note: input.note,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function softDeleteDate(id: string) {
  const { error } = await supabase
    .from('couple_dates')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
