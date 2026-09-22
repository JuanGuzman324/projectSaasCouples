import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { TextField } from '../../ui/TextField'
import { Textarea } from '../../ui/Textarea'
import { Select } from '../../ui/Select'
import { PhotoPicker } from '../../ui/PhotoPicker'
import { Photo } from '../../ui/Photo'
import { useCreateMemory, useDeleteMemory, useMemories, useToggleFavorite } from './useMemories'
import type { MemoryTag } from './api'

const TAGS: MemoryTag[] = ['cita', 'viaje', 'detalle', 'charla', 'logro', 'otro']

export function MemoriesPage({ coupleId }: { coupleId: string }) {
  const { t, i18n } = useTranslation('memories')
  const { data: memories, isLoading } = useMemories()
  const createMemory = useCreateMemory()
  const toggleFavorite = useToggleFavorite()
  const deleteMemory = useDeleteMemory()

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [tag, setTag] = useState<MemoryTag>('cita')
  const [place, setPlace] = useState('')
  const [body, setBody] = useState('')
  const [photoPath, setPhotoPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createMemory.mutateAsync({
        coupleId,
        title,
        happenedOn: date,
        tag,
        place: place || null,
        body: body || null,
        photoPath,
      })
      setTitle('')
      setDate('')
      setTag('cita')
      setPlace('')
      setBody('')
      setPhotoPath(null)
      setShowForm(false)
    } catch {
      setError(t('error.save'))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-[var(--font-display)] text-3xl">{t('nav')}</h1>
        <Button onClick={() => setShowForm((s) => !s)}>{t('action.new')}</Button>
      </div>

      {showForm && (
        <Card>
          <h2 className="mb-4 font-[var(--font-display)] text-xl">{t('new.title')}</h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              label={t('field.title')}
              name="title"
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="sm:col-span-2"
            />
            <TextField
              label={t('field.date')}
              type="date"
              name="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Select label={t('field.tag')} value={tag} onChange={(e) => setTag(e.target.value as MemoryTag)}>
              {TAGS.map((tg) => (
                <option key={tg} value={tg}>
                  {t(`tag.${tg}`)}
                </option>
              ))}
            </Select>
            <TextField
              label={t('field.place')}
              name="place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="sm:col-span-2"
            />
            <Textarea
              label={t('field.body')}
              name="body"
              maxLength={3000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="sm:col-span-2"
            />
            <PhotoPicker
              coupleId={coupleId}
              label={t('field.photo')}
              value={photoPath}
              onChange={setPhotoPath}
            />
            {error && <p className="text-sm font-medium text-[var(--color-danger)] sm:col-span-2">{error}</p>}
            <Button type="submit" disabled={createMemory.isPending} className="sm:col-span-2">
              {t('action.save')}
            </Button>
          </form>
        </Card>
      )}

      {!isLoading && memories?.length === 0 && (
        <Card className="text-center">
          <h2 className="font-[var(--font-display)] text-xl">{t('empty.title')}</h2>
          <p className="mt-1 text-[var(--color-muted)]">{t('empty.subtitle')}</p>
        </Card>
      )}

      <ul className="flex flex-col gap-4">
        {memories?.map((m) => (
          <li key={m.id}>
            <Card>
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <Photo
                    path={m.photo_path}
                    alt=""
                    className="h-16 w-16 flex-none rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-muted)]">
                      {t(`tag.${m.tag}`)}
                    </span>
                    <h3 className="font-[var(--font-display)] text-xl">{m.title}</h3>
                    <p className="text-sm text-[var(--color-muted)]">
                      {new Intl.DateTimeFormat(i18n.resolvedLanguage, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(m.happened_on + 'T00:00:00'))}
                      {m.place ? ` · ${m.place}` : ''}
                    </p>
                    {m.body && <p className="mt-2 whitespace-pre-line">{m.body}</p>}
                  </div>
                </div>
                <div className="flex flex-none gap-1">
                  <button
                    type="button"
                    aria-pressed={m.is_favorite}
                    aria-label={t('action.favorite')}
                    onClick={() => toggleFavorite.mutate({ id: m.id, isFavorite: !m.is_favorite })}
                    className={m.is_favorite ? 'text-[var(--color-gold)]' : 'text-[var(--color-muted)]'}
                  >
                    ★
                  </button>
                  <button
                    type="button"
                    aria-label={t('action.delete')}
                    onClick={() => {
                      if (confirm(t('confirm.delete'))) deleteMemory.mutate(m.id)
                    }}
                    className="text-[var(--color-muted)]"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
