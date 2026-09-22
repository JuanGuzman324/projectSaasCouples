import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { Alert } from '../../ui/Alert'

export function Login() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(t('login.error.invalid'))
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="auth-bg flex min-h-dvh flex-col justify-center px-6 py-10">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <h1 className="[font-family:var(--font-display)] text-3xl">{t('login.title')}</h1>
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Alert>{error}</Alert>}
          <Button type="submit" disabled={loading}>
            {t('login.submit')}
          </Button>
        </form>
        <p className="text-sm text-[var(--color-muted)]">
          {t('login.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-[var(--color-ink)] underline">
            {t('login.createAccount')}
          </Link>
        </p>
      </div>
    </div>
  )
}
