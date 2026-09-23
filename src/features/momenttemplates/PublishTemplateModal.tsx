import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { Textarea } from '../../ui/Textarea'
import { Alert } from '../../ui/Alert'
import { usePublishTemplate } from './useMomentTemplates'
import type { Moment, MomentPalette } from '../moments/api'
import type { Motif, MomentFont } from '../moments/constants'

export function PublishTemplateModal({
  coupleId,
  moment,
  onClose,
}: {
  coupleId: string
  moment: Moment
  onClose: () => void
}) {
  const { t } = useTranslation('momentTemplates')
  const publish = usePublishTemplate()

  const [title, setTitle] = useState(moment.name)
  const [tagline, setTagline] = useState(moment.tagline ?? '')
  const [message, setMessage] = useState(moment.message ?? '')
  const [published, setPublished] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await publish.mutateAsync({
        coupleId,
        title,
        tagline: tagline || null,
        message: message || null,
        motif: (moment.motif as Motif) ?? 'destellos',
        emoji: moment.emoji,
        font: (moment.font as MomentFont) ?? 'serif',
        density: moment.density,
        speed: Number(moment.speed),
        palette: moment.palette as unknown as MomentPalette,
      })
      setPublished(true)
    } catch {
      setError(t('publish.error'))
    }
  }

  return (
    <Modal title={t('publish.title')} onClose={onClose}>
      {published ? (
        <div className="flex flex-col gap-4">
          <Alert tone="success">{t('publish.success')}</Alert>
          <Button onClick={onClose} className="self-start">
            {t('publish.close')}
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-[var(--color-muted)]">{t('publish.hint')}</p>
          <TextField
            label={t('publish.field.title')}
            required
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label={t('publish.field.tagline')}
            maxLength={160}
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
          <Textarea
            label={t('publish.field.message')}
            maxLength={500}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {error && <Alert>{error}</Alert>}
          <Button type="submit" disabled={publish.isPending}>
            {t('publish.action')}
          </Button>
        </form>
      )}
    </Modal>
  )
}
