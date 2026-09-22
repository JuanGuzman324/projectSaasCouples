import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateCouple, useJoinCouple } from './useCouple'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'

// Los códigos P0001/P0002 son los que definimos a mano en las funciones SQL
// (create_couple/join_couple). Cualquier otro código lo tratamos como error
// genérico en vez de intentar adivinar un mensaje específico.
function errorMessage(err: unknown, t: (k: string) => string): string {
  const code = (err as { code?: string } | null)?.code
  if (code === 'P0001') return t('onboarding.error.full')
  if (code === 'P0002') return t('onboarding.error.invalidCode')
  return t('onboarding.error.invalidCode')
}

export function Onboarding() {
  const { t, i18n } = useTranslation('couple')
  const createCouple = useCreateCouple()
  const joinCouple = useJoinCouple()

  const [startDate, setStartDate] = useState('')
  const [code, setCode] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)
  const [joinError, setJoinError] = useState<string | null>(null)

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    setCreateError(null)
    try {
      await createCouple.mutateAsync({
        startDate: startDate || null,
        locale: i18n.resolvedLanguage ?? 'es',
      })
    } catch (err) {
      setCreateError(errorMessage(err, t))
    }
  }

  async function onJoin(e: FormEvent) {
    e.preventDefault()
    setJoinError(null)
    try {
      await joinCouple.mutateAsync(code)
    } catch (err) {
      setJoinError(errorMessage(err, t))
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-8 px-6 py-10">
      <div>
        <h1 className="[font-family:var(--font-display)] text-3xl">{t('onboarding.title')}</h1>
        <p className="mt-2 text-[var(--color-muted)]">{t('onboarding.subtitle')}</p>
      </div>

      <form
        onSubmit={onCreate}
        className="flex flex-col gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5"
      >
        <h2 className="[font-family:var(--font-display)] text-xl">{t('onboarding.create.title')}</h2>
        <TextField
          label={t('onboarding.create.startDate')}
          type="date"
          name="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        {createError && (
          <p className="text-sm font-medium text-[var(--color-danger)]">{createError}</p>
        )}
        <Button type="submit" disabled={createCouple.isPending}>
          {t('onboarding.create.submit')}
        </Button>
      </form>

      <form
        onSubmit={onJoin}
        className="flex flex-col gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5"
      >
        <h2 className="[font-family:var(--font-display)] text-xl">{t('onboarding.join.title')}</h2>
        <TextField
          label={t('onboarding.join.code')}
          name="code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="uppercase tracking-widest"
        />
        {joinError && <p className="text-sm font-medium text-[var(--color-danger)]">{joinError}</p>}
        <Button type="submit" variant="ghost" disabled={joinCouple.isPending}>
          {t('onboarding.join.submit')}
        </Button>
      </form>
    </div>
  )
}
