// Edge Function programada (pg_cron, ver migración 00000000000007) que
// corre una vez al día: revisa qué couple_dates y moments caen "mañana" y
// manda un push a cada suscripción de esa pareja. Usa SUPABASE_SERVICE_ROLE_KEY
// (inyectada automáticamente por Supabase en toda Edge Function) para leer
// entre parejas sin las restricciones de RLS del cliente normal — el cron
// nunca necesita conocer esa key, la función ya la tiene disponible.
import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT')!

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

function tomorrowUTC(): Date {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + 1)
  return d
}

// Compara "pasa mañana" respetando la recurrencia, con el mismo criterio
// que nextOccurrence en el cliente (dates/date-utils.ts, moments/moment-utils.ts):
// yearly = mismo mes/día, monthly = mismo día, none = fecha exacta.
function matchesTomorrow(isoDate: string, repeat: string, tomorrow: Date): boolean {
  const [y, m, d] = isoDate.split('-').map(Number)
  if (repeat === 'yearly') return m === tomorrow.getUTCMonth() + 1 && d === tomorrow.getUTCDate()
  if (repeat === 'monthly') return d === tomorrow.getUTCDate()
  return y === tomorrow.getUTCFullYear() && m === tomorrow.getUTCMonth() + 1 && d === tomorrow.getUTCDate()
}

interface Reminder {
  coupleId: string
  title: string
  body: string
}

Deno.serve(async () => {
  const tomorrow = tomorrowUTC()
  const reminders: Reminder[] = []

  const { data: dates } = await supabase
    .from('couple_dates')
    .select('couple_id, title, kind, happens_on, repeat')
    .is('deleted_at', null)
  for (const d of dates ?? []) {
    if (matchesTomorrow(d.happens_on, d.repeat, tomorrow)) {
      reminders.push({ coupleId: d.couple_id, title: '💜 Mañana', body: d.title })
    }
  }

  const { data: moments } = await supabase
    .from('moments')
    .select('couple_id, name, happens_on, repeat')
    .is('deleted_at', null)
    .not('happens_on', 'is', null)
  for (const m of moments ?? []) {
    if (m.happens_on && matchesTomorrow(m.happens_on, m.repeat, tomorrow)) {
      reminders.push({ coupleId: m.couple_id, title: '✨ Mañana', body: m.name })
    }
  }

  if (reminders.length === 0) {
    return Response.json({ sent: 0, reminders: 0 })
  }

  const coupleIds = [...new Set(reminders.map((r) => r.coupleId))]
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('id, couple_id, endpoint, p256dh, auth')
    .in('couple_id', coupleIds)

  let sent = 0
  const staleIds: string[] = []

  for (const reminder of reminders) {
    const matchingSubs = (subs ?? []).filter((s) => s.couple_id === reminder.coupleId)
    for (const sub of matchingSubs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify({ title: reminder.title, body: reminder.body })
        )
        sent++
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode
        if (status === 404 || status === 410) staleIds.push(sub.id)
      }
    }
  }

  if (staleIds.length > 0) {
    await supabase.from('push_subscriptions').delete().in('id', staleIds)
  }

  return Response.json({ sent, reminders: reminders.length, staleRemoved: staleIds.length })
})
