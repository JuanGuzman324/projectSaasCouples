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
(necesita [Docker](https://www.docker.com/) corriendo):

```bash
supabase start          # levanta Postgres + el resto del stack en Docker
supabase db reset       # aplica supabase/migrations/*.sql desde cero
```

Contra un proyecto real ya vinculado (`supabase link --project-ref
TU-PROYECTO`):

```bash
supabase db push                      # aplica migraciones nuevas
supabase db diff --linked             # compara local vs. remoto (necesita Docker)
```

`supabase/tests/database/rls_isolation.sql` son 24 pruebas pgTAP que
confirman que una pareja no puede leer, insertar, editar ni borrar nada de
otra (couples, couple_members, couple_dates, memories, moments, fotos).
Nota: `moment_templates` es la única tabla con SELECT público entre
parejas a propósito (es una biblioteca compartida de diseños, ver más
abajo); el resto del aislamiento sigue siendo estricto. Córrelas así,
contra el stack local:

```bash
supabase test db --local
```

Si cambias cualquier política RLS, corre esto antes de comitear.

## Edge Functions

- `supabase/functions/send-reminders/` — revisa a diario (cron `pg_cron`,
  ver migración `00000000000007`) qué fechas y Momentos caen "mañana" y
  manda un push (Web Push / VAPID) a cada suscripción de la pareja.
  Desplegar con `supabase functions deploy send-reminders`.

## Qué hay hecho

**Base (P0/P1):** auth por correo, onboarding de pareja (crear/unirse con
código), Ajustes (nombre, ciudad, coordenadas, zona horaria, país, fecha
de inicio), Home (contador de días juntos, hitos, distancia entre
ciudades, hilo visual con cuenta regresiva en vivo, recuerdo al azar),
Recuerdos, Fechas (con calendario mensual), Momentos (estudio visual
completo: paleta, partículas animadas, tipografías, plantillas, plan del
día, foto).

**Resiliencia y distribución (P2):** instalable como PWA, exportar/
importar copia de seguridad en JSON, modo sin conexión con cola de
sincronización (React Query persistido en IndexedDB + mutaciones
pausadas que se reintentan solas al reconectar).

**Features nuevas (P3):** zonas horarias de cada integrante en Home,
cápsulas del tiempo (mensajes que se revelan en una fecha futura),
resumen anual descargable como imagen, biblioteca de fechas culturales
por país (con sugerencias para agregarlas como Momento), plantillas de
Momentos compartibles entre parejas, plan Premium (límites del plan
gratis + página de venta; el cobro real con Stripe/RevenueCat queda
pendiente), notificaciones push.

Pendiente, explícitamente bloqueado hasta que exista la app empaquetada
con Capacitor: widget de pantalla de inicio.

Ver **`BACKLOG.md`** para el detalle completo, con cada ítem marcado y
el orden en que se decidió construir todo esto — sirve como historial de
decisiones, no solo como lista de tareas.

**i18n:** 4 idiomas cableados (`src/locales/`), un namespace por feature.
`npm run check:locales` falla si a algún idioma le faltan o le sobran
claves respecto al español.

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción.
- `npm run lint` — oxlint.
- `npm run check:locales` — paridad de claves entre los 4 idiomas.
