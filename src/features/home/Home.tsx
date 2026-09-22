import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import type { CoupleWithMembers } from '../couple/api'

function daysTogether(startDate: string): number {
  const start = new Date(startDate + 'T00:00:00')
  const today = new Date()
  const ms = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
    Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  return Math.max(0, Math.round(ms / 86_400_000) + 1)
}

export function Home({ couple }: { couple: CoupleWithMembers }) {
  const { t, i18n } = useTranslation('home')

  if (!couple.start_date) {
    return (
      <section className="rounded-3xl bg-[var(--color-hero)] p-8 text-[var(--color-hero-ink)]">
        <h1 className="font-[var(--font-display)] text-2xl">{t('hero.empty.title')}</h1>
      </section>
    )
  }

  const days = daysTogether(couple.start_date)
  // Intl.NumberFormat/DateTimeFormat según el idioma activo, como quedó en
  // el plan: nunca formateamos fechas/números a mano por idioma.
  const formattedDate = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(couple.start_date + 'T00:00:00'))
  const formattedDays = new Intl.NumberFormat(i18n.resolvedLanguage).format(days)

  return (
    <section className="rounded-3xl bg-[var(--color-hero)] p-8 text-[var(--color-hero-ink)]">
      <p className="font-[var(--font-display)] text-6xl tabular-nums">{formattedDays}</p>
      <p className="mt-1 text-lg">
        <Trans i18nKey="hero.daysTogether" ns="home" count={days} values={{ count: days }}>
          days together
        </Trans>
      </p>
      <p className="mt-4 text-[var(--color-hero-muted,#BDB4DE)]">{formattedDate}</p>
    </section>
  )
}
