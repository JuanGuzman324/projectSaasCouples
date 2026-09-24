# Backlog v2 — Nuestra historia (projectSaasCouples)

Generado tras auditar el repositorio real: se instaló, se compiló (`tsc -b`,
`vite build`), se corrió `oxlint` y `check:locales`, y se reconstruyeron las
migraciones + las 24 pruebas pgTAP contra un Postgres real. El backlog v1
(P0–P3 originales) está prácticamente agotado — este documento reemplaza a
`BACKLOG.md` como la lista vigente.

Leyenda de esfuerzo: S = menos de medio día, M = medio a un día, L = varios
días / una pieza grande.

## P0 — Arreglos rápidos, antes de sumar nada nuevo

Ninguno de estos bloquea el uso de la app, pero los tres son baratos de
resolver y dejan de acumularse cuanto antes se hagan.

- [x] **Sacar la clave `anon` real de `.env.example` (S)** `.env.example` tiene la URL y la clave `anon` reales del proyecto, no placeholders. No es una fuga grave (la clave `anon` es pública por diseño; RLS es la barrera real), pero rompe la portabilidad: si alguien clona el repo para un proyecto Supabase nuevo, ese archivo lo induce a error, y no tiene sentido que un archivo llamado "example" traiga credenciales de un proyecto real. Hecho cuando: `.env.example` vuelve a tener `https://TU-PROYECTO.supabase.co` y `TU_ANON_KEY` (o equivalente), y las credenciales reales solo viven en `.env.local` (ya ignorado por git).
- [x] **Sacar la clave `anon` real de la migración de cron (S)** `supabase/migrations/00000000000007_push_reminders_cron.sql` tiene la misma clave hardcodeada en el `net.http_post`. Además de la razón de arriba, esto acopla la migración a un proyecto específico: si alguien clona el repo y aplica las migraciones contra su propio proyecto Supabase, el cron intentará llamar a tu función, no la suya. Hecho cuando: el header `Authorization` se arma desde `vault.create_secret()` de Supabase (o desde una tabla de configuración propia), no desde un literal en el SQL.
- [x] **Corregir el aviso de lint en `usePush.ts` (S)** `setChecking(false)` dentro de un `useEffect` cuando `!supported` — oxlint marca "avoid calling setState() directly within an effect". Hecho cuando: el estado inicial se calcula directo (`useState(() => !isPushSupported())`) y el `useEffect` deja de setear `checking` en la rama de "no soportado". `npm run lint` da 0 avisos.

## P1 — Documentación al día

- [ ] **Reescribir `README.md` (M)** Documenta hasta "Fuentes Young Serif / Hanken Grotesk" pero no tiene ninguna sección sobre Ajustes, hitos, distancia, calendario, modo sin conexión, PWA, backup, push, fechas culturales, plantillas compartibles, resumen anual, cápsulas del tiempo, ni Premium. Alguien que lo lea hoy se lleva una idea muy pobre de qué tan avanzado está el proyecto. Hecho cuando: cada feature de `src/features/` tiene al menos un párrafo — qué hace, dónde vive, con qué tabla/migración se relaciona — y las secciones fechadas tipo "(recién agregado)" se consolidan en una sola narrativa (o se recorta a un CHANGELOG aparte si se prefiere conservar el historial).
- [ ] **Documentar cómo correr las pruebas pgTAP localmente (S)** El propio archivo de pruebas dice `supabase start` + `supabase test db`, pero eso requiere Docker corriendo. Vale la pena una nota corta en el README (o en un `CONTRIBUTING.md`) con ese requisito explícito, para que no vuelva a aparecer la confusión de "por qué me pide Docker" que ya tuvimos.

## P2 — Deuda técnica y contenido

- [ ] **Revisión nativa de alemán y francés (M)** Sigue pendiente desde el plan original, y con los 7 namespaces nuevos (push, premium, timecapsules, culturaldates, momentTemplates, yearreview, y los campos agregados a los existentes) el volumen de texto sin revisar por un hablante nativo creció bastante. Hecho cuando: un hablante nativo de cada idioma revisó los 11 namespaces completos y el tono (especialmente en Momentos, donde el registro cálido/romántico es fácil de traducir de forma robótica).
- [ ] **Ampliar el catálogo de fechas culturales (S)** Hoy son 9 fechas semilla (`culturaldates/data.ts`). Vale la pena revisarlas con foco en los mercados de lanzamiento (es/en/de/fr) y sumar las que falten por país (ej. White Day, Qixi, San Valentín en distintas variantes regionales, ya mencionadas en el plan de producto).
- [ ] **Code-splitting del bundle (S)** El build avisa que el JS pasa los 500 kB (754 kB sin comprimir, ~216 kB gzip). No es grave todavía, pero con Momentos (canvas + confetti), Premium y Year Review ya todos cargando en el mismo bundle inicial, es buen momento para separar rutas pesadas con `import()` dinámico antes de que crezca más. Hecho cuando: `vite build` deja de avisar sobre el tamaño de chunk, usando lazy-loading en rutas como `/moments`, `/year-review` y `/premium`.

## P3 — Lo grande que sigue sin arrancar

Nada de esto es urgente; son las fases 3-4 del plan de producto original.

- [ ] **Pagos reales (Stripe o RevenueCat) (L)** `premium/limits.ts` ya define los límites del plan gratuito y la UI de venta existe, pero nada cobra todavía — `couple.plan` solo cambia si se edita a mano en la base. Es el paso que falta para que Premium sea un negocio y no solo una interfaz.
- [ ] **Empaquetado con Capacitor + publicación en tiendas (L)** iOS (App Store) y Android (Play Store). Habilita, de paso, el widget de pantalla de inicio que quedó pendiente del backlog anterior.
- [ ] **Widget de pantalla de inicio (L)** Depende directamente del ítem anterior — no tiene sentido antes de que exista la app nativa empaquetada.

## Cómo usar esto con Claude Code

Igual que la vez pasada: una casilla por sesión, empezando por P0 (son
rápidas y evitan que seguir sumando cosas encima de una clave filtrada o un
README mentiroso). Mensaje sugerido:

> Trabajemos en el ítem "[nombre del ítem]" del BACKLOG.md (v2). Antes de
> tocar código, confirma con `git log`/`git diff` que el estado del repo
> coincide con lo que describe el ítem.

Marca la casilla y comitea `BACKLOG.md` junto con el cambio.
