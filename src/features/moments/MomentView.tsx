import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import confetti from 'canvas-confetti'
import { Scene } from './Scene'
import { usePhotoUrl } from '../storage/usePhotoUrl'
import { useTogglePlanItem } from './useMoments'
import { momentToDesign, type Moment } from './api'
import { nextMomentOccurrence, daysBetween } from './moment-utils'
import { Button } from '../../ui/Button'

export function MomentView({ moment, onClose }: { moment: Moment; onClose: () => void }) {
  const { t } = useTranslation('moments')
  const design = momentToDesign(moment)
  const { data: photoUrl } = usePhotoUrl(design.photoPath)
  const togglePlan = useTogglePlanItem()
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)
  const [firedAuto, setFiredAuto] = useState(false)

  const today = new Date()
  const next = nextMomentOccurrence(design.happensOn, design.repeat, today)
  const left = next ? daysBetween(next, today) : null

  function countdownLabel(): string | null {
    if (left === null) return null
    if (left === 0) return t('countdown.today')
    if (left > 0) return t('countdown.in', { count: left })
    return t('countdown.past', { count: -left })
  }

  function fireConfetti() {
    const canvas = confettiCanvasRef.current
    if (!canvas || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const fire = confetti.create(canvas, { resize: true, useWorker: false })
    const colors = [design.palette.accent, design.palette.ink, design.palette.bg2]
    fire({ particleCount: 110, spread: 85, origin: { y: 0.65 }, colors })
    setTimeout(() => fire({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors }), 250)
    setTimeout(() => fire({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors }), 400)
  }

  useEffect(() => {
    if (left === 0 && !firedAuto) {
      setFiredAuto(true)
      const timer = setTimeout(fireConfetti, 500)
      return () => clearTimeout(timer)
    }
    // Se dispara una sola vez por apertura de la escena, no en cada
    // recálculo de `left`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, firedAuto])

  function toggleItem(index: number) {
    const plan = design.plan.map((p, i) => (i === index ? { ...p, done: !p.done } : p))
    togglePlan.mutate({ id: moment.id, plan })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
      <div className="mx-auto max-w-2xl">
        <Scene
          data={{
            ...design,
            photoUrl,
            countdownLabel: countdownLabel(),
          }}
        >
          {design.plan.length > 0 && (
            <ul className="mt-2 flex w-full max-w-[36ch] flex-col gap-2 text-left">
              {design.plan.map((item, i) => (
                <li key={i}>
                  <label className="flex cursor-pointer items-center gap-2 text-base font-medium">
                    <input type="checkbox" checked={item.done} onChange={() => toggleItem(i)} />
                    <span className={item.done ? 'opacity-60 line-through' : ''}>{item.t}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button type="button" variant="ghost" className="whitespace-nowrap" onClick={fireConfetti}>
              {t('scene.confetti')}
            </Button>
            <Button type="button" variant="ghost" className="whitespace-nowrap" onClick={onClose}>
              {t('action.close')}
            </Button>
          </div>
        </Scene>
        <canvas ref={confettiCanvasRef} className="pointer-events-none fixed inset-0 z-[60] h-full w-full" />
      </div>
    </div>
  )
}
