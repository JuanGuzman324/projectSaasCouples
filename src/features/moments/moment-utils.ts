// Próxima ocurrencia de un momento especial, considerando su repetición
// (misma lógica que dates/date-utils.ts, pero moments solo admite
// 'none' | 'yearly', no repetición mensual).

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function atLocalMidnight(y: number, m: number, d: number): Date {
  const t = new Date(y, m, 1)
  y = t.getFullYear()
  m = t.getMonth()
  let dt = new Date(y, m, d)
  if (dt.getMonth() !== m) dt = new Date(y, m + 1, 0)
  return dt
}

export function nextMomentOccurrence(
  happensOn: string | null,
  repeat: 'none' | 'yearly',
  from: Date
): Date | null {
  if (!happensOn) return null
  const base = parseLocalDate(happensOn)
  if (repeat === 'yearly') {
    let candidate = atLocalMidnight(from.getFullYear(), base.getMonth(), base.getDate())
    if (candidate < from) candidate = atLocalMidnight(from.getFullYear() + 1, base.getMonth(), base.getDate())
    return candidate < base ? base : candidate
  }
  return base
}

export function daysBetween(date: Date, from: Date): number {
  const ms =
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
    Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  return Math.round(ms / 86_400_000)
}
