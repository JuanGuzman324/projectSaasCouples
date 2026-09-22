import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { TextField } from '../../ui/TextField'
import { Select } from '../../ui/Select'
import { useCreateDate, useDates, useDeleteDate } from './useDates'
import { daysUntil, nextOccurrence } from './date-utils'
import type { DateKind, DateRepeat } from './api'

const KINDS: DateKind[] = ['encuentro', 'aniversario', 'cumple', 'especial', 'otro']
const REPEATS: DateRepeat[] = ['none', 'monthly', 'yearly']

function Countdown({ days, t }: { days: number; t: (k: string, o?: Record<string, unknown>) => string }) {
  if (days === 0) return <>{t('countdown.today')}</>
  if (days === 1) return <>{t('countdown.tomorrow')}</>
  if (days > 1) return <>{t('countdown.in', { count: days })}</>
  return <>{t('countdown.past', { count: -days })}</>
}

export function DatesPage({ coupleId }: { coupleId: string }) {
  const { t, i18n } = useTranslation('dates')
  const { data: dates, isLoading } = useDates()
  const createDate = useCreateDate()
  const deleteDate = useDeleteDate()

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [happensOn, setHappensOn] = useState('')
  const [kind, setKind] = useState<DateKind>('encuentro')
  const [repeat, setRepeat] = useState<DateRepeat>('none')
  const [place, setPlace] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createDate.mutateAsync({
        coupleId,
        title,
        happensOn,
        kind,
        repeat,
        place: place || null,
        note: note || null,
      })
      setTitle('')
      setHappensOn('')
      setKind('encuentro')
      setRepeat('none')
      setPlace('')
      setNote('')
      setShowForm(false)
    } catch {
      setError(t('error.save'))
    }
  }

  const today = new Date()
  const withCountdown = (dates ?? [])
    .map((d) => {
      const next = nextOccurrence(d, today)
      return next ? { date: d, next, left: daysUntil(next, today) } : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a.left - b.left)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="[font-family:var(--font-display)] text-3xl">{t('nav')}</h1>
        <Button onClick={() => setShowForm((s) => !s)}>{t('action.new')}</Button>
      </div>

      {showForm && (
        <Card>
          <h2 className="mb-4 [font-family:var(--font-display)] text-xl">{t('new.title')}</h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              label={t('field.title')}
              name="title"
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="sm:col-span-2"
            />
            <TextField
              label={t('field.date')}
              type="date"
              name="happensOn"
              required
              value={happensOn}
              onChange={(e) => setHappensOn(e.target.value)}
            />
            <Select label={t('field.kind')} value={kind} onChange={(e) => setKind(e.target.value as DateKind)}>
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {t(`kind.${k}`)}
                </option>
              ))}
            </Select>
            <Select
              label={t('field.repeat')}
              value={repeat}
              onChange={(e) => setRepeat(e.target.value as DateRepeat)}
            >
              {REPEATS.map((r) => (
                <option key={r} value={r}>
                  {t(`repeat.${r}`)}
                </option>
              ))}
            </Select>
            <TextField
              label={t('field.place')}
              name="place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
            <TextField
              label={t('field.note')}
              name="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="sm:col-span-2"
            />
            {error && <p className="text-sm font-medium text-[var(--color-danger)] sm:col-span-2">{error}</p>}
            <Button type="submit" disabled={createDate.isPending} className="sm:col-span-2">
              {t('action.save')}
            </Button>
          </form>
        </Card>
      )}

      {!isLoading && withCountdown.length === 0 && (
        <Card className="text-center">
          <h2 className="[font-family:var(--font-display)] text-xl">{t('empty.title')}</h2>
          <p className="mt-1 text-[var(--color-muted)]">{t('empty.subtitle')}</p>
        </Card>
      )}

      <ul className="flex flex-col gap-4">
        {withCountdown.map(({ date, next, left }) => (
          <li key={date.id}>
            <Card className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[var(--color-muted)]">
                  {t(`kind.${date.kind}`)}
                </span>
                <h3 className="[font-family:var(--font-display)] text-xl">{date.title}</h3>
                <p className="text-sm text-[var(--color-muted)]">
                  {new Intl.DateTimeFormat(i18n.resolvedLanguage, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }).format(next)}
                  {date.place ? ` · ${date.place}` : ''}
                </p>
              </div>
              <div className="flex flex-none items-center gap-3">
                <span className="rounded-full bg-[var(--color-surface-2)] px-3 py-1 text-sm font-semibold">
                  <Countdown days={left} t={t} />
                </span>
                <button
                  type="button"
                  aria-label={t('action.delete')}
                  onClick={() => {
                    if (confirm(t('confirm.delete'))) deleteDate.mutate(date.id)
                  }}
                  className="text-[var(--color-muted)]"
                >
                  🗑
                </button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
