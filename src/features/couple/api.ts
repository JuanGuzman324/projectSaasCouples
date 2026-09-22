import { supabase } from '../../lib/supabase'

export interface CoupleWithMembers {
  id: string
  start_date: string | null
  invite_code: string
  locale: string
  members: {
    user_id: string
    display_name: string | null
    city: string | null
    lat: number | null
    lon: number | null
  }[]
}

// "Mi pareja" = la fila de couples a la que el usuario actual pertenece.
// RLS ya garantiza que solo puede haber, como mucho, una visible para él.
export async function fetchMyCouple(): Promise<CoupleWithMembers | null> {
  const { data: couples, error } = await supabase.from('couples').select('*').limit(1)
  if (error) throw error
  const couple = couples?.[0]
  if (!couple) return null

  const { data: members, error: mErr } = await supabase
    .from('couple_members')
    .select('user_id, display_name, city, lat, lon')
    .eq('couple_id', couple.id)
  if (mErr) throw mErr

  return { ...couple, members: members ?? [] }
}

export async function createCouple(startDate: string | null, locale: string) {
  const { data, error } = await supabase.rpc('create_couple', {
    p_start_date: startDate,
    p_locale: locale,
  })
  if (error) throw error
  return data
}

export async function joinCouple(inviteCode: string) {
  const { data, error } = await supabase.rpc('join_couple', {
    p_invite_code: inviteCode.trim().toUpperCase(),
  })
  if (error) throw error
  return data
}

export async function leaveCouple(coupleId: string) {
  const { error } = await supabase.rpc('leave_couple', { p_couple_id: coupleId })
  if (error) throw error
}
