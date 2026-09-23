import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Modal } from '../../ui/Modal'
import { useMomentTemplates, useDeleteTemplate } from './useMomentTemplates'
import { templateToDesign, type MomentTemplate } from './api'
import { useCreateMoment } from '../moments/useMoments'
import { MomentStudio } from '../moments/MomentStudio'
import { MOTIF_EMOJI, type Motif } from '../moments/constants'
import type { MomentDesign } from '../moments/api'
import type { CoupleWithMembers } from '../couple/api'

export function TemplatesPage({ couple }: { couple: CoupleWithMembers }) {
  const { t } = useTranslation('momentTemplates')
  const { data: templates, isLoading } = useMomentTemplates()
  const deleteTemplate = useDeleteTemplate()
  const createMoment = useCreateMoment()

  const [using, setUsing] = useState<{ template: MomentTemplate; design: MomentDesign } | null>(null)

  function onUse(template: MomentTemplate) {
    const base = templateToDesign(template)
    setUsing({
      template,
      design: {
        name: template.title,
        happensOn: null,
        repeat: 'none',
        tagline: template.tagline,
        message: template.message,
        motif: base.motif,
        emoji: base.emoji,
        font: base.font,
        density: base.density,
        speed: base.speed,
        palette: base.palette,
        plan: [],
        photoPath: null,
      },
    })
  }

  async function onSave(design: MomentDesign) {
    await createMoment.mutateAsync({ coupleId: couple.id, ...design })
    setUsing(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="[font-family:var(--font-display)] text-3xl">{t('title')}</h1>
      <p className="text-sm text-[var(--color-muted)]">{t('intro')}</p>

      {!isLoading && templates?.length === 0 && (
        <Card className="text-center">
          <h2 className="[font-family:var(--font-display)] text-xl">{t('empty.title')}</h2>
          <p className="mt-1 text-[var(--color-muted)]">{t('empty.subtitle')}</p>
        </Card>
      )}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {templates?.map((tpl) => {
          const palette = tpl.palette as { bg1?: string; bg2?: string }
          const isMine = tpl.couple_id === couple.id
          return (
            <li key={tpl.id}>
              <Card
                className="border-transparent text-[var(--color-hero-ink)]"
                style={{ background: `linear-gradient(160deg, ${palette.bg1 ?? '#2A2052'}, ${palette.bg2 ?? '#5B3FA8'})` }}
              >
                <span aria-hidden className="text-3xl">
                  {MOTIF_EMOJI[(tpl.motif as Motif) ?? 'destellos'] ?? tpl.emoji}
                </span>
                <h3 className="[font-family:var(--font-display)] text-xl">{tpl.title}</h3>
                {tpl.tagline && <p className="opacity-90">{tpl.tagline}</p>}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <Button variant="ghost" onClick={() => onUse(tpl)}>
                    {t('action.use')}
                  </Button>
                  {isMine && (
                    <button
                      type="button"
                      className="text-sm underline opacity-90 transition-opacity hover:opacity-100"
                      onClick={() => {
                        if (confirm(t('confirm.delete'))) deleteTemplate.mutate(tpl.id)
                      }}
                    >
                      {t('action.unpublish')}
                    </button>
                  )}
                </div>
              </Card>
            </li>
          )
        })}
      </ul>

      {using && (
        <Modal title={t('modal.title')} onClose={() => setUsing(null)} wide>
          <MomentStudio
            coupleId={couple.id}
            initial={using.design}
            onCancel={() => setUsing(null)}
            onSave={onSave}
            saving={createMoment.isPending}
          />
        </Modal>
      )}
    </div>
  )
}
