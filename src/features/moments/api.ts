import { supabase } from '../../lib/supabase'
import type { Database, Json } from '../../types/database'
import type { Motif, MomentFont, PlanItem } from './constants'

export type Moment = Database['public']['Tables']['moments']['Row']
export type MomentRepeat = Moment['repeat']

export interface MomentPalette {
  bg1: string
  bg2: string
  ink: string
  accent: string
}

export const DEFAULT_PALETTE: MomentPalette = {
  bg1: '#2A2052',
  bg2: '#5B3FA8',
  ink: '#F7F2FF',
  accent: '#F6B800',
}

// Forma completa de datos que edita el estudio visual: coincide 1:1 con las
// columnas de diseño de la tabla moments (palette y plan son jsonb ahí).
export interface MomentDesign {
  name: string
  happensOn: string | null
  repeat: MomentRepeat
  tagline: string | null
  message: string | null
  motif: Motif
  emoji: string
  font: MomentFont
  density: number
  speed: number
  palette: MomentPalette
  plan: PlanItem[]
  photoPath: string | null
}

export interface MomentInput extends MomentDesign {
  coupleId: string
}

function readPalette(m: Moment): MomentPalette {
  const p = m.palette as unknown
  if (p && typeof p === 'object' && 'bg1' in (p as Record<string, unknown>)) {
    return p as MomentPalette
  }
  return DEFAULT_PALETTE
}

function readPlan(m: Moment): PlanItem[] {
  const p = m.plan as unknown
  return Array.isArray(p) ? (p as PlanItem[]) : []
}

/** Lee una fila de moments con palette/plan ya tipados, listos para el estudio. */
export function momentToDesign(m: Moment): MomentDesign {
  return {
    name: m.name,
    happensOn: m.happens_on,
    repeat: m.repeat,
    tagline: m.tagline,
    message: m.message,
    motif: (m.motif as Motif) ?? 'destellos',
    emoji: m.emoji,
    font: (m.font as MomentFont) ?? 'serif',
    density: m.density,
    speed: Number(m.speed),
    palette: readPalette(m),
    plan: readPlan(m),
    photoPath: m.photo_path,
  }
}

export async function fetchMoments(): Promise<Moment[]> {
  const { data, error } = await supabase
    .from('moments')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

function toRow(input: MomentDesign) {
  return {
    name: input.name,
    happens_on: input.happensOn,
    repeat: input.repeat,
    tagline: input.tagline,
    message: input.message,
    motif: input.motif,
    emoji: input.emoji,
    font: input.font,
    density: input.density,
    speed: input.speed,
    palette: input.palette as unknown as Json,
    plan: input.plan as unknown as Json,
    photo_path: input.photoPath,
  }
}

export async function createMoment(input: MomentInput) {
  const { data, error } = await supabase
    .from('moments')
    .insert({ couple_id: input.coupleId, ...toRow(input) })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateMoment(id: string, input: MomentDesign) {
  const { data, error } = await supabase.from('moments').update(toRow(input)).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function togglePlanItem(id: string, plan: PlanItem[]) {
  const { error } = await supabase.from('moments').update({ plan: plan as unknown as Json }).eq('id', id)
  if (error) throw error
}

export async function softDeleteMoment(id: string) {
  const { error } = await supabase
    .from('moments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
