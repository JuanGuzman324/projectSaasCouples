// Copia de seguridad en JSON: exporta e importa el contenido de la pareja
// (recuerdos, fechas, momentos) reutilizando las mismas funciones create*
// de cada feature, nunca un insert directo a la tabla — así que respeta
// exactamente las mismas validaciones y políticas RLS que usar la app a
// mano. Las fotos NO se incluyen (son binarios en Storage, no filas de
// tabla); un recuerdo/momento restaurado queda sin foto y hay que
// volver a subirla.
import { createMemory, fetchMemories, type MemoryTag } from '../memories/api'
import { createDate, fetchDates, type DateKind, type DateRepeat } from '../dates/api'
import { createMoment, fetchMoments, momentToDesign, type MomentDesign } from '../moments/api'

export interface BackupMemory {
  title: string
  happenedOn: string
  tag: MemoryTag
  place: string | null
  body: string | null
}

export interface BackupDate {
  title: string
  happensOn: string
  kind: DateKind
  repeat: DateRepeat
  place: string | null
  note: string | null
}

export type BackupMoment = Omit<MomentDesign, 'photoPath'>

export interface Backup {
  version: 1
  exportedAt: string
  memories: BackupMemory[]
  dates: BackupDate[]
  moments: BackupMoment[]
}

export async function buildBackup(): Promise<Backup> {
  const [memories, dates, moments] = await Promise.all([fetchMemories(), fetchDates(), fetchMoments()])
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    memories: memories.map((m) => ({
      title: m.title,
      happenedOn: m.happened_on,
      tag: m.tag,
      place: m.place,
      body: m.body,
    })),
    dates: dates.map((d) => ({
      title: d.title,
      happensOn: d.happens_on,
      kind: d.kind,
      repeat: d.repeat,
      place: d.place,
      note: d.note,
    })),
    moments: moments.map((m) => {
      const { photoPath: _photoPath, ...rest } = momentToDesign(m)
      return rest
    }),
  }
}

export function downloadBackup(backup: Backup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `nuestra-historia-backup-${backup.exportedAt.slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function isBackup(x: unknown): x is Backup {
  if (!x || typeof x !== 'object') return false
  const b = x as Record<string, unknown>
  return Array.isArray(b.memories) && Array.isArray(b.dates) && Array.isArray(b.moments)
}

export async function parseBackupFile(file: File): Promise<Backup> {
  const text = await file.text()
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('invalid-json')
  }
  if (!isBackup(json)) throw new Error('invalid-shape')
  return json
}

export interface RestoreCounts {
  memories: number
  dates: number
  moments: number
}

// Uno por uno (no Promise.all) a propósito: así un error a mitad de
// camino deja claro cuántos alcanzaron a crearse en vez de disparar
// decenas de inserts en paralelo.
export async function restoreBackup(coupleId: string, backup: Backup): Promise<RestoreCounts> {
  const counts: RestoreCounts = { memories: 0, dates: 0, moments: 0 }
  for (const m of backup.memories) {
    await createMemory({ coupleId, ...m, photoPath: null })
    counts.memories++
  }
  for (const d of backup.dates) {
    await createDate({ coupleId, ...d })
    counts.dates++
  }
  for (const mo of backup.moments) {
    await createMoment({ coupleId, ...mo, photoPath: null })
    counts.moments++
  }
  return counts
}
