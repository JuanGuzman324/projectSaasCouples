import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../lib/auth-store'
import { useUpdateCouple, useUpdateMyMember } from './useCouple'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { TextField } from '../../ui/TextField'
import { Alert } from '../../ui/Alert'
import { BackupCard } from '../backup/BackupCard'
import type { CoupleWithMembers } from './api'

export function SettingsPage({ couple }: { couple: CoupleWithMembers }) {
  const { t } = useTranslation('couple')
  const userId = useAuthStore((s) => s.session?.user.id)
  const me = couple.members.find((m) => m.user_id === userId)

  const updateCouple = useUpdateCouple()
  const updateMember = useUpdateMyMember()

  const [displayName, setDisplayName] = useState(me?.display_name ?? '')
  const [city, setCity] = useState(me?.city ?? '')
  const [lat, setLat] = useState(me?.lat != null ? String(me.lat) : '')
  const [lon, setLon] = useState(me?.lon != null ? String(me.lon) : '')
  const [startDate, setStartDate] = useState(couple.start_date ?? '')

  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const saving = updateCouple.isPending || updateMember.isPending

  function parseCoord(v: string): number | null {
    const trimmed = v.trim()
    if (!trimmed) return null
    const n = Number(trimmed)
    return Number.isFinite(n) ? n : null
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!userId) return
    setError(null)
    setSaved(false)
    try {
      await Promise.all([
        updateCouple.mutateAsync({ coupleId: couple.id, patch: { startDate: startDate || null } }),
        updateMember.mutateAsync({
          coupleId: couple.id,
          userId,
          patch: {
            displayName: displayName.trim() || null,
            city: city.trim() || null,
            lat: parseCoord(lat),
            lon: parseCoord(lon),
          },
        }),
      ])
      setSaved(true)
    } catch {
      setError(t('settings.error.save'))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="[font-family:var(--font-display)] text-3xl">{t('settings.title')}</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <Card className="flex flex-col gap-4">
          <h2 className="[font-family:var(--font-display)] text-xl">{t('settings.profile.title')}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              label={t('settings.field.displayName')}
              maxLength={60}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="sm:col-span-2"
            />
            <TextField
              label={t('settings.field.city')}
              maxLength={80}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="sm:col-span-2"
            />
            <TextField
              label={t('settings.field.lat')}
              type="number"
              step="any"
              min={-90}
              max={90}
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <TextField
              label={t('settings.field.lon')}
              type="number"
              step="any"
              min={-180}
              max={180}
              value={lon}
              onChange={(e) => setLon(e.target.value)}
            />
          </div>
          <p className="text-xs text-[var(--color-muted)] sm:col-span-2">{t('settings.field.latLonHint')}</p>
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="[font-family:var(--font-display)] text-xl">{t('settings.couple.title')}</h2>
          <TextField
            label={t('settings.field.startDate')}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Card>

        {saved && <Alert tone="success">{t('settings.saved')}</Alert>}
        {error && <Alert>{error}</Alert>}

        <Button type="submit" disabled={saving} className="self-start">
          {t('settings.action.save')}
        </Button>
      </form>

      <BackupCard coupleId={couple.id} />
    </div>
  )
}
