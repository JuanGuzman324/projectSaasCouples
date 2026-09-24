import { useTranslation } from 'react-i18next'
import { LegalPage } from './LegalPage'

export function StoragePage() {
  const { t } = useTranslation('legal')
  const sectionKeys = ['noCookies', 'session', 'language', 'theme', 'offlineCache', 'future'] as const
  return (
    <LegalPage
      title={t('storage.title')}
      updated={t('storage.updated')}
      intro={t('storage.intro')}
      sections={sectionKeys.map((key) => ({
        title: t(`storage.${key}.title`),
        body: t(`storage.${key}.body`),
      }))}
    />
  )
}
