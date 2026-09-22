import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { Textarea } from '../../ui/Textarea'
import { Select } from '../../ui/Select'
import { PhotoPicker } from '../../ui/PhotoPicker'
import { Scene } from './Scene'
import { MOTIFS, FONTS, TEMPLATES, TEMPLATE_ORDER, MOTIF_EMOJI, type PlanItem } from './constants'
import type { MomentDesign } from './api'

const BLANK: MomentDesign = {
  name: '',
  happensOn: null,
  repeat: 'none',
  tagline: null,
  message: null,
  motif: 'destellos',
  emoji: '💛',
  font: 'serif',
  density: 30,
  speed: 2,
  palette: { bg1: '#2A2052', bg2: '#5B3FA8', ink: '#F7F2FF', accent: '#F6B800' },
  plan: [],
  photoPath: null,
}

interface Props {
  coupleId: string
  initial?: MomentDesign
  onCancel: () => void
  onSave: (design: MomentDesign) => Promise<void>
  saving: boolean
}

export function MomentStudio({ coupleId, initial, onCancel, onSave, saving }: Props) {
  const { t } = useTranslation('moments')
  const [design, setDesign] = useState<MomentDesign>(initial ?? BLANK)
  const [planText, setPlanText] = useState('')
  const [error, setError] = useState<string | null>(null)

  function patch<K extends keyof MomentDesign>(key: K, value: MomentDesign[K]) {
    setDesign((d) => ({ ...d, [key]: value }))
  }
  function patchPalette(key: keyof MomentDesign['palette'], value: string) {
    setDesign((d) => ({ ...d, palette: { ...d.palette, [key]: value } }))
  }
  function applyTemplate(key: string) {
    const tpl = TEMPLATES[key]
    if (!tpl) return
    setDesign((d) => ({
      ...tpl,
      photoPath: d.photoPath,
      happensOn: d.happensOn,
      plan: tpl.plan.map((p) => ({ ...p })),
    }))
  }
  function addPlanItem() {
    const text = planText.trim()
    if (!text) return
    setDesign((d) => ({ ...d, plan: [...d.plan, { t: text, done: false } as PlanItem] }))
    setPlanText('')
  }
  function removePlanItem(index: number) {
    setDesign((d) => ({ ...d, plan: d.plan.filter((_, i) => i !== index) }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!design.name.trim()) return
    setError(null)
    try {
      await onSave(design)
    } catch {
      setError(t('error.save'))
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--color-muted)]">{t('templates.title')}</h3>
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => applyTemplate(key)}
                className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-semibold"
              >
                {MOTIF_EMOJI[TEMPLATES[key].motif]} {t(`template.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label={t('field.name')}
            required
            maxLength={80}
            value={design.name}
            onChange={(e) => patch('name', e.target.value)}
            className="sm:col-span-2"
          />
          <TextField
            label={t('field.date')}
            type="date"
            value={design.happensOn ?? ''}
            onChange={(e) => patch('happensOn', e.target.value || null)}
          />
          <Select
            label={t('field.repeat')}
            value={design.repeat}
            onChange={(e) => patch('repeat', e.target.value as MomentDesign['repeat'])}
          >
            <option value="none">{t('repeat.none')}</option>
            <option value="yearly">{t('repeat.yearly')}</option>
          </Select>
          <TextField
            label={t('field.tagline')}
            maxLength={140}
            value={design.tagline ?? ''}
            onChange={(e) => patch('tagline', e.target.value || null)}
            className="sm:col-span-2"
          />
          <Textarea
            label={t('field.message')}
            maxLength={1000}
            value={design.message ?? ''}
            onChange={(e) => patch('message', e.target.value || null)}
            className="sm:col-span-2"
          />
        </div>

        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label={t('field.motif')} value={design.motif} onChange={(e) => patch('motif', e.target.value as MomentDesign['motif'])}>
              {MOTIFS.map((m) => (
                <option key={m} value={m}>
                  {MOTIF_EMOJI[m]} {t(`motif.${m}`)}
                </option>
              ))}
            </Select>
            {design.motif === 'emoji' && (
              <TextField
                label={t('field.emoji')}
                maxLength={4}
                value={design.emoji}
                onChange={(e) => patch('emoji', e.target.value)}
              />
            )}
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              {t('field.density')}
              <input
                type="range"
                min={8}
                max={120}
                value={design.density}
                onChange={(e) => patch('density', Number(e.target.value))}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              {t('field.speed')}
              <input
                type="range"
                min={1}
                max={5}
                step={0.5}
                value={design.speed}
                onChange={(e) => patch('speed', Number(e.target.value))}
              />
            </label>
          </div>
        </div>

        <div>
          <h3 className="mb-2 [font-family:var(--font-display)] text-lg">{t('field.palette')}</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(['bg1', 'bg2', 'ink', 'accent'] as const).map((key) => (
              <label key={key} className="flex flex-col gap-1.5 text-sm font-semibold">
                {t(`field.${key}`)}
                <input
                  type="color"
                  value={design.palette[key]}
                  onChange={(e) => patchPalette(key, e.target.value)}
                  className="h-11 w-full cursor-pointer rounded-lg border border-[var(--color-line)] p-1 transition-transform hover:scale-[1.03] hover:border-[var(--color-gold)]"
                />
              </label>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {FONTS.map((f) => (
              <label
                key={f}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-line)] px-3 py-1.5 text-sm font-semibold transition-colors has-[:checked]:border-[var(--color-gold)] has-[:checked]:bg-[var(--color-gold)]/10"
              >
                <input
                  type="radio"
                  name="font"
                  value={f}
                  checked={design.font === f}
                  onChange={() => patch('font', f)}
                />
                {t(`font.${f}`)}
              </label>
            ))}
          </div>
        </div>

        <PhotoPicker
          coupleId={coupleId}
          label={t('field.photo')}
          value={design.photoPath}
          onChange={(p) => patch('photoPath', p)}
        />

        <div>
          <h3 className="mb-2 [font-family:var(--font-display)] text-lg">{t('field.plan')}</h3>
          <div className="flex gap-2">
            <input
              value={planText}
              onChange={(e) => setPlanText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addPlanItem()
                }
              }}
              placeholder={t('plan.placeholder')}
              className="min-w-0 flex-1 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2.5 transition-colors focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20"
            />
            <Button type="button" variant="ghost" onClick={addPlanItem}>
              {t('plan.add')}
            </Button>
          </div>
          {design.plan.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1.5">
              {design.plan.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-lg bg-[var(--color-surface-2)] px-3 py-1.5 text-sm transition-colors"
                >
                  <span>{item.t}</span>
                  <button
                    type="button"
                    onClick={() => removePlanItem(i)}
                    aria-label={t('plan.remove')}
                    className="rounded-full px-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
          <Button type="submit" disabled={saving}>
            {t('action.save')}
          </Button>
        </div>
      </div>

      <div className="md:sticky md:top-4 md:self-start">
        <Scene
          compact
          data={{
            motif: design.motif,
            density: design.density,
            speed: design.speed,
            palette: design.palette,
            emoji: design.emoji,
            font: design.font,
            name: design.name || t('field.name'),
            tagline: design.tagline,
            message: null,
          }}
        />
      </div>
    </form>
  )
}
