import { useTranslation } from 'react-i18next'
import { useMutationState } from '@tanstack/react-query'
import { useOnlineStatus } from '../lib/useOnlineStatus'
import { Alert } from './Alert'

export function OfflineBanner() {
  const { t } = useTranslation('common')
  const isOnline = useOnlineStatus()
  const pendingCount = useMutationState({
    filters: { status: 'pending' },
    select: (mutation) => mutation.state,
  }).filter((state) => state.isPaused).length

  if (isOnline && pendingCount === 0) return null

  return (
    <Alert tone="info" className="mx-6 mb-2 sm:mx-0">
      {isOnline
        ? t('offline.syncing', { count: pendingCount })
        : pendingCount > 0
          ? t('offline.offlinePending', { count: pendingCount })
          : t('offline.offline')}
    </Alert>
  )
}
