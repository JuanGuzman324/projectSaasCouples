import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !key || url.includes('TU-PROYECTO')) {
  // No lanzamos error duro para que la app siga compilando y mostrando la UI
  // sin credenciales reales (útil en desarrollo temprano); pero avisamos
  // fuerte en consola porque sin esto nada de auth/datos va a funcionar.
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en .env.local'
  )
}

export const supabase = createClient<Database>(
  url ?? 'https://placeholder.supabase.co',
  key ?? 'placeholder'
)
