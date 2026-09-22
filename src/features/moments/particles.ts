// Motor de partículas para las escenas de "Momentos". Es el mismo cálculo
// que el prototipo HTML (canvas 2D + requestAnimationFrame), portado a un
// hook de React. Cada motivo tiene su propia forma (DRAW) y su propio tipo
// de movimiento (MODE): caer, subir, revolotear o titilar.
import { useEffect, useRef } from 'react'
import type { Motif } from './constants'
import type { MomentPalette } from './api'

export interface ParticleSceneConfig {
  motif: Motif
  density: number
  speed: number
  palette: MomentPalette
  emoji: string
}

interface Particle {
  x: number
  y: number
  s: number
  v: number
  f: number
  ph: number
  r: number
  vr: number
  a: number
  t: number
  alt: boolean
}

type Mode = 'fall' | 'rise' | 'flutter' | 'twinkle'
const MODE: Record<Motif, Mode> = {
  flores: 'fall',
  petalos: 'fall',
  corazones: 'rise',
  mariposas: 'flutter',
  estrellas: 'twinkle',
  destellos: 'twinkle',
  emoji: 'fall',
}

type DrawFn = (ctx: CanvasRenderingContext2D, s: number, p: Particle, cfg: ParticleSceneConfig) => void

const DRAW: Record<Motif, DrawFn> = {
  flores(ctx, s, _p, cfg) {
    ctx.fillStyle = cfg.palette.accent
    for (let i = 0; i < 8; i++) {
      ctx.save()
      ctx.rotate((i * Math.PI) / 4)
      ctx.beginPath()
      ctx.ellipse(0, -s * 0.5, s * 0.2, s * 0.34, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    ctx.beginPath()
    ctx.arc(0, 0, s * 0.2, 0, Math.PI * 2)
    ctx.fillStyle = cfg.palette.bg1
    ctx.fill()
  },
  petalos(ctx, s, p, cfg) {
    ctx.fillStyle = p.alt ? cfg.palette.ink : cfg.palette.accent
    ctx.beginPath()
    ctx.moveTo(0, -s * 0.5)
    ctx.quadraticCurveTo(s * 0.5, -s * 0.1, 0, s * 0.5)
    ctx.quadraticCurveTo(-s * 0.5, -s * 0.1, 0, -s * 0.5)
    ctx.fill()
  },
  corazones(ctx, s, p, cfg) {
    ctx.fillStyle = p.alt ? cfg.palette.ink : cfg.palette.accent
    ctx.beginPath()
    ctx.moveTo(0, s * 0.3)
    ctx.bezierCurveTo(-s * 0.6, -s * 0.1, -s * 0.3, -s * 0.6, 0, -s * 0.25)
    ctx.bezierCurveTo(s * 0.3, -s * 0.6, s * 0.6, -s * 0.1, 0, s * 0.3)
    ctx.fill()
  },
  estrellas(ctx, s, p, cfg) {
    ctx.fillStyle = p.alt ? cfg.palette.ink : cfg.palette.accent
    ctx.beginPath()
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? s * 0.22 : s * 0.5
      const a = (i * Math.PI) / 5 - Math.PI / 2
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    ctx.closePath()
    ctx.fill()
  },
  destellos(ctx, s, p, cfg) {
    ctx.fillStyle = p.alt ? cfg.palette.ink : cfg.palette.accent
    ctx.beginPath()
    for (let i = 0; i < 8; i++) {
      const r = i % 2 ? s * 0.12 : s * 0.55
      const a = (i * Math.PI) / 4 - Math.PI / 2
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    ctx.closePath()
    ctx.fill()
  },
  mariposas(ctx, s, p, cfg) {
    const f = 0.35 + 0.65 * Math.abs(Math.sin(p.t * 7 + p.ph))
    ctx.fillStyle = p.alt ? cfg.palette.ink : cfg.palette.accent
    for (const sg of [-1, 1]) {
      ctx.save()
      ctx.scale(sg * f, 1)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(s * 0.7, -s * 0.8, s * 0.95, -s * 0.05, s * 0.1, s * 0.05)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(s * 0.6, s * 0.8, s * 0.55, s * 0.25, s * 0.08, s * 0.08)
      ctx.fill()
      ctx.restore()
    }
    ctx.fillStyle = cfg.palette.bg1
    ctx.fillRect(-s * 0.04, -s * 0.3, s * 0.08, s * 0.6)
  },
  emoji(ctx, s, _p, cfg) {
    ctx.font = `${s * 1.5}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(cfg.emoji || '💛', 0, 0)
  },
}

function makeParticle(w: number, h: number, init: boolean): Particle {
  return {
    x: Math.random() * w,
    y: init ? Math.random() * h : -30,
    s: 10 + Math.random() * 16,
    v: 18 + Math.random() * 34,
    f: 0.6 + Math.random() * 1.4,
    ph: Math.random() * Math.PI * 2,
    r: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 1.6,
    a: 0.55 + Math.random() * 0.45,
    t: Math.random() * 10,
    alt: Math.random() < 0.35,
  }
}

/**
 * Dibuja la escena animada en el canvas indicado. Respeta
 * prefers-reduced-motion (dibuja un solo cuadro estático) y se ajusta al
 * tamaño real del elemento vía ResizeObserver.
 */
export function useParticleScene(canvasRef: React.RefObject<HTMLCanvasElement | null>, config: ParticleSceneConfig) {
  const configRef = useRef(config)
  configRef.current = config

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    let w = 0
    let h = 0
    let particles: Particle[] = []
    let raf = 0
    let last = 0
    let stopped = false

    const size = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const targetCount = () => {
      const area = w * h
      const scale = Math.max(0.35, Math.min(1.4, area / 540_000))
      return Math.max(6, Math.min(170, Math.round(configRef.current.density * scale)))
    }

    const sync = () => {
      const n = targetCount()
      while (particles.length < n) particles.push(makeParticle(w, h, true))
      if (particles.length > n) particles.length = n
    }

    const draw = () => {
      const cfg = configRef.current
      ctx.clearRect(0, 0, w, h)
      const fn = DRAW[cfg.motif] ?? DRAW.destellos
      const mode = MODE[cfg.motif] ?? 'fall'
      for (const p of particles) {
        let alpha = p.a
        if (mode === 'twinkle') alpha = p.a * (0.35 + 0.65 * Math.abs(Math.sin(p.t * 1.6 + p.ph)))
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.r)
        fn(ctx, p.s, p, cfg)
        ctx.restore()
      }
    }

    const step = (dt: number) => {
      const cfg = configRef.current
      const sp = cfg.speed
      const mode = MODE[cfg.motif] ?? 'fall'
      for (const p of particles) {
        p.t += dt
        if (mode === 'fall') {
          p.y += p.v * sp * dt
          p.x += Math.sin(p.t * p.f + p.ph) * 22 * dt
          p.r += p.vr * dt
          if (p.y > h + 30) {
            p.y = -30
            p.x = Math.random() * w
          }
        } else if (mode === 'rise') {
          p.y -= p.v * sp * dt * 0.8
          p.x += Math.sin(p.t * p.f + p.ph) * 18 * dt
          p.r = Math.sin(p.t + p.ph) * 0.3
          if (p.y < -30) {
            p.y = h + 30
            p.x = Math.random() * w
          }
        } else if (mode === 'flutter') {
          p.y -= p.v * sp * dt * 0.5
          p.x += (Math.sin(p.t * p.f + p.ph) * 40 + 14) * dt * sp * 0.6
          p.r = Math.sin(p.t * p.f + p.ph) * 0.4
          if (p.y < -30) {
            p.y = h + 30
            p.x = Math.random() * w
          }
          if (p.x > w + 40) p.x = -30
        } else {
          p.y += p.v * 0.04 * dt
          p.r += p.vr * dt * 0.3
          if (p.y > h + 20) p.y = -20
        }
      }
    }

    const frame = (ts: number) => {
      if (stopped || !canvas.isConnected) return
      const dt = Math.min(0.05, (ts - last) / 1000 || 0.016)
      last = ts
      if (w > 0 && h > 0) {
        sync()
        step(dt)
        draw()
      }
      raf = requestAnimationFrame(frame)
    }

    size()
    const ro = new ResizeObserver(() => {
      size()
      if (reduce) {
        sync()
        draw()
      }
    })
    ro.observe(canvas)

    if (reduce) {
      sync()
      draw()
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
    // El efecto se monta una vez por canvas; los cambios de config se leen
    // en vivo desde configRef, así no hay que reiniciar la animación cada
    // vez que el usuario mueve un control del estudio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef])
}
