// Distancia entre las ciudades de los dos miembros (fórmula haversine,
// misma que traía el prototipo HTML) y una estimación gruesa de cuánto
// tardarían en verse. Son promedios de referencia, no un itinerario real:
// no hay forma de saber la ruta exacta sin un proveedor de mapas.
const EARTH_RADIUS_KM = 6371
export const AVG_FLIGHT_KMH = 800
export const AVG_DRIVE_KMH = 90

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

export function estimateHours(km: number, kmh: number): number {
  return km / kmh
}

export interface CityPoint {
  lat: number
  lon: number
}
