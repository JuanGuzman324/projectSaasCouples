import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGS } from '../lib/i18n'

const LABELS: Record<string, string> = { es: 'ES', en: 'EN', de: 'DE', fr: 'FR' }

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common')
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{t('language.select')}</span>
      <select
        aria-label={t('language.select')}
        value={i18n.resolvedLanguage}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-semibold"
      >
        {SUPPORTED_LANGS.map((l) => (
          <option key={l} value={l}>
            {LABELS[l]}
          </option>
        ))}
      </select>
    </label>
  )
}
