import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Photo } from '../../ui/Photo'
import { nextMilestones, daysUntil } from './milestones'
import { haversineKm, estimateHours, AVG_FLIGHT_KMH, AVG_DRIVE_KMH, type CityPoint } from './distance'
import { pickMemoryId, isOnThisDay, yearsAgo } from './random-memory'
import { useMemories } from '../memories/useMemories'
import type { CoupleWithMembers } from '../couple/api'

function daysTogether(startDate: string): number {
  const start = new Date(startDate + 'T00:00:00')
  const today = new Date()
  const ms = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
    Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  return Math.max(0, Math.round(ms / 86_400_000) + 1)
}

function MilestonesCard({ startDate }: { startDate: string }) {
  const { t, i18n } = useTranslation('home')
  const today = new Date()
  const milestones = nextMilestones(startDate, today)
  if (milestones.length === 0) return null

  return (
    <Card className="mt-6">
      <h2 className="[font-family:var(--font-display)] text-xl">{t('milestones.title')}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {milestones.map((m) => {
          const left = daysUntil(m.date, today)
          const label =
            m.kind === 'day'
              ? t('milestones.day', { count: m.value })
              : t('milestones.anniversary', { count: m.value })
          const formattedDate = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(m.date)
          return (
            <li
              key={`${m.kind}-${m.value}`}
              className="flex items-center justify-between gap-3 rounded-xl bg-[var(--color-surface-2)] px-4 py-3"
            >
              <div>
                <p className="font-semibold">{label}</p>
                <p className="text-sm text-[var(--color-muted)]">{formattedDate}</p>
              </div>
              <span className="whitespace-nowrap rounded-full bg-[var(--color-gold)] px-3 py-1 text-xs font-bold text-[var(--color-on-gold)]">
                {left === 0 ? t('milestones.today') : t('milestones.in', { count: left })}
              </span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function project(p: CityPoint, w: number, h: number): { x: number; y: number } {
  return { x: ((p.lon + 180) / 360) * w, y: ((90 - p.lat) / 180) * h }
}

function MiniMap({ a, b }: { a: CityPoint; b: CityPoint }) {
  const W = 320
  const H = 140
  const pa = project(a, W, H)
  const pb = project(b, W, H)
  const midX = (pa.x + pb.x) / 2
  const midY = Math.min(pa.y, pb.y) - 16
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden>
      <rect x={0} y={0} width={W} height={H} rx={12} fill="var(--color-surface-2)" />
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={(i * W) / 6}
          y1={0}
          x2={(i * W) / 6}
          y2={H}
          stroke="var(--color-line)"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <line
          key={`h${i}`}
          x1={0}
          y1={(i * H) / 3}
          x2={W}
          y2={(i * H) / 3}
          stroke="var(--color-line)"
          strokeWidth={1}
        />
      ))}
      <path
        d={`M ${pa.x} ${pa.y} Q ${midX} ${midY} ${pb.x} ${pb.y}`}
        fill="none"
        stroke="var(--color-rose)"
        strokeWidth={2}
        strokeDasharray="5 4"
      />
      <circle cx={pa.x} cy={pa.y} r={5} fill="var(--color-gold)" />
      <circle cx={pb.x} cy={pb.y} r={5} fill="var(--color-gold)" />
    </svg>
  )
}

function DistanceCard({ couple }: { couple: CoupleWithMembers }) {
  const { t, i18n } = useTranslation('home')
  const withCoords = couple.members.filter(
    (m): m is typeof m & { lat: number; lon: number } => m.lat != null && m.lon != null
  )
  if (withCoords.length < 2) return null
  const [ma, mb] = withCoords

  const km = haversineKm(ma.lat, ma.lon, mb.lat, mb.lon)
  const flightHours = estimateHours(km, AVG_FLIGHT_KMH)
  const driveHours = estimateHours(km, AVG_DRIVE_KMH)

  const formattedKm = new Intl.NumberFormat(i18n.resolvedLanguage, {
    style: 'unit',
    unit: 'kilometer',
    unitDisplay: 'short',
    maximumFractionDigits: 0,
  }).format(km)
  const formattedFlight = new Intl.NumberFormat(i18n.resolvedLanguage, {
    style: 'unit',
    unit: 'hour',
    unitDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(flightHours)
  const formattedDrive = new Intl.NumberFormat(i18n.resolvedLanguage, {
    style: 'unit',
    unit: 'hour',
    unitDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(driveHours)

  return (
    <Card className="mt-6">
      <h2 className="[font-family:var(--font-display)] text-xl">{t('distance.title')}</h2>
      <p className="mt-1 [font-family:var(--font-display)] text-3xl">{formattedKm}</p>
      <div className="mt-3">
        <MiniMap a={ma} b={mb} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[var(--color-muted)]">{t('distance.flight')}</dt>
          <dd className="font-semibold">{formattedFlight}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted)]">{t('distance.drive')}</dt>
          <dd className="font-semibold">{formattedDrive}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-[var(--color-muted)]">{t('distance.hint')}</p>
    </Card>
  )
}

function RandomMemoryCard() {
  const { t, i18n } = useTranslation(['home', 'memories'])
  const { data: memories } = useMemories()
  const [pickedId, setPickedId] = useState<string | null>(null)
  // Elegimos el primero apenas llegan los recuerdos, derivándolo durante el
  // render (no en un efecto) para no disparar un ciclo extra de render.
  const [seenMemories, setSeenMemories] = useState<typeof memories>(undefined)
  if (memories && memories !== seenMemories && pickedId == null) {
    setPickedId(pickMemoryId(memories, new Date(), null))
    setSeenMemories(memories)
  }

  if (!memories || memories.length === 0) return null
  const current = memories.find((m) => m.id === pickedId) ?? memories[0]
  const today = new Date()

  const formattedDate = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(current.happened_on + 'T00:00:00'))

  return (
    <Card className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="[font-family:var(--font-display)] text-xl">{t('randomMemory.title')}</h2>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setPickedId(pickMemoryId(memories, today, current.id))}
        >
          {t('randomMemory.shuffle')}
        </Button>
      </div>
      {isOnThisDay(current.happened_on, today) && (
        <p className="mt-2 inline-block rounded-full bg-[var(--color-gold)] px-3 py-1 text-xs font-bold text-[var(--color-on-gold)]">
          {t('randomMemory.onThisDay', { count: yearsAgo(current.happened_on, today) })}
        </p>
      )}
      <div className="mt-3 flex gap-3">
        <Photo
          path={current.photo_path}
          alt=""
          className="h-20 w-20 flex-none rounded-xl object-cover"
        />
        <div>
          <span className="text-xs font-semibold text-[var(--color-muted)]">
            {t(`tag.${current.tag}`, { ns: 'memories' })}
          </span>
          <h3 className="[font-family:var(--font-display)] text-xl">{current.title}</h3>
          <p className="text-sm text-[var(--color-muted)]">
            {formattedDate}
            {current.place ? ` · ${current.place}` : ''}
          </p>
        </div>
      </div>
      {current.body && <p className="mt-3 whitespace-pre-line">{current.body}</p>}
    </Card>
  )
}

export function Home({ couple }: { couple: CoupleWithMembers }) {
  const { t, i18n } = useTranslation('home')

  if (!couple.start_date) {
    return (
      <>
        <section className="rounded-3xl bg-[var(--color-hero)] p-8 text-[var(--color-hero-ink)]">
          <h1 className="[font-family:var(--font-display)] text-2xl">{t('hero.empty.title')}</h1>
        </section>
        <DistanceCard couple={couple} />
        <RandomMemoryCard />
      </>
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
    <>
      <section className="rounded-3xl bg-[var(--color-hero)] p-8 text-[var(--color-hero-ink)]">
        <p className="[font-family:var(--font-display)] text-6xl tabular-nums">{formattedDays}</p>
        <p className="mt-1 text-lg">
          <Trans i18nKey="hero.daysTogether" ns="home" count={days} values={{ count: days }}>
            days together
          </Trans>
        </p>
        <p className="mt-4 text-[var(--color-hero-muted,#BDB4DE)]">{formattedDate}</p>
      </section>
      <MilestonesCard startDate={couple.start_date} />
      <DistanceCard couple={couple} />
      <RandomMemoryCard />
    </>
  )
}
