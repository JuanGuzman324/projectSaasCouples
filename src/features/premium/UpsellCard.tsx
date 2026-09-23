import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

export function UpsellCard({ message }: { message: string }) {
  const { t } = useTranslation('premium')
  return (
    <Card className="flex flex-col items-center gap-3 border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 text-center">
      <span className="text-3xl" aria-hidden>
        ✨
      </span>
      <p className="text-sm">{message}</p>
      <Link to="/premium">
        <Button>{t('upsell.cta')}</Button>
      </Link>
    </Card>
  )
}
