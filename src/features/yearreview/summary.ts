import type { Memory } from '../memories/api'
import type { CoupleDate } from '../dates/api'
import type { Moment } from '../moments/api'

// Mismo criterio de parseo de fecha local que milestones.ts/date-utils.ts:
// evita el desfase de un día que da `new Date('2024-01-01')` en UTC.
function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function yearOf(iso: string): number {
  return parseLocalDate(iso).getFullYear()
}

export interface YearReview {
  year: number
  daysTogether: number | null
  memoriesCount: number
  favoriteMemoriesCount: number
  topTag: Memory['tag'] | null
  datesCount: number
  encountersCount: number
  momentsCount: number
}

// Todo se deriva de los datos ya cargados por las otras features (no pega a
// Supabase de nuevo): un "resumen anual" es una vista distinta de los mismos
// recuerdos/fechas/momentos, no una fuente de datos aparte.
export function buildYearReview(
  year: number,
  startDate: string | null,
  memories: Memory[],
  dates: CoupleDate[],
  moments: Moment[]
): YearReview {
  const yearMemories = memories.filter((m) => yearOf(m.happened_on) === year)
  const yearDates = dates.filter((d) => yearOf(d.happens_on) === year)
  const yearMoments = moments.filter((m) => m.happens_on != null && yearOf(m.happens_on) === year)

  const tagCounts = new Map<Memory['tag'], number>()
  for (const m of yearMemories) tagCounts.set(m.tag, (tagCounts.get(m.tag) ?? 0) + 1)
  let topTag: Memory['tag'] | null = null
  let topCount = 0
  for (const [tag, count] of tagCounts) {
    if (count > topCount) {
      topTag = tag
      topCount = count
    }
  }

  let daysTogether: number | null = null
  if (startDate) {
    const start = parseLocalDate(startDate)
    const yearEnd = new Date(year, 11, 31)
    const now = new Date()
    const cutoff = yearEnd < now ? yearEnd : new Date(now.getFullYear(), now.getMonth(), now.getDate())
    if (cutoff >= start) {
      const ms =
        Date.UTC(cutoff.getFullYear(), cutoff.getMonth(), cutoff.getDate()) -
        Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
      daysTogether = Math.round(ms / 86_400_000) + 1
    }
  }

  return {
    year,
    daysTogether,
    memoriesCount: yearMemories.length,
    favoriteMemoriesCount: yearMemories.filter((m) => m.is_favorite).length,
    topTag,
    datesCount: yearDates.length,
    encountersCount: yearDates.filter((d) => d.kind === 'encuentro').length,
    momentsCount: yearMoments.length,
  }
}

// Años con al menos un dato propio, más el año actual siempre presente
// (para poder pedir el resumen de un año recién empezado).
export function availableYears(
  startDate: string | null,
  memories: Memory[],
  dates: CoupleDate[],
  moments: Moment[]
): number[] {
  const years = new Set<number>([new Date().getFullYear()])
  if (startDate) years.add(yearOf(startDate))
  for (const m of memories) years.add(yearOf(m.happened_on))
  for (const d of dates) years.add(yearOf(d.happens_on))
  for (const m of moments) if (m.happens_on) years.add(yearOf(m.happens_on))
  return [...years].sort((a, b) => b - a)
}
