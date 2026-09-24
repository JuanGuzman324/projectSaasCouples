import { supabase } from '../../lib/supabase'

export interface CoupleWithMembers {
  id: string
  start_date: string | null
  invite_code: string
  locale: string
  plan: 'free' | 'premium'
  members: {
    user_id: string
    display_name: string | null
    city: string | null
    lat: number | null
    lon: number | null
    tz: string | null
    country: string | null
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
    .select('user_id, display_name, city, lat, lon, tz, country')
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

// Borrado de cuenta completo (derecho al olvido, BACKLOG P0 legal): borra
// el contenido de la pareja (si era el último miembro) y la fila de
// auth.users. Necesita la Edge Function delete-account porque eso último
// requiere la API de administración de Supabase, nunca disponible en el
// cliente. No cierra sesión por su cuenta: quien llama debe hacer
// supabase.auth.signOut() después (el token ya quedó inválido de todas
// formas, porque el usuario dejó de existir).
export async function deleteAccount() {
  const { data, error } = await supabase.functions.invoke('delete-account')
  if (error) throw error
  if (data?.error) throw new Error(data.error)
}

export interface CoupleUpdate {
  startDate: string | null
}

export async function updateCouple(coupleId: string, patch: CoupleUpdate) {
  const { error } = await supabase
    .from('couples')
    .update({ start_date: patch.startDate })
    .eq('id', coupleId)
  if (error) throw error
}

// Toggle manual, solo mientras no exista una integración real de pagos
// (Stripe/RevenueCat, BACKLOG P3 "Plan Premium"). Cuando esa integración
// exista, el plan debe pasar a fijarse desde un webhook server-side, nunca
// desde el cliente: cualquier miembro de la pareja puede llamar esto hoy
// porque la política couples_update ya le permite editar su propia fila.
export async function setPlan(coupleId: string, plan: 'free' | 'premium') {
  const { error } = await supabase.from('couples').update({ plan }).eq('id', coupleId)
  if (error) throw error
}

export interface MemberUpdate {
  displayName: string | null
  city: string | null
  lat: number | null
  lon: number | null
  tz: string | null
  country: string | null
}

// Cada miembro solo puede editar su propia fila (lo exige la política RLS
// de couple_members); por eso siempre hace falta el userId además del
// coupleId, aunque el .eq('couple_id', ...) ya lo acote a la pareja.
export async function updateMyMember(coupleId: string, userId: string, patch: MemberUpdate) {
  const { error } = await supabase
    .from('couple_members')
    .update({
      display_name: patch.displayName,
      city: patch.city,
      lat: patch.lat,
      lon: patch.lon,
      tz: patch.tz,
      country: patch.country,
    })
    .eq('couple_id', coupleId)
    .eq('user_id', userId)
  if (error) throw error
}
