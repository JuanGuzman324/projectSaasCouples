// Edge Function programada (pg_cron, ver migración 00000000000009) que
// corre una vez por semana: purga en firme (DELETE real, no deleted_at)
// todo lo que lleve más de PURGE_AFTER_DAYS con deleted_at no nulo. El
// borrado lógico (deleted_at) sigue existiendo para poder deshacer un
// borrado reciente desde la UI — esto solo se encarga de que "borrado" no
// signifique "oculto para siempre" (BACKLOG P0 legal).
//
// Igual que send-reminders, usa SUPABASE_SERVICE_ROLE_KEY (inyectada
// automáticamente en toda Edge Function) para operar entre parejas sin las
// restricciones de RLS del cliente normal.
import { createClient } from 'npm:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const PURGE_AFTER_DAYS = 30

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// Tablas con borrado lógico (deleted_at) y, para las que tienen fotos en
// el bucket "photos", el nombre de esa columna.
const SOFT_DELETE_TABLES: { table: string; photoColumn?: string }[] = [
  { table: 'memories', photoColumn: 'photo_path' },
  { table: 'moments', photoColumn: 'photo_path' },
  { table: 'couple_dates' },
  { table: 'time_capsules' },
  { table: 'moment_templates' },
]

Deno.serve(async () => {
  const cutoff = new Date(Date.now() - PURGE_AFTER_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const result: Record<string, number> = {}

  for (const { table, photoColumn } of SOFT_DELETE_TABLES) {
    if (photoColumn) {
      const { data: rows } = await supabase
        .from(table)
        .select(`id, ${photoColumn}`)
        .not('deleted_at', 'is', null)
        .lt('deleted_at', cutoff)

      const photoPaths = (rows ?? [])
        .map((r: Record<string, unknown>) => r[photoColumn] as string | null)
        .filter((p): p is string => !!p)
      if (photoPaths.length > 0) {
        await supabase.storage.from('photos').remove(photoPaths)
      }
    }

    const { error, count } = await supabase
      .from(table)
      .delete({ count: 'exact' })
      .not('deleted_at', 'is', null)
      .lt('deleted_at', cutoff)

    result[table] = error ? -1 : (count ?? 0)
  }

  return Response.json({ purged: result, cutoff })
})
