import type { MomentPalette } from '../moments/api'
import type { Motif, MomentFont } from '../moments/constants'

// Reglas de recurrencia soportadas sin librerías de calendario:
// - fixed: mismo mes/día cada año (la mayoría de estas fechas).
// - nthWeekday: "el n-ésimo <día de semana> de <mes>" (ej. 3er sábado).
// - lookup: fecha que se mueve por calendario lunar/solar y no sigue una
//   regla simple; se guarda la fecha gregoriana ya calculada para un rango
//   de años conocido en vez de implementar astronomía lunar.
export type DateRule =
  | { type: 'fixed'; month: number; day: number }
  | { type: 'nthWeekday'; month: number; weekday: number; nth: number }
  | { type: 'lookup'; years: Record<number, string> }

export interface CulturalDateDesign {
  motif: Motif
  emoji: string
  font: MomentFont
  density: number
  speed: number
  palette: MomentPalette
}

export interface CulturalDate {
  id: string
  countries: string[] | null // null = global, se sugiere sin importar el país
  rule: DateRule
  design: CulturalDateDesign
}

export const CULTURAL_DATES: CulturalDate[] = [
  {
    id: 'san-valentin',
    countries: null,
    rule: { type: 'fixed', month: 2, day: 14 },
    design: {
      motif: 'corazones',
      emoji: '💘',
      font: 'serif',
      density: 34,
      speed: 2,
      palette: { bg1: '#3A0F2A', bg2: '#7A1F4B', ink: '#FFEAF1', accent: '#FF7AA2' },
    },
  },
  {
    id: 'flores-amarillas',
    countries: ['EC', 'CU'],
    rule: { type: 'fixed', month: 9, day: 21 },
    design: {
      motif: 'flores',
      emoji: '🌼',
      font: 'hand',
      density: 40,
      speed: 2,
      palette: { bg1: '#12301F', bg2: '#2F6B3E', ink: '#FFF8D6', accent: '#FFD23F' },
    },
  },
  {
    id: 'amor-amistad-co',
    countries: ['CO'],
    rule: { type: 'nthWeekday', month: 9, weekday: 6, nth: 3 },
    design: {
      motif: 'corazones',
      emoji: '💛',
      font: 'sans',
      density: 30,
      speed: 2,
      palette: { bg1: '#1F1B5C', bg2: '#4B2FA0', ink: '#FFF6E5', accent: '#FFC933' },
    },
  },
  {
    id: 'white-day',
    countries: ['JP', 'KR', 'CN', 'TW'],
    rule: { type: 'fixed', month: 3, day: 14 },
    design: {
      motif: 'destellos',
      emoji: '🤍',
      font: 'serif',
      density: 30,
      speed: 2,
      palette: { bg1: '#2A2052', bg2: '#5B3FA8', ink: '#F7F2FF', accent: '#F6B800' },
    },
  },
  {
    id: 'tanabata',
    countries: ['JP'],
    rule: { type: 'fixed', month: 7, day: 7 },
    design: {
      motif: 'estrellas',
      emoji: '⭐',
      font: 'hand',
      density: 60,
      speed: 1,
      palette: { bg1: '#070B25', bg2: '#1C2A6B', ink: '#F4F7FF', accent: '#BFD4FF' },
    },
  },
  {
    id: 'qixi',
    countries: ['CN', 'TW', 'HK'],
    // Fecha gregoriana del 7º día del 7º mes lunar, tomada de calendarios
    // lunares publicados (sin cálculo astronómico propio); puede tener un
    // día de margen de error para los años más lejanos.
    rule: {
      type: 'lookup',
      years: {
        2024: '08-10',
        2025: '08-29',
        2026: '08-19',
        2027: '08-08',
        2028: '08-26',
        2029: '08-16',
        2030: '08-05',
      },
    },
    design: {
      motif: 'estrellas',
      emoji: '✨',
      font: 'hand',
      density: 50,
      speed: 1,
      palette: { bg1: '#3A0F2A', bg2: '#7A1F4B', ink: '#FFEAF1', accent: '#FFD23F' },
    },
  },
  {
    id: 'dia-beso',
    countries: null,
    rule: { type: 'fixed', month: 7, day: 6 },
    design: {
      motif: 'petalos',
      emoji: '💋',
      font: 'serif',
      density: 36,
      speed: 2,
      palette: { bg1: '#0E3B43', bg2: '#1F7A6C', ink: '#F2FFF9', accent: '#FFD27A' },
    },
  },
  {
    id: 'dia-abrazo',
    countries: null,
    rule: { type: 'fixed', month: 1, day: 21 },
    design: {
      motif: 'destellos',
      emoji: '🤗',
      font: 'sans',
      density: 46,
      speed: 2,
      palette: { bg1: '#1F1B5C', bg2: '#4B2FA0', ink: '#FFF6E5', accent: '#FFC933' },
    },
  },
]

function nthWeekdayOfMonth(year: number, month: number, weekday: number, nth: number): Date {
  const first = new Date(year, month - 1, 1)
  const firstWeekday = first.getDay()
  const offset = (weekday - firstWeekday + 7) % 7
  return new Date(year, month - 1, 1 + offset + (nth - 1) * 7)
}

// Próxima ocurrencia desde `from` (incluye hoy). Devuelve null si la regla
// tipo lookup no tiene el año cubierto en la tabla.
export function nextOccurrence(entry: CulturalDate, from: Date): Date | null {
  const todayMidnight = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  for (let year = from.getFullYear(); year <= from.getFullYear() + 1; year++) {
    let date: Date | null = null
    if (entry.rule.type === 'fixed') {
      date = new Date(year, entry.rule.month - 1, entry.rule.day)
    } else if (entry.rule.type === 'nthWeekday') {
      date = nthWeekdayOfMonth(year, entry.rule.month, entry.rule.weekday, entry.rule.nth)
    } else {
      const md = entry.rule.years[year]
      if (md) {
        const [m, d] = md.split('-').map(Number)
        date = new Date(year, m - 1, d)
      }
    }
    if (date && date >= todayMidnight) return date
  }
  return null
}

export function isRelevantToCouple(entry: CulturalDate, countries: (string | null)[]): boolean {
  if (entry.countries === null) return true
  return countries.some((c) => c != null && entry.countries!.includes(c))
}
