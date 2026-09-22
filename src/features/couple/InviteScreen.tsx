import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../ui/Button'
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
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <h1 className="font-[var(--font-display)] text-3xl">{t('invite.title')}</h1>
      <p className="text-[var(--color-muted)]">{t('invite.explain')}</p>
      <p className="rounded-2xl bg-[var(--color-surface-2)] px-8 py-5 font-[var(--font-display)] text-4xl tracking-[0.2em]">
        {couple.invite_code}
      </p>
      <Button onClick={copy} variant="ghost">
        {copied ? t('action.copied', { ns: 'common' }) : t('action.copy', { ns: 'common' })}
      </Button>
      <p className="text-sm text-[var(--color-muted)]">{t('invite.waiting')}</p>
    </div>
  )
}
