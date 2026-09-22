// Compresión de imágenes en el navegador antes de subirlas: reduce tamaño
// y las convierte a WebP, igual que el prototipo HTML original (que hacía
// esto mismo con canvas + toDataURL). Aquí usamos toBlob para no pasar por
// base64, que es ~33% más pesado en memoria y en la subida.

export interface CompressOptions {
  maxDimension?: number // lado más largo, en píxeles
  quality?: number // 0 a 1
}

export const MAX_SOURCE_BYTES = 15 * 1024 * 1024 // 15 MB, antes de comprimir

export class ImageTooLargeError extends Error {}
export class ImageDecodeError extends Error {}

export async function compressImageToWebP(
  file: File,
  { maxDimension = 1600, quality = 0.82 }: CompressOptions = {}
): Promise<Blob> {
  if (file.size > MAX_SOURCE_BYTES) {
    throw new ImageTooLargeError(`El archivo pesa más de ${MAX_SOURCE_BYTES / 1024 / 1024} MB`)
  }

  const bitmap = await loadBitmap(file)
  try {
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new ImageDecodeError('No se pudo preparar el lienzo de compresión')
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    )
    // Si el navegador no sabe codificar WebP (algunos Safari viejos),
    // probamos JPEG como red de seguridad antes de rendirnos.
    if (blob) return blob
    const fallback = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    )
    if (!fallback) throw new ImageDecodeError('El navegador no pudo generar la imagen')
    return fallback
  } finally {
    bitmap.close?.()
  }
}

async function loadBitmap(file: File): Promise<ImageBitmap & { close?: () => void }> {
  try {
    // Camino rápido y con menos uso de memoria en navegadores que lo
    // soportan (todos los relevantes salvo Safari muy viejo).
    return await createImageBitmap(file)
  } catch {
    // Alternativa universal vía <img>, por si createImageBitmap falla con
    // el formato de origen (p. ej. HEIC en algunos navegadores).
    const url = URL.createObjectURL(file)
    try {
      const img = new Image()
      img.decoding = 'async'
      const loaded = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new ImageDecodeError('No se pudo leer esa imagen'))
      })
      img.src = url
      await loaded
      return img as unknown as ImageBitmap & { close?: () => void }
    } finally {
      URL.revokeObjectURL(url)
    }
  }
}
