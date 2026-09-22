import type { MomentPalette } from './api'

export const MOTIFS = ['flores', 'petalos', 'mariposas', 'corazones', 'estrellas', 'destellos', 'emoji'] as const
export type Motif = (typeof MOTIFS)[number]

export const MOTIF_EMOJI: Record<Motif, string> = {
  flores: '🌼',
  petalos: '🌸',
  mariposas: '🦋',
  corazones: '💗',
  estrellas: '⭐',
  destellos: '✨',
  emoji: '💛',
}

export const FONTS = ['serif', 'hand', 'sans'] as const
export type MomentFont = (typeof FONTS)[number]

export const FONT_STACK: Record<MomentFont, string> = {
  serif: 'var(--font-display)',
  hand: '"Segoe Script", "Bradley Hand", cursive',
  sans: 'var(--font-body)',
}

export interface PlanItem {
  t: string
  done: boolean
}

export interface MomentTemplateValues {
  name: string
  tagline: string
  message: string
  motif: Motif
  emoji: string
  font: MomentFont
  density: number
  speed: number
  repeat: 'none' | 'yearly'
  palette: MomentPalette
  plan: PlanItem[]
}

// Mismos valores que en el prototipo HTML original (TEMPLATES en script1.js),
// para que el "Día de las flores amarillas" y el resto se vean idénticos.
export const TEMPLATES: Record<string, MomentTemplateValues> = {
  flores: {
    name: 'Día de las flores amarillas',
    tagline: 'Para ti, todas las flores amarillas',
    message: 'Hoy el mundo se llena de amarillo, y yo solo quería llenarlo de ti.',
    motif: 'flores',
    emoji: '🌼',
    font: 'hand',
    density: 40,
    speed: 2,
    repeat: 'yearly',
    palette: { bg1: '#12301F', bg2: '#2F6B3E', ink: '#FFF8D6', accent: '#FFD23F' },
    plan: [
      { t: 'Enviarle flores amarillas', done: false },
      { t: 'Mensaje al despertar', done: false },
      { t: 'Videollamada de noche', done: false },
    ],
  },
  aniversario: {
    name: 'Nuestro aniversario',
    tagline: 'Otro año eligiéndote',
    message: 'Gracias por cada día, por cada kilómetro que hemos hecho más corto.',
    motif: 'corazones',
    emoji: '💗',
    font: 'serif',
    density: 34,
    speed: 2,
    repeat: 'yearly',
    palette: { bg1: '#3A0F2A', bg2: '#7A1F4B', ink: '#FFEAF1', accent: '#FF7AA2' },
    plan: [],
  },
  cumple: {
    name: 'Tu cumpleaños',
    tagline: 'Hoy el mundo celebra que existes',
    message: 'Que este año te devuelva todo lo bonito que tú das.',
    motif: 'destellos',
    emoji: '✨',
    font: 'sans',
    density: 46,
    speed: 2,
    repeat: 'yearly',
    palette: { bg1: '#1F1B5C', bg2: '#4B2FA0', ink: '#FFF6E5', accent: '#FFC933' },
    plan: [],
  },
  estrellas: {
    name: 'Noche de estrellas',
    tagline: 'Mismo cielo, distinta ciudad',
    message: 'Mira arriba. Yo estoy mirando lo mismo.',
    motif: 'estrellas',
    emoji: '⭐',
    font: 'hand',
    density: 60,
    speed: 1,
    repeat: 'none',
    palette: { bg1: '#070B25', bg2: '#1C2A6B', ink: '#F4F7FF', accent: '#BFD4FF' },
    plan: [],
  },
  reencuentro: {
    name: 'Día del reencuentro',
    tagline: 'Por fin, otra vez',
    message: 'Se acabó la cuenta regresiva. Ven acá.',
    motif: 'petalos',
    emoji: '🌸',
    font: 'serif',
    density: 36,
    speed: 2,
    repeat: 'none',
    palette: { bg1: '#0E3B43', bg2: '#1F7A6C', ink: '#F2FFF9', accent: '#FFD27A' },
    plan: [],
  },
  blanco: {
    name: 'Nuestro momento',
    tagline: 'Un día que es solo nuestro',
    message: '',
    motif: 'destellos',
    emoji: '💛',
    font: 'serif',
    density: 30,
    speed: 2,
    repeat: 'none',
    palette: { bg1: '#2A2052', bg2: '#5B3FA8', ink: '#F7F2FF', accent: '#F6B800' },
    plan: [],
  },
}

export const TEMPLATE_ORDER = ['flores', 'aniversario', 'cumple', 'estrellas', 'reencuentro', 'blanco'] as const
