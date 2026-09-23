import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { Modal } from '../../ui/Modal'
import { Photo } from '../../ui/Photo'
import { useCreateMoment, useDeleteMoment, useMoments, useUpdateMoment } from './useMoments'
import { MomentStudio } from './MomentStudio'
import { MomentView } from './MomentView'
import { momentToDesign, type Moment, type MomentDesign } from './api'
import { nextMomentOccurrence, daysBetween } from './moment-utils'
import { MOTIF_EMOJI, type Motif } from './constants'
import { PublishTemplateModal } from '../momenttemplates/PublishTemplateModal'
import { useMyCouple } from '../couple/useCouple'
import { isPremium, FREE_LIMITS } from '../premium/limits'
import { usePhotoUsage } from '../premium/usePhotoUsage'
import { UpsellCard } from '../premium/UpsellCard'

function Countdown({ moment, t }: { moment: Moment; t: (k: string, o?: Record<string, unknown>) => string }) {
  const next = nextMomentOccurrence(moment.happens_on, moment.repeat, new Date())
  if (!next) return null
  const left = daysBetween(next, new Date())
  const label = left === 0 ? t('countdown.today') : left > 0 ? t('countdown.in', { count: left }) : t('countdown.past', { count: -left })
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-bold"
      style={{
        background: (moment.palette as { accent?: string })?.accent ?? '#F6B800',
        color: (moment.palette as { bg1?: string })?.bg1 ?? '#2A1D00',
      }}
    >
      {label}
    </span>
  )
}

export function MomentsPage({ coupleId }: { coupleId: string }) {
  const { t } = useTranslation(['moments', 'premium'])
  const { data: moments, isLoading } = useMoments()
  const { data: couple } = useMyCouple()
  const createMoment = useCreateMoment()
  const updateMoment = useUpdateMoment()
  const deleteMoment = useDeleteMoment()
  const photoUsage = usePhotoUsage()

  const [editing, setEditing] = useState<{ id: string; design: MomentDesign } | null>(null)
  const [creating, setCreating] = useState(false)
  const [viewing, setViewing] = useState<Moment | null>(null)
  const [publishing, setPublishing] = useState<Moment | null>(null)

  const premium = isPremium(couple)
  const momentsLimitReached = !premium && (moments?.length ?? 0) >= FREE_LIMITS.moments
  const photoLimitReached = !premium && photoUsage >= FREE_LIMITS.photos

  async function handleCreate(design: MomentDesign) {
    await createMoment.mutateAsync({ coupleId, ...design })
    setCreating(false)
  }
  async function handleUpdate(design: MomentDesign) {
    if (!editing) return
    await updateMoment.mutateAsync({ id: editing.id, design })
    setEditing(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="[font-family:var(--font-display)] text-3xl">{t('nav')}</h1>
        <Button onClick={() => setCreating(true)} disabled={momentsLimitReached}>
          {t('action.new')}
        </Button>
      </div>

      {momentsLimitReached && (
        <UpsellCard message={t('limit.moments', { ns: 'premium', count: FREE_LIMITS.moments })} />
      )}

      <p className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-center">
        <Link
          to="/cultural-dates"
          className="text-sm font-semibold text-[var(--color-rose)] underline-offset-4 hover:underline"
        >
          {t('culturalDates.link')}
        </Link>
        <Link
          to="/templates"
          className="text-sm font-semibold text-[var(--color-rose)] underline-offset-4 hover:underline"
        >
          {t('templates.link')}
        </Link>
      </p>

      {!isLoading && moments?.length === 0 && (
        <Card className="text-center">
          <h2 className="[font-family:var(--font-display)] text-xl">{t('empty.title')}</h2>
          <p className="mt-1 text-[var(--color-muted)]">{t('empty.subtitle')}</p>
        </Card>
      )}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {moments?.map((m) => (
          <li key={m.id}>
            <Card
              className="cursor-pointer border-transparent text-[var(--color-hero-ink)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:brightness-110"
              style={{
                background: `linear-gradient(160deg, ${(m.palette as { bg1?: string })?.bg1 ?? '#2A2052'}, ${(m.palette as { bg2?: string })?.bg2 ?? '#5B3FA8'})`,
              }}
              onClick={() => setViewing(m)}
            >
              <span aria-hidden className="text-3xl">
                {MOTIF_EMOJI[(m.motif as Motif) ?? 'destellos'] ?? m.emoji}
              </span>
              <h3 className="[font-family:var(--font-display)] text-xl">{m.name}</h3>
              {m.tagline && <p className="opacity-90">{m.tagline}</p>}
              <Photo path={m.photo_path} alt="" className="mt-2 aspect-square w-full rounded-xl object-cover" />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <Countdown moment={m} t={t} />
                <div className="flex gap-3 text-sm">
                  <button
                    type="button"
                    className="underline opacity-90 transition-opacity hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditing({ id: m.id, design: momentToDesign(m) })
                    }}
                  >
                    {t('action.edit')}
                  </button>
                  <button
                    type="button"
                    className="underline opacity-90 transition-opacity hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPublishing(m)
                    }}
                  >
                    {t('action.share')}
                  </button>
                  <button
                    type="button"
                    className="underline opacity-90 transition-opacity hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(t('confirm.delete'))) deleteMoment.mutate(m.id)
                    }}
                  >
                    {t('action.delete')}
                  </button>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      {creating && (
        <Modal title={t('new.title')} onClose={() => setCreating(false)} wide>
          <MomentStudio
            coupleId={coupleId}
            onCancel={() => setCreating(false)}
            onSave={handleCreate}
            saving={createMoment.isPending}
            photoLimitReached={photoLimitReached}
            photoLimitHint={t('limit.photos', { ns: 'premium', count: FREE_LIMITS.photos })}
          />
        </Modal>
      )}

      {editing && (
        <Modal title={t('edit.title')} onClose={() => setEditing(null)} wide>
          <MomentStudio
            coupleId={coupleId}
            initial={editing.design}
            onCancel={() => setEditing(null)}
            onSave={handleUpdate}
            saving={updateMoment.isPending}
          />
        </Modal>
      )}

      {viewing && <MomentView moment={viewing} onClose={() => setViewing(null)} />}

      {publishing && (
        <PublishTemplateModal coupleId={coupleId} moment={publishing} onClose={() => setPublishing(null)} />
      )}
    </div>
  )
}
