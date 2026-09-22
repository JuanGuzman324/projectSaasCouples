// Próxima ocurrencia de una fecha, considerando su repetición. Misma lógica
// que usamos en el prototipo HTML (nextOcc), reescrita para trabajar con
// Date de forma segura sin desfases de zona horaria.
import type { CoupleDate } from './api'

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function atLocalMidnight(y: number, m: number, d: number): Date {
  const t = new Date(y, m, 1)
  y = t.getFullYear()
  m = t.getMonth()
  let dt = new Date(y, m, d)
  if (dt.getMonth() !== m) dt = new Date(y, m + 1, 0) // clamp (31 feb -> 28/29 feb)
  return dt
}

export function nextOccurrence(item: Pick<CoupleDate, 'happens_on' | 'repeat'>, from: Date): Date | null {
  const base = parseLocalDate(item.happens_on)
  if (item.repeat === 'yearly') {
    let candidate = atLocalMidnight(from.getFullYear(), base.getMonth(), base.getDate())
    if (candidate < from) candidate = atLocalMidnight(from.getFullYear() + 1, base.getMonth(), base.getDate())
    return candidate < base ? base : candidate
  }
  if (item.repeat === 'monthly') {
    let candidate = atLocalMidnight(from.getFullYear(), from.getMonth(), base.getDate())
    if (candidate < from) candidate = atLocalMidnight(from.getFullYear(), from.getMonth() + 1, base.getDate())
    return candidate < base ? base : candidate
  }
  return base
}

export function daysUntil(date: Date, from: Date): number {
  const ms =
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
    Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  return Math.round(ms / 86_400_000)
}
