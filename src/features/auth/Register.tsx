import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { Alert } from '../../ui/Alert'
import { Card } from '../../ui/Card'
import { ThemeToggle } from '../../ui/ThemeToggle'
import { isTurnstileConfigured, Turnstile } from '../../ui/Turnstile'

export function Register() {
  const { t, i18n } = useTranslation('auth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptedLegal, setAcceptedLegal] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Guardamos el idioma con el que se registró: útil para que los
        // correos transaccionales (fase 2) y el locale por defecto de la
        // pareja arranquen en el idioma correcto.
        data: { locale: i18n.resolvedLanguage },
        captchaToken: captchaToken ?? undefined,
      },
    })
    setLoading(false)
    if (error) {
      setError(t('register.error.generic'))
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="auth-bg relative flex min-h-dvh flex-col items-center justify-center px-6 py-10 text-center">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <Card className="max-w-sm">
          <p>{t('register.checkEmail')}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="auth-bg relative flex min-h-dvh flex-col justify-center px-6 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <h1 className="[font-family:var(--font-display)] text-3xl">{t('register.title')}</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField
            label={t('login.email')}
            type="email"
            name="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label={t('login.password')}
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="flex items-start gap-2 text-sm text-[var(--color-muted)]">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-ink)]"
              checked={acceptedLegal}
              onChange={(e) => setAcceptedLegal(e.target.checked)}
              required
            />
            <span>
              {t('register.acceptLegal.prefix')}{' '}
              <Link to="/legal/privacy" target="_blank" className="font-semibold text-[var(--color-ink)] underline">
                {t('register.acceptLegal.privacy')}
              </Link>{' '}
              {t('register.acceptLegal.and')}{' '}
              <Link to="/legal/terms" target="_blank" className="font-semibold text-[var(--color-ink)] underline">
                {t('register.acceptLegal.terms')}
              </Link>
            </span>
          </label>
          <Turnstile onVerify={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />
          {error && <Alert>{error}</Alert>}
          <Button type="submit" disabled={loading || !acceptedLegal || (isTurnstileConfigured && !captchaToken)}>
            {t('register.submit')}
          </Button>
        </form>
        <p className="text-sm text-[var(--color-muted)]">
          {t('register.hasAccount')}{' '}
          <Link to="/login" className="font-semibold text-[var(--color-ink)] underline">
            {t('register.goLogin')}
          </Link>
        </p>
      </div>
    </div>
  )
}
