import { useTranslation } from 'react-i18next'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Alert } from '../../ui/Alert'
import { useSetPlan } from '../couple/useCouple'
import { isPremium, FREE_LIMITS } from './limits'
import type { CoupleWithMembers } from '../couple/api'

const FEATURES = ['moments', 'timeCapsules', 'photos'] as const

export function PremiumPage({ couple }: { couple: CoupleWithMembers }) {
  const { t } = useTranslation('premium')
  const setPlan = useSetPlan()
  const premium = isPremium(couple)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="[font-family:var(--font-display)] text-3xl">{t('title')}</h1>

      <Card className={premium ? 'border-[var(--color-gold)]/50' : ''}>
        <p className="text-sm text-[var(--color-muted)]">{t('currentPlan')}</p>
        <p className="[font-family:var(--font-display)] text-2xl">
          {premium ? t('plan.premium') : t('plan.free')}
        </p>
      </Card>

      <ul className="flex flex-col gap-3">
        {FEATURES.map((f) => (
          <li key={f}>
            <Card className="flex items-center justify-between gap-3">
              <span>{t(`feature.${f}`)}</span>
              <span className="text-sm text-[var(--color-muted)]">
                {t('feature.freeLimit', { count: FREE_LIMITS[f] })} → {t('feature.unlimited')}
              </span>
            </Card>
          </li>
        ))}
      </ul>

      <Alert tone="info">{t('billing.hint')}</Alert>

      {!premium ? (
        <Button
          onClick={() => setPlan.mutate({ coupleId: couple.id, plan: 'premium' })}
          disabled={setPlan.isPending}
          className="self-start"
        >
          {t('devToggle.activate')}
        </Button>
      ) : (
        <Button
          variant="ghost"
          onClick={() => setPlan.mutate({ coupleId: couple.id, plan: 'free' })}
          disabled={setPlan.isPending}
          className="self-start"
        >
          {t('devToggle.deactivate')}
        </Button>
      )}
    </div>
  )
}
