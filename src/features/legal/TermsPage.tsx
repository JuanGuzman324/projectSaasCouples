import { useTranslation } from 'react-i18next'
import { LegalPage } from './LegalPage'

export function TermsPage() {
  const { t } = useTranslation('legal')
  const sectionKeys = [
    'acceptance', 'minAge', 'account', 'content', 'acceptableUse', 'liability', 'termination', 'law', 'changes', 'contact',
  ] as const
  return (
    <LegalPage
      title={t('terms.title')}
      updated={t('terms.updated')}
      intro={t('terms.intro')}
      sections={sectionKeys.map((key) => ({
        title: t(`terms.${key}.title`),
        body: t(`terms.${key}.body`),
      }))}
    />
  )
}
