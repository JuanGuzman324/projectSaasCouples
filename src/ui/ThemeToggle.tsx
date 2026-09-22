import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { applyTheme, getStoredTheme, storeTheme, type ThemePreference } from '../lib/theme'

const ORDER: ThemePreference[] = ['system', 'light', 'dark']
const ICON: Record<ThemePreference, string> = { system: '🌓', light: '☀️', dark: '🌙' }

export function ThemeToggle() {
  const { t } = useTranslation('common')
  const [pref, setPref] = useState<ThemePreference>(() => getStoredTheme())

  useEffect(() => {
    applyTheme(pref)
  }, [pref])

  function cycle() {
    const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length]
    setPref(next)
    storeTheme(next)
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={t(`theme.${pref}`)}
      title={t(`theme.${pref}`)}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] text-base transition-colors duration-150 hover:border-[var(--color-muted)] hover:bg-[var(--color-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
    >
      <span aria-hidden>{ICON[pref]}</span>
    </button>
  )
}
