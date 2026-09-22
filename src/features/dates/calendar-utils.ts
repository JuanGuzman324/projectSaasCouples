// Marca qué días de un mes visible tienen contenido (fecha/recuerdo/
// momento), incluyendo ocurrencias repetidas (mensual/anual), sin
// depender de un rango de fechas: solo escanea los ~31 días del mes que
// se está mostrando. Mismo parseo de fecha local que dates/date-utils.ts.

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function dayKey(y: number, m: number, d: number): number {
  return y * 372 + m * 31 + d // suficiente para comparar orden, no para aritmética de calendario real
}

export function occursOnDay(
  happensOn: string,
  repeat: 'none' | 'monthly' | 'yearly',
  y: number,
  m: number,
  d: number
): boolean {
  const base = parseLocalDate(happensOn)
  const baseKey = dayKey(base.getFullYear(), base.getMonth(), base.getDate())
  const key = dayKey(y, m, d)
  if (key < baseKey) return false // no mostrar ocurrencias "antes" de que la fecha existiera

  if (repeat === 'yearly') return base.getMonth() === m && base.getDate() === d
  if (repeat === 'monthly') return base.getDate() === d
  return base.getFullYear() === y && base.getMonth() === m && base.getDate() === d
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}
