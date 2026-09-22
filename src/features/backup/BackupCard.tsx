import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Alert } from '../../ui/Alert'
import { buildBackup, downloadBackup, parseBackupFile, restoreBackup, type RestoreCounts } from './api'
import { MEMORIES_QUERY_KEY } from '../memories/useMemories'
import { DATES_QUERY_KEY } from '../dates/useDates'
import { MOMENTS_QUERY_KEY } from '../moments/useMoments'

export function BackupCard({ coupleId }: { coupleId: string }) {
  const { t } = useTranslation('couple')
  const qc = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)

  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<RestoreCounts | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onExport() {
    setError(null)
    setResult(null)
    setBusy(true)
    try {
      const backup = await buildBackup()
      downloadBackup(backup)
    } catch {
      setError(t('settings.backup.error.export'))
    } finally {
      setBusy(false)
    }
  }

  async function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError(null)
    setResult(null)
    try {
      const backup = await parseBackupFile(file)
      const total = backup.memories.length + backup.dates.length + backup.moments.length
      if (!window.confirm(t('settings.backup.confirmImport', { count: total }))) return
      setBusy(true)
      const counts = await restoreBackup(coupleId, backup)
      setResult(counts)
      await Promise.all([
        qc.invalidateQueries({ queryKey: MEMORIES_QUERY_KEY }),
        qc.invalidateQueries({ queryKey: DATES_QUERY_KEY }),
        qc.invalidateQueries({ queryKey: MOMENTS_QUERY_KEY }),
      ])
    } catch {
      setError(t('settings.backup.error.import'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="[font-family:var(--font-display)] text-xl">{t('settings.backup.title')}</h2>
      <p className="text-sm text-[var(--color-muted)]">{t('settings.backup.hint')}</p>
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="ghost" disabled={busy} onClick={onExport}>
          {t('settings.backup.export')}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          onChange={onFileChosen}
          className="sr-only"
        />
        <Button type="button" variant="ghost" disabled={busy} onClick={() => inputRef.current?.click()}>
          {t('settings.backup.import')}
        </Button>
      </div>
      {result && (
        <Alert tone="success">
          {t('settings.backup.result', {
            memories: result.memories,
            dates: result.dates,
            moments: result.moments,
          })}
        </Alert>
      )}
      {error && <Alert>{error}</Alert>}
    </Card>
  )
}
