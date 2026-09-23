import { useTranslation } from 'react-i18next'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Alert } from '../../ui/Alert'
import { usePush } from './usePush'

export function PushToggle({ coupleId, userId }: { coupleId: string; userId: string | undefined }) {
  const { t } = useTranslation('push')
  const { supported, subscribed, checking, busy, error, enable, disable } = usePush(coupleId, userId)

  if (!supported) return null

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="[font-family:var(--font-display)] text-xl">{t('title')}</h2>
      <p className="text-sm text-[var(--color-muted)]">{t('hint')}</p>
      {error === 'permission-denied' && <Alert>{t('error.permissionDenied')}</Alert>}
      {error && error !== 'permission-denied' && <Alert>{t('error.generic')}</Alert>}
      {!checking && (
        <Button
          variant={subscribed ? 'ghost' : 'primary'}
          onClick={subscribed ? disable : enable}
          disabled={busy}
          className="self-start"
        >
          {subscribed ? t('action.disable') : t('action.enable')}
        </Button>
      )}
    </Card>
  )
}
