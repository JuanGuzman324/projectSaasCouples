// Edge Function invocada por el propio usuario desde Ajustes ("Eliminar mi
// cuenta"). Borrar una cuenta de Supabase Auth requiere la API de
// administración (service_role), que nunca está disponible en el cliente
// — de ahí que esto no se pueda hacer con un simple .delete() desde el
// navegador y haga falta esta función.
//
// verify_jwt está desactivado a nivel de plataforma para esta función (ver
// supabase/config.toml, [functions.delete-account]) porque el gateway
// rechaza con 401 —sin headers CORS— el preflight OPTIONS que el navegador
// manda antes del POST real (el preflight nunca lleva Authorization, así
// que verify_jwt lo bloquea antes de que este código llegue a correr). La
// verificación de identidad se hace acá adentro en su lugar: se resuelve
// el usuario con el cliente anon + el header Authorization real que sí
// manda el POST, así que sigue sin poder invocarse sin un JWT válido — la
// función jamás borra "a quien se le pida", solo a quien probó ser, con su
// propio JWT.
import { createClient } from 'npm:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: CORS_HEADERS })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return json({ error: 'missing_authorization' }, 401)
  }

  const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })
  const {
    data: { user },
    error: userError,
  } = await callerClient.auth.getUser()
  if (userError || !user) {
    return json({ error: 'invalid_session' }, 401)
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  // Mismo efecto que leave_couple() para cada pareja a la que pertenezca
  // (normalmente una sola): sale de couple_members y, si era el último
  // miembro, borra la pareja y su contenido en cascada (memories, dates,
  // moments, cápsulas, fotos vía policies/FKs ya existentes).
  const { data: memberships } = await admin
    .from('couple_members')
    .select('couple_id')
    .eq('user_id', user.id)

  for (const { couple_id } of memberships ?? []) {
    await admin.from('couple_members').delete().eq('couple_id', couple_id).eq('user_id', user.id)
    const { count } = await admin
      .from('couple_members')
      .select('user_id', { count: 'exact', head: true })
      .eq('couple_id', couple_id)
    if ((count ?? 0) === 0) {
      await admin.from('couples').delete().eq('id', couple_id)
    }
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
  if (deleteError) {
    return json({ error: 'delete_failed' }, 500)
  }

  return json({ deleted: true })
})
