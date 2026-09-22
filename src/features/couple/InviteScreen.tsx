import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../ui/Button'
import { ThemeToggle } from '../../ui/ThemeToggle'
import type { CoupleWithMembers } from './api'

export function InviteScreen({ couple }: { couple: CoupleWithMembers }) {
  const { t } = useTranslation('couple')
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(couple.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="auth-bg relative flex min-h-dvh flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6">
        <h1 className="[font-family:var(--font-display)] text-3xl">{t('invite.title')}</h1>
        <p className="text-[var(--color-muted)]">{t('invite.explain')}</p>
        <p className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-8 py-5 font-mono text-4xl tracking-[0.2em] text-[var(--color-ink)] shadow-sm">
          {couple.invite_code}
        </p>
        <Button onClick={copy} variant="ghost" className={copied ? 'border-[var(--color-sage)] text-[var(--color-sage)]' : ''}>
          {copied ? t('action.copied', { ns: 'common' }) : t('action.copy', { ns: 'common' })}
        </Button>
        <p className="text-sm text-[var(--color-muted)]">{t('invite.waiting')}</p>
      </div>
    </div>
  )
}
