import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'

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
      <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-4 px-6 py-10 text-center">
        <p>{t('register.checkEmail')}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6 py-10">
      <h1 className="font-[var(--font-display)] text-3xl">{t('register.title')}</h1>
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
        {error && <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p>}
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
  )
}
