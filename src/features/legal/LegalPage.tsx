import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card } from '../../ui/Card'
import { ThemeToggle } from '../../ui/ThemeToggle'
import { LanguageSwitcher } from '../../ui/LanguageSwitcher'

// Ambas páginas legales (Privacidad y Términos) comparten el mismo layout:
// una lista de secciones {title, body} traducidas, donde body puede tener
// varios párrafos separados por '\n\n'. Página pública: no requiere sesión
// (ver App.tsx, rutas fuera de RequireAuth) porque hay que poder leerla
// antes de registrarse.
type Section = { title: string; body: string }

export function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: string; sections: Section[] }) {
  const { t } = useTranslation('common')
  return (
    <div className="min-h-dvh px-6 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="[font-family:var(--font-display)] text-xl">
            {t('app.name')}
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
        <Card className="flex flex-col gap-6">
          <div>
            <h1 className="[font-family:var(--font-display)] text-2xl">{title}</h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{updated}</p>
          </div>
          <p className="whitespace-pre-line text-sm text-[var(--color-muted)]">{intro}</p>
          {sections.map((s) => (
            <div key={s.title} className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
