import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../lib/auth-store'
import { supabase } from '../../lib/supabase'
import { useDeleteAccount, useUpdateCouple, useUpdateMyMember } from './useCouple'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { TextField } from '../../ui/TextField'
import { Select } from '../../ui/Select'
import { Alert } from '../../ui/Alert'
import { Modal } from '../../ui/Modal'
import { BackupCard } from '../backup/BackupCard'
import { PushToggle } from '../push/PushToggle'
import { isPremium } from '../premium/limits'
import type { CoupleWithMembers } from './api'

const TIMEZONES: string[] =
  typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : []

// A diferencia de 'timeZone', Intl.supportedValuesOf no tiene una key
// 'region': no hay forma de pedirle al runtime la lista de países ISO
// 3166-1 alfa-2, así que se guarda a mano (nombres via Intl.DisplayNames).
const COUNTRIES = [
  'AR', 'BO', 'BR', 'CA', 'CL', 'CN', 'CO', 'CR', 'CU', 'DE', 'DO', 'EC', 'ES', 'FR', 'GB',
  'GT', 'HK', 'HN', 'IN', 'IT', 'JP', 'KR', 'MX', 'NI', 'PA', 'PE', 'PR', 'PT', 'PY', 'SV',
  'TW', 'US', 'UY', 'VE',
] as const

export function SettingsPage({ couple }: { couple: CoupleWithMembers }) {
  const { t, i18n } = useTranslation('couple')
  const countryNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(i18n.resolvedLanguage, { type: 'region' }) : null
  const userId = useAuthStore((s) => s.session?.user.id)
  const me = couple.members.find((m) => m.user_id === userId)

  const updateCouple = useUpdateCouple()
  const updateMember = useUpdateMyMember()

  const [displayName, setDisplayName] = useState(me?.display_name ?? '')
  const [city, setCity] = useState(me?.city ?? '')
  const [lat, setLat] = useState(me?.lat != null ? String(me.lat) : '')
  const [lon, setLon] = useState(me?.lon != null ? String(me.lon) : '')
  const [tz, setTz] = useState(me?.tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [country, setCountry] = useState(me?.country ?? '')
  const [startDate, setStartDate] = useState(couple.start_date ?? '')

  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const saving = updateCouple.isPending || updateMember.isPending

  const deleteAccount = useDeleteAccount()
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)

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
            tz: tz || null,
            country: country || null,
          },
        }),
      ])
      setSaved(true)
    } catch {
      setError(t('settings.error.save'))
    }
  }

  const confirmWord = t('settings.danger.confirmWord')
  async function onDeleteAccount() {
    if (deleteConfirmText.trim().toUpperCase() !== confirmWord.toUpperCase()) return
    setDeleteError(null)
    try {
      await deleteAccount.mutateAsync()
      await supabase.auth.signOut()
    } catch {
      setDeleteError(t('settings.danger.error'))
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
          <Select label={t('settings.field.tz')} value={tz} onChange={(e) => setTz(e.target.value)}>
            {!TIMEZONES.includes(tz) && <option value={tz}>{tz}</option>}
            {TIMEZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </Select>
          <Select label={t('settings.field.country')} value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">{t('settings.field.countryNone')}</option>
            {[...COUNTRIES]
              .sort((a, b) => (countryNames?.of(a) ?? a).localeCompare(countryNames?.of(b) ?? b))
              .map((c) => (
                <option key={c} value={c}>
                  {countryNames?.of(c) ?? c}
                </option>
              ))}
          </Select>
          <p className="text-xs text-[var(--color-muted)] sm:col-span-2">{t('settings.field.countryHint')}</p>
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

      <PushToggle coupleId={couple.id} userId={userId} />

      <BackupCard coupleId={couple.id} />

      <Card className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--color-muted)]">{t('settings.plan.label')}</p>
          <p className="[font-family:var(--font-display)] text-xl">
            {isPremium(couple) ? t('settings.plan.premium') : t('settings.plan.free')}
          </p>
        </div>
        <Link to="/premium">
          <Button variant="ghost">{t('settings.plan.manage')}</Button>
        </Link>
      </Card>

      <Card className="flex flex-col gap-3 border-[var(--color-danger)]/30">
        <h2 className="[font-family:var(--font-display)] text-xl text-[var(--color-danger)]">
          {t('settings.danger.title')}
        </h2>
        <p className="text-sm text-[var(--color-muted)]">{t('settings.danger.explain')}</p>
        <Button
          variant="ghost"
          className="self-start border-[var(--color-danger)]/40 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
          onClick={() => {
            setDeleteConfirmText('')
            setDeleteError(null)
            setConfirmingDelete(true)
          }}
        >
          {t('settings.danger.action')}
        </Button>
      </Card>

      {confirmingDelete && (
        <Modal title={t('settings.danger.title')} onClose={() => setConfirmingDelete(false)}>
          <div className="flex flex-col gap-4">
            <p className="text-sm">{t('settings.danger.confirmExplain')}</p>
            <TextField
              label={t('settings.danger.confirmLabel', { word: confirmWord })}
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              autoComplete="off"
            />
            {deleteError && <Alert>{deleteError}</Alert>}
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setConfirmingDelete(false)}>
                {t('settings.danger.cancel')}
              </Button>
              <Button
                className="border-[var(--color-danger)] bg-[var(--color-danger)] text-white hover:brightness-105"
                disabled={deleteAccount.isPending || deleteConfirmText.trim().toUpperCase() !== confirmWord.toUpperCase()}
                onClick={onDeleteAccount}
              >
                {t('settings.danger.confirm')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
