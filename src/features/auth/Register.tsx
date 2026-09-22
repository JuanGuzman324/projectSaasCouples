import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { Alert } from '../../ui/Alert'
import { Card } from '../../ui/Card'

export function Register() {
  const { t, i18n } = useTranslation('auth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      <div className="auth-bg flex min-h-dvh flex-col items-center justify-center px-6 py-10 text-center">
        <Card className="max-w-sm">
          <p>{t('register.checkEmail')}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="auth-bg flex min-h-dvh flex-col justify-center px-6 py-10">
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
          {error && <Alert>{error}</Alert>}
          <Button type="submit" disabled={loading}>
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
