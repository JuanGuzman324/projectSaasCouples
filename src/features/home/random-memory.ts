// Elige qué recuerdo mostrar en Home: si hay alguno que pasó el mismo
// día-mes que hoy (en un año anterior), se prioriza ese grupo; si no,
// cualquiera al azar. Reutilizable tanto para la elección inicial como
// para "otro al azar" (excluyendo el que ya se está mostrando).

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function yearsAgo(happenedOn: string, today: Date): number {
  return today.getFullYear() - parseLocalDate(happenedOn).getFullYear()
}

export function isOnThisDay(happenedOn: string, today: Date): boolean {
  const d = parseLocalDate(happenedOn)
  return d.getMonth() === today.getMonth() && d.getDate() === today.getDate() && d.getFullYear() !== today.getFullYear()
}

export function pickMemoryId<T extends { id: string; happened_on: string }>(
  memories: T[],
  today: Date,
  excludeId: string | null
): string | null {
  if (memories.length === 0) return null
  const onThisDay = memories.filter((m) => isOnThisDay(m.happened_on, today))
  const pool = onThisDay.length > 0 ? onThisDay : memories
  const candidates = excludeId ? pool.filter((m) => m.id !== excludeId) : pool
  const finalPool = candidates.length > 0 ? candidates : pool
  return finalPool[Math.floor(Math.random() * finalPool.length)].id
}
