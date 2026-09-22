// Próximos hitos de la relación: día redondo (100, 500, 1000...) o
// aniversario (1 año, 2 años...), calculados desde couple.start_date.
// Mismo patrón de parseo de fecha local que dates/date-utils.ts y
// moments/moment-utils.ts (evita el desfase de un día que da
// `new Date('2024-01-01')` al interpretarse como UTC).

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

function addYears(date: Date, years: number): Date {
  const t = new Date(date.getFullYear() + years, date.getMonth(), 1)
  let dt = new Date(t.getFullYear(), t.getMonth(), date.getDate())
  if (dt.getMonth() !== t.getMonth()) dt = new Date(t.getFullYear(), t.getMonth() + 1, 0) // clamp (29 feb en año no bisiesto)
  return dt
}

export function daysUntil(date: Date, from: Date): number {
  const ms =
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
    Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  return Math.round(ms / 86_400_000)
}

// Redondos "bonitos" para contar días: cada 100 hasta 1000, luego cada
// 500 hasta 5000, luego cada 1000. couple.start_date cuenta como día 1
// (mismo criterio que el contador de "días juntos" del Home), así que el
// día N cae en start_date + (N - 1).
const DAY_MILESTONES = [100, 200, 300, 365, 500, 730, 1000, 1500, 2000, 2500, 3000, 3650, 5000, 7500, 10000]
const MAX_ANNIVERSARY_YEARS = 60

export type Milestone =
  | { kind: 'day'; value: number; date: Date }
  | { kind: 'anniversary'; value: number; date: Date }

export function nextMilestones(startDate: string, from: Date, count = 4): Milestone[] {
  const start = parseLocalDate(startDate)
  const candidates: Milestone[] = []

  for (const n of DAY_MILESTONES) {
    candidates.push({ kind: 'day', value: n, date: addDays(start, n - 1) })
  }
  for (let years = 1; years <= MAX_ANNIVERSARY_YEARS; years++) {
    candidates.push({ kind: 'anniversary', value: years, date: addYears(start, years) })
  }

  const todayMidnight = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  return candidates
    .filter((m) => m.date >= todayMidnight)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, count)
}
