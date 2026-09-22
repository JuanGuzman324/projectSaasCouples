# Nuestra historia — web (fase 1)

Vite + React + TypeScript + Tailwind v4, Supabase, i18next (es/en/de/fr),
React Query, React Router, Zustand.

## Arrancar

```bash
npm install
cp .env.example .env.local   # y pon ahí tu URL y anon key de Supabase
npm run dev
```

## Generar los tipos reales de la base de datos

`src/types/database.ts` está escrito a mano, con la MISMA forma que produce
el generador oficial, para que el proyecto compile sin depender de un
proyecto Supabase ya creado. En cuanto tengas el tuyo:

```bash
supabase gen types typescript --project-id TU-PROYECTO > src/types/database.ts
```

o cópialo desde el panel: **Project Settings → API → Generate types**.

## Esquema de base de datos y pruebas de aislamiento (RLS)

El esquema real (tablas, políticas RLS, funciones `create_couple`/
`join_couple`/etc., bucket `photos`) está versionado en
`supabase/migrations/`. Para levantarlo en local (necesita
[Docker](https://www.docker.com/) corriendo):

```bash
supabase start          # levanta Postgres + el resto del stack en Docker
supabase db reset       # aplica supabase/migrations/*.sql desde cero
```

`supabase/tests/database/rls_isolation.sql` son 24 pruebas pgTAP que
confirman que una pareja no puede leer, insertar, editar ni borrar nada de
otra (couples, couple_members, couple_dates, memories, moments, fotos).
Córrelas así, contra el stack local:

```bash
supabase test db --local
```

Si cambias cualquier política RLS, corre esto antes de comitear — si algo
se rompe, alguna de las 24 pruebas debería fallar.

Para comparar el estado local contra el proyecto real (por ejemplo, antes
de traer un cambio hecho a mano en el dashboard):

```bash
supabase link --project-ref TU-PROYECTO
supabase db diff --linked --schema public,storage
```

## Qué hay hecho

- **Auth:** registro y login por correo/contraseña (`src/features/auth/`).
- **Onboarding de pareja:** crear un espacio o unirse con un código
  (`src/features/couple/`), usando las funciones `create_couple`/`join_couple`
  del SQL que ya probamos con pgTAP.
- **Puerta principal** (`src/App.tsx`): sin sesión → login; con sesión sin
  pareja → onboarding; pareja con 1 solo miembro → pantalla de invitación;
  pareja completa → Home.
- **Home:** contador de "días juntos", ya usando `Intl.DateTimeFormat` /
  `Intl.NumberFormat` según el idioma activo (no fechas hechas a mano).
- **i18n:** 4 idiomas cableados (`src/locales/`). Español e inglés
  completos; alemán y francés en primer borrador — pendiente de revisión
  por hablante nativo antes de anunciarlos como listos (ver el plan de
  producto). `npm run check:locales` falla si a algún idioma le faltan o
  le sobran claves respecto al español.

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción (ya verificado que compila y
  empaqueta sin errores).
- `npm run lint` — oxlint (0 avisos ahora mismo).
- `npm run check:locales` — paridad de claves entre los 4 idiomas.

## Siguiente paso natural

- Recuerdos, fechas y momentos (mismo patrón que `couple/`: `api.ts` +
  hook de React Query + componente).
- Subida de fotos a Supabase Storage (bucket `photos`, ya con su política).
- Traducción de/fr revisada por hablante nativo.

## Recuerdos, fechas y momentos (recién agregado)

Mismo patrón que `couple/`: `api.ts` (llamadas a Supabase) + hook de React
Query + página. Borrado lógico (`deleted_at`), igual que en el SQL.

- `src/features/memories/` — recuerdos: título, fecha, tipo, lugar, texto,
  favorito.
- `src/features/dates/` — fechas: nombre, fecha, tipo, repetición
  (mensual/anual), con cuenta regresiva pluralizada vía i18next
  (`date-utils.ts` calcula la próxima ocurrencia, igual lógica que el
  prototipo HTML original).
- `src/features/moments/` — versión inicial: nombre, fecha, repetición,
  frase y mensaje. **Pendiente:** el estudio de diseño completo (paleta de
  colores, densidad de partículas, plan del día, vista previa animada) que
  sí tiene el prototipo HTML — se dejó para un siguiente paso porque es la
  pieza más grande de UI.
- Navegación por pestañas en `src/App.tsx` (Inicio / Recuerdos / Fechas /
  Momentos), con rutas anidadas.

## Verificación visual con red simulada (recién hecho)

No se pudo conectar contra un proyecto Supabase real desde este entorno
(su red de pruebas solo tiene salida a un puñado de dominios como npm o
GitHub; Supabase no está en esa lista). En su lugar, se sirvió la app real
con `vite dev` en un Chromium real y se interceptaron las llamadas de red
al dominio configurado, devolviendo respuestas con la forma exacta de
Supabase (REST de `couples`/`couple_members`/`memories`/`couple_dates`/
`moments`, y el flujo de `storage/v1/object/sign/...` para las fotos).

Se verificaron así, con datos y una foto reales: onboarding con sesión
iniciada, la pantalla de invitación, Inicio con el contador y el hilo,
Recuerdos con una foto real resuelta por URL firmada, Fechas con la cuenta
regresiva ya ordenada por proximidad, y Momentos con su degradado y foto.
También se confirmó el cambio de idioma en vivo (inglés por defecto según
el navegador, español al forzarlo), sin errores de consola en ningún caso.

De paso se corrigió un detalle real que apareció en las capturas: en
pantallas angostas, la barra de pestañas compartía fila con el selector de
idioma y "Cerrar sesión", cortando visualmente "Momentos". Ahora esa barra
tiene su propia fila de ancho completo. Sigue siendo desplazable
horizontalmente en pantallas muy angostas (confirmado que el scroll
funciona), pero le falta una pista visual de que se puede deslizar —
pendiente menor de pulido.

**Para probarlo con tu proyecto real:** pon tus credenciales en
`.env.local` (ver más arriba) y con las migraciones SQL ya aplicadas y al
menos un usuario de prueba, `npm run dev` debería mostrar el flujo
completo tal cual se ve en estas capturas, pero con tus datos reales.

## Estudio visual completo de Momentos (recién agregado)

Ya no es solo el formulario básico: el estudio replica el prototipo HTML
original — paleta de colores editable, densidad y velocidad de partículas,
7 figuras animadas (flores, pétalos, mariposas, corazones, estrellas,
destellos, emoji propio), 3 tipografías, 6 plantillas de arranque, plan del
día y una vista previa que anima en vivo mientras se edita.

- `src/features/moments/particles.ts` — el motor de partículas (canvas 2D
  + `requestAnimationFrame`), portado del prototipo HTML a un hook de
  React. Respeta `prefers-reduced-motion` (dibuja un cuadro fijo) y se
  ajusta con `ResizeObserver`.
- `src/features/moments/Scene.tsx` — el fondo con degradado + canvas +
  texto encima, compartido entre la vista previa del estudio y la escena a
  pantalla completa.
- `src/features/moments/constants.ts` — las 6 plantillas (Flores
  amarillas, Aniversario, Cumpleaños, Noche de estrellas, Reencuentro,
  Desde cero), con los mismos valores exactos del prototipo original.
- `src/features/moments/MomentStudio.tsx` — el editor: aplicar plantilla,
  cambiar cualquier color, mover densidad/velocidad, elegir tipografía,
  foto, y agregar/quitar ítems del plan del día.
- `src/features/moments/MomentView.tsx` — la escena a pantalla completa:
  checklist interactivo del plan, botón de confeti (`canvas-confetti`) y
  disparo automático si el momento es hoy.
- `src/ui/Modal.tsx` — diálogo genérico reutilizable para el estudio.

**Probado en un Chromium real, no solo compilado:**
- El canvas de la vista previa pinta partículas de verdad: 6152 píxeles no
  transparentes con la densidad por defecto, subiendo a 19593 al llevar la
  densidad al máximo (120) — confirma que el control realmente afecta el
  render, no solo el estado.
- Cambiar un color de la paleta (con el truco del *native value setter*,
  necesario porque Playwright no soporta `fill()` en `input[type=color]`)
  actualiza el degradado de fondo de la vista previa al instante.
- Aplicar la plantilla "Flores amarillas" reproduce visualmente el mismo
  diseño que el prototipo original (verde + flores doradas).
- Guardar un momento envía el payload correcto a Supabase (nombre, paleta,
  plan con el ítem agregado, motivo, densidad) y la tarjeta resultante se
  ve con su degradado y emoji.
- La escena completa muestra el checklist con el ítem ya marcado tachado,
  y el botón de confeti dispara un canvas real con 6017 píxeles pintados,
  usando los colores de la paleta del momento.
- Sin errores de consola en ningún paso.

Pendiente, ya identificado: el botón "Cerrar" de la escena completa quedaba
algo apretado en pantallas angostas — **ya corregido**: los botones ahora
envuelven y se centran (`flex-wrap justify-center`), verificado de nuevo
visualmente en 420px de ancho, ambos textos completos sin recortarse.

## Fuentes Young Serif / Hanken Grotesk (recién corregido)

Se enlazaron por fin en `index.html` (Google Fonts, con `preconnect`). Al
verificarlo con `vite dev` en un Chromium real apareció un bug ya existente
en el código: los 25 usos de `font-[var(--font-display)]` (clase arbitraria
de Tailwind v4) no generaban ninguna regla CSS — el título de "Inicia
sesión" y el resto de encabezados venían heredando la fuente del body
(Hanken Grotesk) en vez de Young Serif, sin que nada lo avisara. Tailwind
v4 solo resuelve `font-family` arbitrario con la sintaxis de propiedad
arbitraria `[font-family:...]`, no con el prefijo `font-[...]` (ese prefijo
lo usa también `font-bold` etc., y con `var(...)` como valor Tailwind no
lo reconocía como family). Se cambiaron los 25 usos a
`[font-family:var(--font-display)]` en los 14 archivos que los tenían.
Confirmado visualmente en Chromium real: el encabezado ahora se ve en
Young Serif (serif con look "hecho a mano"), distinto de Hanken Grotesk en
el resto del texto. `npm run lint` y `npm run build` siguen sin errores.
