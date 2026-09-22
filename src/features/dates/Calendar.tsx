import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../ui/Card'
import { occursOnDay, daysInMonth } from './calendar-utils'

export interface CalendarEntry {
  id: string
  title: string
  happensOn: string
  repeat: 'none' | 'monthly' | 'yearly'
  kind: 'date' | 'memory' | 'moment'
}

const DOT_COLOR: Record<CalendarEntry['kind'], string> = {
  date: 'var(--color-gold)',
  memory: 'var(--color-rose)',
  moment: 'var(--color-sage)',
}

function startWeekday(year: number, month: number): number {
  // Lunes = 0 ... Domingo = 6, para que la grilla empiece igual en todos
  // los idiomas soportados (todos usan semana lunes-domingo).
  return (new Date(year, month, 1).getDay() + 6) % 7
}

export function Calendar({ entries }: { entries: CalendarEntry[] }) {
  const { t, i18n } = useTranslation('dates')
  const today = new Date()
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const total = daysInMonth(year, month)
  const leadingBlanks = startWeekday(year, month)

  const entriesByDay = new Map<number, CalendarEntry[]>()
  for (let d = 1; d <= total; d++) {
    const hits = entries.filter((e) => occursOnDay(e.happensOn, e.repeat, year, month, d))
    if (hits.length > 0) entriesByDay.set(d, hits)
  }

  const monthLabel = new Intl.DateTimeFormat(i18n.resolvedLanguage, { month: 'long', year: 'numeric' }).format(
    cursor
  )
  // Lunes 2024-01-01 como ancla, solo para sacar los 7 nombres cortos.
  const weekdayFmt = new Intl.DateTimeFormat(i18n.resolvedLanguage, { weekday: 'short' })
  const weekdayLabels = Array.from({ length: 7 }, (_, i) => weekdayFmt.format(new Date(2024, 0, 1 + i)))

  function goMonth(delta: number) {
    setCursor(new Date(year, month + delta, 1))
    setSelectedDay(null)
  }

  const selectedEntries = selectedDay != null ? (entriesByDay.get(selectedDay) ?? []) : []

  return (
    <Card>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goMonth(-1)}
          aria-label={t('calendar.prevMonth')}
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition-colors hover:bg-[var(--color-surface-2)]"
        >
          ‹
        </button>
        <h2 className="[font-family:var(--font-display)] text-lg [&::first-letter]:uppercase">{monthLabel}</h2>
        <button
          type="button"
          onClick={() => goMonth(1)}
          aria-label={t('calendar.nextMonth')}
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition-colors hover:bg-[var(--color-surface-2)]"
        >
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[var(--color-muted)]">
        {weekdayLabels.map((w, i) => (
          <span key={i} className="capitalize">
            {w}
          </span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <div key={`b${i}`} />
        ))}
        {Array.from({ length: total }, (_, i) => {
          const d = i + 1
          const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate()
          const isSelected = selectedDay === d
          const hits = entriesByDay.get(d) ?? []
          return (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDay(d === selectedDay ? null : d)}
              className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-sm transition-colors ${
                isSelected
                  ? 'bg-[var(--color-gold)] font-bold text-[var(--color-on-gold)]'
                  : isToday
                    ? 'bg-[var(--color-surface-2)] font-bold'
                    : 'hover:bg-[var(--color-surface-2)]'
              }`}
            >
              {d}
              <span className="flex gap-0.5">
                {hits.slice(0, 3).map((h, j) => (
                  <span
                    key={j}
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: isSelected ? 'var(--color-on-gold)' : DOT_COLOR[h.kind] }}
                  />
                ))}
              </span>
            </button>
          )
        })}
      </div>

      {selectedDay != null && (
        <div className="mt-4 border-t border-[var(--color-line)] pt-3">
          {selectedEntries.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">{t('calendar.empty')}</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {selectedEntries.map((e) => (
                <li key={`${e.kind}-${e.id}`} className="flex items-center gap-2 text-sm">
                  <span aria-hidden className="h-2 w-2 flex-none rounded-full" style={{ background: DOT_COLOR[e.kind] }} />
                  <span>{e.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  )
}
