import { useTranslation } from 'react-i18next'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { useCreateMoment, useMoments } from '../moments/useMoments'
import { CULTURAL_DATES, isRelevantToCouple, nextOccurrence } from './data'
import type { CoupleWithMembers } from '../couple/api'

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function CulturalDatesPage({ couple }: { couple: CoupleWithMembers }) {
  const { t, i18n } = useTranslation('culturaldates')
  const { data: moments } = useMoments()
  const createMoment = useCreateMoment()

  const countries = couple.members.map((m) => m.country)
  const noCountry = countries.every((c) => c == null)
  const today = new Date()

  const suggestions = CULTURAL_DATES.map((entry) => ({ entry, date: nextOccurrence(entry, today) }))
    .filter((s): s is { entry: (typeof CULTURAL_DATES)[number]; date: Date } => s.date !== null)
    .filter((s) => isRelevantToCouple(s.entry, countries))
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  async function onAdd(entry: (typeof CULTURAL_DATES)[number], date: Date) {
    await createMoment.mutateAsync({
      coupleId: couple.id,
      name: t(`date.${entry.id}.title`),
      happensOn: toISO(date),
      repeat: entry.rule.type === 'lookup' ? 'none' : 'yearly',
      tagline: t(`date.${entry.id}.tagline`),
      message: t(`date.${entry.id}.message`),
      motif: entry.design.motif,
      emoji: entry.design.emoji,
      font: entry.design.font,
      density: entry.design.density,
      speed: entry.design.speed,
      palette: entry.design.palette,
      plan: [],
      photoPath: null,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="[font-family:var(--font-display)] text-3xl">{t('title')}</h1>
      <p className="text-sm text-[var(--color-muted)]">{t('intro')}</p>

      {noCountry && (
        <Card className="text-center">
          <p className="text-[var(--color-muted)]">{t('noCountry.hint')}</p>
        </Card>
      )}

      <ul className="flex flex-col gap-4">
        {suggestions.map(({ entry, date }) => {
          const title = t(`date.${entry.id}.title`)
          const alreadyAdded = (moments ?? []).some((m) => m.name === title)
          return (
            <li key={entry.id}>
              <Card className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-2xl" aria-hidden>
                    {entry.design.emoji}
                  </span>
                  <h3 className="[font-family:var(--font-display)] text-xl">{title}</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    {new Intl.DateTimeFormat(i18n.resolvedLanguage, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }).format(date)}
                  </p>
                  <p className="mt-1 text-sm">{t(`date.${entry.id}.tagline`)}</p>
                </div>
                <Button
                  variant="ghost"
                  disabled={alreadyAdded || createMoment.isPending}
                  onClick={() => onAdd(entry, date)}
                  className="flex-none"
                >
                  {alreadyAdded ? t('action.added') : t('action.add')}
                </Button>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
