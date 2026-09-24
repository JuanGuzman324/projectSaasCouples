# Nuestra historia — web

App para parejas: recuerdos, fechas especiales, "Momentos" (páginas
animadas para ocasiones puntuales), cápsulas del tiempo, resumen anual,
modo sin conexión y notificaciones push.

Vite + React + TypeScript + Tailwind v4, Supabase (Postgres + RLS +
Storage + Edge Functions), i18next (es/en/de/fr), React Query, React
Router, Zustand.

## Arrancar

```bash
npm install
cp .env.example .env.local   # y pon ahí tu URL, anon key y clave VAPID
npm run dev
```

## Variables de entorno (`.env.local`)

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — de tu proyecto
  Supabase (Project Settings → API).
- `VITE_VAPID_PUBLIC_KEY` — clave pública para notificaciones push. La
  privada va como secret de la Edge Function (`supabase secrets set
  VAPID_PRIVATE_KEY=... VAPID_PUBLIC_KEY=... VAPID_SUBJECT=mailto:tu@correo`),
  nunca en el cliente. Se generan con `npx web-push generate-vapid-keys`.

`.env.example` solo tiene placeholders a propósito — copialo y pon ahí
tus datos reales; `.env.local` ya está en `.gitignore`.

## Región del proyecto Supabase y residencia de datos

El proyecto real (`projectSaas`, ref `vgimknxjdxsjalzscxdx`) está en
**`us-east-1`** (Virginia, EE. UU.) — confirmado con `npx supabase projects
list`. La región de un proyecto Supabase no se puede cambiar después de
creado.

Decisión (2026-09-24): se queda en `us-east-1`. Aunque hay usuarios en
Alemania y Francia (RGPD), esto no es ilegal en sí — el RGPD permite
transferencias internacionales de datos cuando el encargado del
tratamiento (Supabase) ofrece las salvaguardas correctas, que es el
régimen bajo el que opera por defecto. Migrar a una región UE implicaría
un proyecto nuevo y mover todos los datos (esquema, Storage, Auth,
secretos), así que se difiere hasta que haya una razón concreta para
hacerlo (ej. un cliente/mercado que lo exija explícitamente).

**Esto no es asesoría legal.** Antes de un lanzamiento público real con
usuarios en la UE, esta decisión conviene confirmarla con un abogado,
igual que el texto final de la Política de Privacidad y los Términos (ver
`/legal/privacy` y `/legal/terms` en la app).

## Generar los tipos reales de la base de datos

`src/types/database.ts` está escrito a mano, con la MISMA forma que produce
el generador oficial, para no depender de tenerlo siempre actualizado a
mano. Para regenerarlo desde tu proyecto:

```bash
supabase gen types typescript --project-id TU-PROYECTO > src/types/database.ts
```

o cópialo desde el panel: **Project Settings → API → Generate types**.

## Esquema de base de datos, funciones y pruebas de aislamiento (RLS)

El esquema completo (tablas, políticas RLS, funciones `create_couple`/
`join_couple`/etc., bucket `photos`, extensiones `pg_cron`/`pg_net`) está
versionado en `supabase/migrations/`, en orden. Para levantarlo en local
(necesita [Docker Desktop](https://www.docker.com/) **instalado y
corriendo** — el CLI de Supabase levanta Postgres y el resto del stack
como contenedores; sin Docker activo, `supabase start`/`db reset`/`test db`
fallan con un error de conexión al daemon, no con un mensaje que lo diga
explícitamente):

```bash
supabase start          # levanta Postgres + el resto del stack en Docker
supabase db reset       # aplica supabase/migrations/*.sql desde cero
```

Contra un proyecto real ya vinculado (`supabase link --project-ref
TU-PROYECTO`):

```bash
supabase db push                      # aplica migraciones nuevas
supabase db diff --linked             # compara local vs. remoto (necesita Docker)
supabase db query --linked "SQL..."   # ejecuta SQL suelto contra el proyecto real
```

`supabase/tests/database/rls_isolation.sql` son 24 pruebas pgTAP que
confirman que una pareja no puede leer, insertar, editar ni borrar nada de
otra (couples, couple_members, couple_dates, memories, moments, fotos).
`moment_templates` es la única tabla con SELECT público entre parejas a
propósito (biblioteca compartida de diseños, ver más abajo); el resto del
aislamiento sigue siendo estricto. Para correrlas (**requiere Docker
corriendo**, arriba):

```bash
supabase start           # si no lo hiciste ya
supabase test db --local
```

Si cambias cualquier política RLS, corre esto antes de comitear — si algo
se rompe, alguna de las 24 pruebas debería fallar.

## Edge Functions

- `supabase/functions/send-reminders/` — revisa a diario (cron `pg_cron`,
  ver migración `00000000000008`) qué fechas y Momentos caen "mañana" y
  manda un push (Web Push / VAPID) a cada suscripción de la pareja.
  Desplegar con `supabase functions deploy send-reminders`.

  El cron lee la URL de la función y la key con la que la invoca desde
  **Supabase Vault**, no desde la migración (así el repo no queda atado a
  un proyecto Supabase específico). Hace falta crear esos dos secretos una
  sola vez por proyecto, fuera de git:

  ```bash
  supabase db query --linked "select vault.create_secret('https://TU-PROYECTO.supabase.co/functions/v1/send-reminders', 'send_reminders_url');"
  supabase db query --linked "select vault.create_secret('TU_ANON_KEY', 'send_reminders_bearer');"
  ```

- `supabase/functions/delete-account/` — borrado de cuenta completo
  (derecho al olvido, botón "Eliminar mi cuenta" en Ajustes): saca al
  usuario de `couple_members` (y borra la pareja en cascada si era el
  último miembro, igual que `leave_couple()`) y después llama a
  `supabase.auth.admin.deleteUser()`, que solo puede invocarse con
  `service_role`. Desplegar con `supabase functions deploy delete-account
  --no-verify-jwt`.

  El flag `--no-verify-jwt` (y `verify_jwt = false` en
  `supabase/config.toml`, sección `[functions.delete-account]`) es
  intencional, no un descuido: el gateway de Supabase rechaza con 401 —sin
  headers CORS— el preflight `OPTIONS` que manda el navegador antes del
  POST real, porque ese preflight nunca lleva `Authorization`. La función
  verifica el JWT por su cuenta, contra el header `Authorization` del POST
  real (con el cliente `anon`, nunca confiando en el body), así que sigue
  sin poder invocarse sin una sesión válida — el chequeo solo se mueve de
  dónde ocurre.

## Qué hay hecho, feature por feature

- **`auth/`** — registro y login por correo/contraseña contra
  `supabase.auth`; no tiene tabla propia (usa `auth.users`).
- **`couple/`** — onboarding (crear un espacio o unirse con código de
  invitación, funciones SQL `create_couple`/`join_couple`), y Ajustes
  (nombre, ciudad, coordenadas, zona horaria, país, fecha de inicio,
  plan). Tablas `couples` y `couple_members` (migración baseline); el
  límite de 2 integrantes por pareja lo impone un trigger
  (`couple_members_limit`).
- **`home/`** — contador de "días juntos", próximos hitos (día 100/500/
  aniversarios), distancia entre ciudades (haversine + mini-mapa SVG),
  hora local de cada integrante, hilo visual con cuenta regresiva al
  próximo encuentro, y recuerdo al azar / "un día como hoy". Todo
  derivado de `couples`/`couple_members`/`couple_dates`/`memories`, sin
  tabla propia.
- **`memories/`** — recuerdos con título, fecha, tipo, lugar, texto,
  favorito y foto opcional. Tabla `memories` (baseline), borrado lógico
  (`deleted_at`).
- **`dates/`** — fechas especiales con repetición (ninguna/mensual/
  anual) y calendario mensual con puntos de color por tipo de contenido.
  Tabla `couple_dates` (baseline).
- **`moments/`** — el estudio visual completo: paleta de colores, 7
  figuras animadas (canvas 2D + `requestAnimationFrame`, respeta
  `prefers-reduced-motion`), 3 tipografías, 6 plantillas de arranque,
  plan del día, foto, y una escena a pantalla completa con confeti. Tabla
  `moments` (baseline).
- **`storage/`** — subida/lectura de fotos al bucket `photos` (migración
  `00000000000001`), con URLs firmadas.
- **`backup/`** — exportar todo el contenido de la pareja (recuerdos,
  fechas, momentos) a un archivo JSON descargable, e importarlo de
  vuelta llamando a las mismas funciones `create*` de cada feature (no
  un insert directo a la tabla). Sin tabla propia; las fotos no se
  incluyen.
- **`timecapsules/`** — mensajes que se escriben hoy y se revelan en una
  fecha futura elegida; el cuerpo se oculta en la UI para quien no sea
  el autor hasta que llega la fecha. Tabla `time_capsules` (migración
  `00000000000003`).
- **`culturaldates/`** — sugiere fechas como San Valentín, Amor y
  Amistad (Colombia), White Day, Qixi, etc., según el país de cada
  integrante (`couple_members.country`, migración `00000000000004`), con
  un botón para agregarlas como Momento. Sin tabla propia.
- **`momenttemplates/`** — publicar el diseño de un Momento propio
  (paleta/motivo/fuente, sin foto ni fecha) como plantilla pública, y
  usar las de otras parejas como punto de partida. Tabla
  `moment_templates` (migración `00000000000005`) — la única del
  esquema con SELECT abierto entre parejas distintas a propósito.
- **`premium/`** — límites del plan gratuito (3 Momentos, 3 cápsulas del
  tiempo, 20 fotos) y página de venta. Usa la columna `couples.plan`
  (ya existía en el baseline); el cobro real con Stripe/RevenueCat
  todavía no está conectado — ver `BACKLOG.md`.
- **`push/`** — notificaciones push (Web Push/VAPID): Service Worker
  (`public/sw.js`), suscripción guardada en `push_subscriptions`
  (migración `00000000000006`), y la Edge Function/cron de arriba que
  manda los avisos.
- **`yearreview/`** — resumen del año (días juntos, recuerdos, momentos,
  fechas) descargable como imagen PNG (dibujada directo en `<canvas>`,
  sin dependencias nuevas). Sin tabla propia, todo calculado en el
  cliente a partir de los datos ya cargados.

**Modo sin conexión:** la caché de React Query se persiste en IndexedDB
(`src/lib/offline.ts`), así que la app muestra el último estado conocido
sin red; las mutaciones (crear/editar/borrar) quedan pausadas y se
reintentan solas al reconectar.

**PWA:** instalable (`public/manifest.webmanifest` + íconos).

Ver **`BACKLOG.md`** para el detalle completo de qué falta y en qué orden
se construyó todo esto — sirve como historial de decisiones, no solo
como lista de tareas.

**i18n:** 4 idiomas cableados (`src/locales/`), un namespace por feature.
`npm run check:locales` falla si a algún idioma le faltan o le sobran
claves respecto al español. Español e inglés están completos; alemán y
francés siguen pendientes de revisión por un hablante nativo (ver
`BACKLOG.md`).

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción.
- `npm run lint` — oxlint.
- `npm run check:locales` — paridad de claves entre los 4 idiomas.
