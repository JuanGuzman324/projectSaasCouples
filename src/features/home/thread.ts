// El "hilo" visual entre las dos ciudades: una curva con un punto que se
// acerca a medida que se acerca el próximo encuentro. Sin un "último
// encuentro" registrado no hay un origen real para medir progreso, así
// que se usa una ventana de referencia (60 días): a 60+ días el punto
// está lejos, a 0 días está justo en la ciudad de destino. Es
// deliberadamente decorativo, no una medición exacta (igual que lo
// describe el backlog).
const PROGRESS_WINDOW_DAYS = 60

export function progressFraction(daysLeft: number): number {
  const clamped = Math.min(Math.max(daysLeft, 0), PROGRESS_WINDOW_DAYS)
  return 1 - clamped / PROGRESS_WINDOW_DAYS
}

export interface Point {
  x: number
  y: number
}

// Punto sobre una curva de Bézier cuadrática (misma curva que dibuja el
// "hilo"), para poder animar el punto de progreso a lo largo de ella.
export function quadraticPoint(p0: Point, p1: Point, p2: Point, t: number): Point {
  const u = 1 - t
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  }
}
