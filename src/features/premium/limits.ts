import type { CoupleWithMembers } from '../couple/api'

// Qué queda detrás del muro mientras no hay pagos reales conectados
// (BACKLOG P3 "Plan Premium"). Deliberadamente pocos límites y generosos:
// el objetivo es que se note la diferencia sin arruinar el uso normal de
// una pareja real en el plan gratuito.
export const FREE_LIMITS = {
  moments: 3,
  timeCapsules: 3,
  photos: 20,
} as const

export function isPremium(couple: Pick<CoupleWithMembers, 'plan'> | null | undefined): boolean {
  return couple?.plan === 'premium'
}
