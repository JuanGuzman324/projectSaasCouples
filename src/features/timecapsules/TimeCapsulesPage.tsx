import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { TextField } from '../../ui/TextField'
import { Textarea } from '../../ui/Textarea'
import { Alert } from '../../ui/Alert'
import { useAuthStore } from '../../lib/auth-store'
import { useCreateTimeCapsule, useDeleteTimeCapsule, useTimeCapsules } from './useTimeCapsules'
import { useMyCouple } from '../couple/useCouple'
import { isPremium, FREE_LIMITS } from '../premium/limits'
import { UpsellCard } from '../premium/UpsellCard'

function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Fecha máxima razonable para el selector: el navegador no limita el año a
// 4 dígitos por sí solo (un typo puede producir "52026"), así que se acota
// aquí y además se formatea de forma defensiva más abajo, para que un
// open_on corrupto no tumbe toda la página con un RangeError sin manejar.
function maxOpenOnISO(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 50)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDateSafe(iso: string, locale: string | undefined): string {
  const date = new Date(iso + 'T00:00:00')
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export function TimeCapsulesPage({ coupleId }: { coupleId: string }) {
  const { t, i18n } = useTranslation(['timecapsules', 'premium'])
  const userId = useAuthStore((s) => s.session?.user.id)
  const { data: capsules, isLoading } = useTimeCapsules()
  const { data: couple } = useMyCouple()
  const createCapsule = useCreateTimeCapsule()
  const deleteCapsule = useDeleteTimeCapsule()
  const limitReached = !isPremium(couple) && (capsules?.length ?? 0) >= FREE_LIMITS.timeCapsules

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [openOn, setOpenOn] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!userId) return
    try {
      await createCapsule.mutateAsync({ coupleId, createdBy: userId, title, body, openOn })
      setTitle('')
      setBody('')
      setOpenOn('')
      setShowForm(false)
    } catch {
      setError(t('error.save'))
    }
  }

  const today = todayISO()
  const sorted = [...(capsules ?? [])].sort((a, b) => a.open_on.localeCompare(b.open_on))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="[font-family:var(--font-display)] text-3xl">{t('nav')}</h1>
        <Button onClick={() => setShowForm((s) => !s)} disabled={limitReached}>
          {t('action.new')}
        </Button>
      </div>
      <p className="text-sm text-[var(--color-muted)]">{t('intro')}</p>

      {limitReached && (
        <UpsellCard message={t('limit.timeCapsules', { ns: 'premium', count: FREE_LIMITS.timeCapsules })} />
      )}

      {showForm && !limitReached && (
        <Card>
          <h2 className="mb-4 [font-family:var(--font-display)] text-xl">{t('new.title')}</h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <TextField
              label={t('field.title')}
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label={t('field.openOn')}
              type="date"
              required
              min={today}
              max={maxOpenOnISO()}
              value={openOn}
              onChange={(e) => setOpenOn(e.target.value)}
            />
            <Textarea
              label={t('field.body')}
              required
              maxLength={3000}
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            {error && <Alert>{error}</Alert>}
            <Button type="submit" disabled={createCapsule.isPending}>
              {t('action.save')}
            </Button>
          </form>
        </Card>
      )}

      {!isLoading && sorted.length === 0 && (
        <Card className="text-center">
          <h2 className="[font-family:var(--font-display)] text-xl">{t('empty.title')}</h2>
          <p className="mt-1 text-[var(--color-muted)]">{t('empty.subtitle')}</p>
        </Card>
      )}

      <ul className="flex flex-col gap-4">
        {sorted.map((c) => {
          const isOpen = c.open_on <= today
          const isMine = c.created_by === userId
          const formattedDate = formatDateSafe(c.open_on, i18n.resolvedLanguage)

          return (
            <li key={c.id}>
              <Card className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-muted)]">
                      {isOpen ? t('status.open') : t('status.sealed')}
                    </span>
                    <h3 className="[font-family:var(--font-display)] text-xl">{c.title}</h3>
                  </div>
                  <button
                    type="button"
                    aria-label={t('action.delete')}
                    onClick={() => {
                      if (confirm(t('confirm.delete'))) deleteCapsule.mutate(c.id)
                    }}
                    className="flex-none rounded-full p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                  >
                    🗑
                  </button>
                </div>

                {isOpen || isMine ? (
                  <>
                    {!isOpen && <p className="text-xs text-[var(--color-muted)]">{t('hint.onlyYouSeeIt')}</p>}
                    <p className="whitespace-pre-wrap text-sm">{c.body}</p>
                    <p className="text-xs text-[var(--color-muted)]">{t('field.openOn')}: {formattedDate}</p>
                  </>
                ) : (
                  <p className="text-sm text-[var(--color-muted)]">
                    {t('sealed.hint', { date: formattedDate })}
                  </p>
                )}
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
