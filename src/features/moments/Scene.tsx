import { useRef } from 'react'
import { useParticleScene } from './particles'
import { FONT_STACK, type Motif, type MomentFont } from './constants'
import type { MomentPalette } from './api'

export interface SceneData {
  motif: Motif
  density: number
  speed: number
  palette: MomentPalette
  emoji: string
  font: MomentFont
  name: string
  tagline: string | null
  message: string | null
  photoUrl?: string | null
  countdownLabel?: string | null
}

// Escena visual compartida: fondo con degradado, partículas animadas de
// fondo y el texto encima. El tamaño de letra se adapta con `compact` para
// la vista previa pequeña del estudio frente a la escena a pantalla
// completa.
export function Scene({ data, compact = false, children }: { data: SceneData; compact?: boolean; children?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useParticleScene(canvasRef, {
    motif: data.motif,
    density: data.density,
    speed: data.speed,
    palette: data.palette,
    emoji: data.emoji,
  })

  return (
    <div
      className="relative isolate flex flex-col items-center justify-center overflow-hidden text-center"
      style={{
        background: `linear-gradient(160deg, ${data.palette.bg1}, ${data.palette.bg2})`,
        color: data.palette.ink,
        minHeight: compact ? 220 : 420,
        borderRadius: compact ? 18 : 28,
        padding: compact ? '20px 16px' : '48px 24px',
        fontFamily: FONT_STACK[data.font],
      }}
    >
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <p className={`font-semibold opacity-85 ${compact ? 'text-xs' : 'text-sm'}`}>{data.name}</p>
        <h2
          className="max-w-[18ch] font-[var(--font-display)] leading-tight text-balance"
          style={{ fontSize: compact ? 22 : 'clamp(30px, 6vw, 56px)', fontFamily: FONT_STACK[data.font] }}
        >
          {data.tagline || data.name}
        </h2>
        {data.photoUrl && !compact && (
          <img
            src={data.photoUrl}
            alt=""
            className="aspect-square w-full max-w-[280px] rounded-3xl border-4 object-cover"
            style={{ borderColor: data.palette.accent }}
          />
        )}
        {data.message && !compact && (
          <p className="max-w-[46ch] whitespace-pre-line text-lg opacity-95">{data.message}</p>
        )}
        {data.countdownLabel && (
          <span
            className="rounded-full px-4 py-1.5 text-sm font-bold"
            style={{ background: data.palette.accent, color: data.palette.bg1 }}
          >
            {data.countdownLabel}
          </span>
        )}
        {children}
      </div>
    </div>
  )
}
