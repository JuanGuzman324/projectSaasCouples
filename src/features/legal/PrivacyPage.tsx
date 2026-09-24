import { useTranslation } from 'react-i18next'
import { LegalPage } from './LegalPage'

export function PrivacyPage() {
  const { t } = useTranslation('legal')
  const sectionKeys = [
    'dataCollected', 'purpose', 'legalBasis', 'retention', 'dataLocation', 'subprocessors', 'rights', 'deletion', 'security', 'changes', 'contact',
  ] as const
  return (
    <LegalPage
      title={t('privacy.title')}
      updated={t('privacy.updated')}
      intro={t('privacy.intro')}
      sections={sectionKeys.map((key) => ({
        title: t(`privacy.${key}.title`),
        body: t(`privacy.${key}.body`),
      }))}
    />
  )
}
