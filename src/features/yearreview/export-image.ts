import type { YearReview } from './summary'

// Colores fijos (no variables CSS: canvas no las resuelve) tomados del tema
// hero de index.css, para que la tarjeta exportada se vea como el resto de
// la app aunque el usuario esté en modo claro.
const BG1 = '#2A2052'
const BG2 = '#4A2F7A'
const INK = '#F7F2FF'
const MUTED = '#BDB4DE'
const GOLD = '#F6B800'

const W = 1080
const H = 1350

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

interface StatRow {
  value: string
  label: string
}

export function renderYearReviewCanvas(review: YearReview, appName: string, stats: StatRow[]): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('no-2d-context')

  const gradient = ctx.createLinearGradient(0, 0, W, H)
  gradient.addColorStop(0, BG1)
  gradient.addColorStop(1, BG2)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = GOLD
  ctx.font = '600 34px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(appName, W / 2, 130)

  ctx.fillStyle = INK
  ctx.font = '700 64px Georgia, serif'
  ctx.fillText(`Resumen ${review.year}`, W / 2, 220)

  if (review.daysTogether != null) {
    ctx.fillStyle = INK
    ctx.font = '700 220px Georgia, serif'
    ctx.fillText(String(review.daysTogether), W / 2, 480)
    ctx.fillStyle = MUTED
    ctx.font = '400 36px system-ui, sans-serif'
    ctx.fillText('días juntos', W / 2, 540)
  }

  const cardTop = 620
  const cardGap = 24
  const cardW = (W - 80 - cardGap) / 2
  const cardH = 220
  stats.forEach((s, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 40 + col * (cardW + cardGap)
    const y = cardTop + row * (cardH + cardGap)
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    roundedRect(ctx, x, y, cardW, cardH, 24)
    ctx.fill()

    ctx.fillStyle = GOLD
    ctx.font = '700 90px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText(s.value, x + cardW / 2, y + 120)

    ctx.fillStyle = MUTED
    ctx.font = '400 28px system-ui, sans-serif'
    ctx.fillText(s.label, x + cardW / 2, y + 170)
  })

  ctx.fillStyle = MUTED
  ctx.font = '400 24px system-ui, sans-serif'
  ctx.fillText(appName, W / 2, H - 50)

  return canvas
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
