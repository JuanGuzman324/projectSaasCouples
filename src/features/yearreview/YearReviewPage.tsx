import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Select } from '../../ui/Select'
import { useMemories } from '../memories/useMemories'
import { useDates } from '../dates/useDates'
import { useMoments } from '../moments/useMoments'
import { buildYearReview, availableYears } from './summary'
import { renderYearReviewCanvas, downloadCanvasAsPng } from './export-image'
import type { CoupleWithMembers } from '../couple/api'

export function YearReviewPage({ couple }: { couple: CoupleWithMembers }) {
  const { t, i18n } = useTranslation(['yearreview', 'memories'])
  const { data: memories, isLoading: loadingMemories } = useMemories()
  const { data: dates, isLoading: loadingDates } = useDates()
  const { data: moments, isLoading: loadingMoments } = useMoments()

  const isLoading = loadingMemories || loadingDates || loadingMoments
  const years = availableYears(couple.start_date, memories ?? [], dates ?? [], moments ?? [])
  const [year, setYear] = useState(years[0])

  if (isLoading) return null

  const review = buildYearReview(year, couple.start_date, memories ?? [], dates ?? [], moments ?? [])

  const stats = [
    { value: String(review.memoriesCount), label: t('stat.memories', { count: review.memoriesCount }) },
    { value: String(review.encountersCount), label: t('stat.encounters', { count: review.encountersCount }) },
    { value: String(review.momentsCount), label: t('stat.moments', { count: review.momentsCount }) },
    { value: String(review.datesCount), label: t('stat.dates', { count: review.datesCount }) },
  ]

  function onDownload() {
    const canvas = renderYearReviewCanvas(review, t('appName', { ns: 'yearreview' }), stats)
    downloadCanvasAsPng(canvas, `nuestra-historia-${year}.png`)
  }

  const formattedDays = review.daysTogether != null ? new Intl.NumberFormat(i18n.resolvedLanguage).format(review.daysTogether) : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="[font-family:var(--font-display)] text-3xl">{t('title')}</h1>
        <Select
          label={t('yearSelect')}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-auto"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
      </div>

      <Card className="bg-[var(--color-hero)] text-[var(--color-hero-ink)]">
        {formattedDays != null ? (
          <>
            <p className="[font-family:var(--font-display)] text-6xl tabular-nums">{formattedDays}</p>
            <p className="mt-1 text-lg">{t('daysTogether')}</p>
          </>
        ) : (
          <p className="text-lg">{t('noDaysYet')}</p>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="text-center">
            <p className="[font-family:var(--font-display)] text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{s.label}</p>
          </Card>
        ))}
      </div>

      {review.topTag && (
        <p className="text-center text-sm text-[var(--color-muted)]">
          {t('topTag', { tag: t(`tag.${review.topTag}`, { ns: 'memories' }) })}
        </p>
      )}

      <Button onClick={onDownload} className="self-center">
        {t('action.download')}
      </Button>
    </div>
  )
}
