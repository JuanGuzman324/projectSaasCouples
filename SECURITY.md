# Manejo de credenciales

Documento interno (no es una página de la app) para quien mantenga este
repositorio. Formaliza lo que ya se corrigió en la práctica — la clave
`anon` que se sacó de `.env.example` y de una migración de cron (ver
`BACKLOG.md`, P0 v2 y v4) — para que no vuelva a pasar.

Regla general: **ningún secreto real vive en git, en el bundle del
cliente, ni en un archivo versionado.** Cada uno vive en exactamente uno
de estos tres sitios, según a quién le tiene que llegar:

| Dónde vive | Para qué | Ejemplos en este proyecto |
| --- | --- | --- |
| `.env.local` (gitignored) | Secretos que el bundle del cliente necesita en tiempo de build | `VITE_SUPABASE_ANON_KEY`, `VITE_VAPID_PUBLIC_KEY` |
| Secret de Edge Function (`supabase secrets set`) | Secretos que solo debe ver el servidor, nunca el cliente | `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` |
| Supabase Vault (`vault.create_secret`, leído desde SQL con `vault.decrypted_secrets`) | Valores que un cron (`pg_cron`/`pg_net`) necesita para llamar a una Edge Function, sin quedar como literal en una migración versionada | `send_reminders_url`, `send_reminders_bearer`, `purge_deleted_url`, `purge_deleted_bearer` |

La clave `anon` es pública por diseño (viaja en el bundle del cliente); lo
que la protege es RLS, no que esté "escondida". Aun así no debe aparecer
como literal en `.env.example` ni en ninguna migración, porque eso ata el
archivo a un proyecto Supabase específico y rompe la portabilidad del repo
(ver los dos incidentes ya corregidos, arriba).

## Inventario de secretos actuales

- **`SUPABASE_SERVICE_ROLE_KEY`** — nunca se maneja a mano: Supabase la
  inyecta automáticamente como variable de entorno en toda Edge Function
  (`send-reminders`, `delete-account`, `purge-deleted`). Nunca debe
  aparecer en un `supabase secrets set`, en `.env.local` ni en ningún
  archivo del repo.
- **`VITE_SUPABASE_ANON_KEY`** — en `.env.local`. Pública por diseño (ver
  arriba); reusada como bearer en los cron de Vault porque el gateway solo
  necesita un JWT válido para dejar pasar la llamada, no permisos
  elevados (la Edge Function arma su propio cliente admin con la
  `service_role` que ya tiene inyectada).
- **`VAPID_PRIVATE_KEY`** — secret de la Edge Function `send-reminders`
  (`supabase secrets set`). Si se filtrara, cualquiera podría mandar push
  suplantando a la app a los endpoints de navegador que tengamos
  guardados.
- **La contraseña de la base de datos** (la que pide `supabase login` /
  `supabase link`) — nunca se ha escrito en ningún archivo de este repo;
  vive únicamente en el gestor de contraseñas de quien administra el
  proyecto y en la sesión autenticada de la CLI de Supabase.
- **Los cuatro secretos de Vault** (`send_reminders_url`,
  `send_reminders_bearer`, `purge_deleted_url`, `purge_deleted_bearer`) —
  creados una vez por proyecto con `supabase db query --linked "select
  vault.create_secret(...)"` (ver README, sección "Edge Functions"), nunca
  como valor literal en una migración.

## Lo que vendrá (Stripe / RevenueCat)

Cuando se integre un proveedor de pagos real (BACKLOG P2, "Pagos reales"):
las claves secretas (`STRIPE_SECRET_KEY`, la clave del webhook, el API key
de RevenueCat) van como secret de Edge Function, igual que
`VAPID_PRIVATE_KEY` hoy. Solo la clave **publicable** (`STRIPE_PUBLISHABLE_KEY`,
si aplica) podría ir en `VITE_...` — cualquier clave con permisos de cobro
o reembolso no debe tocar el cliente bajo ninguna circunstancia.

## Si un secreto se filtra

1. Rotarlo de inmediato en el panel del proveedor correspondiente:
   - Claves de Supabase (`anon`, `service_role`, contraseña de la base):
     Project Settings → API / Database, en el dashboard de Supabase.
   - Claves VAPID: se regeneran con `npx web-push generate-vapid-keys` y
     se vuelven a cargar con `supabase secrets set`; hace que todas las
     suscripciones push existentes queden inválidas (los usuarios tendrán
     que volver a activarlas).
   - Secretos de Vault: `select vault.update_secret(id, nuevo_valor)` o
     borrar y volver a crear con `vault.create_secret`.
2. Si el secreto llegó a quedar commiteado en git en algún punto de la
   historia, rotarlo no es opcional aunque se borre el commit después: la
   clave vieja hay que darla por comprometida y hay que reescribir el
   historial (`git filter-repo` o similar) además de rotar.
3. Confirmar en los logs de Supabase (Auth, API) si hubo uso indebido
   antes de la rotación.
