import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { compressImageToWebP, ImageTooLargeError, ImageDecodeError } from '../lib/image'
import { buildPhotoPath, deletePhoto, uploadPhoto } from '../features/storage/api'
import { usePhotoUrl } from '../features/storage/usePhotoUrl'
import { Button } from './Button'

interface Props {
  coupleId: string
  label: string
  /** Ruta guardada en la fila (memories.photo_path / moments.photo_path). */
  value: string | null
  onChange: (path: string | null) => void
  /** Límite del plan gratuito alcanzado: bloquea subir una foto NUEVA, pero
   * sigue dejando quitar o reemplazar la que ya hubiera (no suma al total). */
  limitReached?: boolean
  limitReachedHint?: string
}

// Sube directo al elegir el archivo (no espera al "Guardar" del formulario
// que lo contiene), así el usuario ve antes si algo salió mal con la foto
// en concreto, en vez de descubrirlo al guardar todo el resto del formulario.
export function PhotoPicker({ coupleId, label, value, onChange, limitReached = false, limitReachedHint }: Props) {
  const { t } = useTranslation('common')
  const { data: previewUrl } = usePhotoUrl(value)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const blockNewUpload = limitReached && !value

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // permite reelegir el mismo archivo después
    if (!file || blockNewUpload) return
    setError(null)
    setBusy(true)
    try {
      const blob = await compressImageToWebP(file)
      const ext = blob.type === 'image/jpeg' ? 'jpg' : 'webp'
      const path = buildPhotoPath(coupleId, ext)
      await uploadPhoto(path, blob)
      const previous = value
      onChange(path)
      // Se borra la foto anterior DESPUÉS de que la nueva ya está arriba,
      // para no quedarnos sin ninguna si el borrado fallara a mitad camino.
      if (previous) {
        try {
          await deletePhoto(previous)
        } catch {
          // No es crítico: como mucho queda un archivo huérfano en el
          // bucket, y eso no afecta lo que ve el usuario.
        }
      }
    } catch (err) {
      if (err instanceof ImageTooLargeError) setError(t('photo.error.tooLarge'))
      else if (err instanceof ImageDecodeError) setError(t('photo.error.decode'))
      else setError(t('photo.error.upload'))
    } finally {
      setBusy(false)
    }
  }

  async function onRemove() {
    if (!value) return
    const previous = value
    onChange(null)
    try {
      await deletePhoto(previous)
    } catch {
      // Igual que arriba: un archivo huérfano no es grave.
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:col-span-2">
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex items-center gap-3">
        {previewUrl ? (
          <img src={previewUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-surface-2)] text-xs text-[var(--color-muted)]">
            {t('photo.none')}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          className="sr-only"
          id="photo-picker-input"
        />
        <Button
          type="button"
          variant="ghost"
          disabled={busy || blockNewUpload}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? t('photo.uploading') : t('photo.choose')}
        </Button>
        {value && (
          <Button type="button" variant="ghost" disabled={busy} onClick={onRemove}>
            {t('photo.remove')}
          </Button>
        )}
      </div>
      {error && <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p>}
      {blockNewUpload && limitReachedHint && (
        <p className="text-sm text-[var(--color-muted)]">{limitReachedHint}</p>
      )}
    </div>
  )
}
