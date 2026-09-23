import { supabase } from '../../lib/supabase'
import type { Database, Json } from '../../types/database'
import type { MomentPalette } from '../moments/api'
import type { Motif, MomentFont } from '../moments/constants'

export type MomentTemplate = Database['public']['Tables']['moment_templates']['Row']

export interface TemplateDesign {
  motif: Motif
  emoji: string
  font: MomentFont
  density: number
  speed: number
  palette: MomentPalette
}

export interface PublishTemplateInput extends TemplateDesign {
  coupleId: string
  title: string
  tagline: string | null
  message: string | null
}

function readPalette(t: MomentTemplate): MomentPalette {
  return t.palette as unknown as MomentPalette
}

export function templateToDesign(t: MomentTemplate): TemplateDesign {
  return {
    motif: (t.motif as Motif) ?? 'destellos',
    emoji: t.emoji,
    font: (t.font as MomentFont) ?? 'serif',
    density: t.density,
    speed: Number(t.speed),
    palette: readPalette(t),
  }
}

// A diferencia del resto de las tablas, esto trae plantillas de TODAS las
// parejas (RLS deja el SELECT abierto a cualquier autenticado): es una
// biblioteca compartida, no datos privados de una pareja.
export async function fetchTemplates(): Promise<MomentTemplate[]> {
  const { data, error } = await supabase
    .from('moment_templates')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function publishTemplate(input: PublishTemplateInput) {
  const { data, error } = await supabase
    .from('moment_templates')
    .insert({
      couple_id: input.coupleId,
      title: input.title,
      tagline: input.tagline,
      message: input.message,
      motif: input.motif,
      emoji: input.emoji,
      font: input.font,
      density: input.density,
      speed: input.speed,
      palette: input.palette as unknown as Json,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// Mismo borrado lógico (deleted_at) que memories/dates/time_capsules, por
// consistencia con el resto del esquema.
export async function deleteTemplate(id: string) {
  const { error } = await supabase
    .from('moment_templates')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
