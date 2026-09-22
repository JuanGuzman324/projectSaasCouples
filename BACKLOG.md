# Backlog — Nuestra historia (projectSaasCouples)

Generado a partir de comparar el repositorio real (`main`, revisado el 2026-09-22) contra el prototipo HTML original y el plan de producto. Formato pensado para pasarle esto directo a Claude Code: cada ítem es una tarea concreta y acotada, con su criterio de "terminado".

Leyenda de esfuerzo: S = menos de medio día, M = medio a un día, L = varios días / una pieza grande de UI o infraestructura.

## P0 — Antes de seguir construyendo encima

Estas dos rompen el flujo de trabajo si no se resuelven ya: una es un riesgo real de perder trabajo, la otra bloquea que cualquier cambio de esquema futuro se pueda revisar o revertir con confianza.

- [x] **Versionar las migraciones SQL en el repo (S)** No existe carpeta `supabase/` en git; el esquema (`couples`, `couple_members`, `memories`, `couple_dates`, `moments`, políticas RLS, funciones `create_couple`/`join_couple`/etc.) solo vive en el proyecto Supabase real. Correr `supabase db pull` contra el proyecto vinculado (o recrear las migraciones a mano) y comitear el resultado. Hecho cuando: `supabase/migrations/*.sql` está en el repo y `supabase db push` contra un proyecto nuevo reproduce el esquema completo sin errores.
- [x] **Reintroducir las pruebas pgTAP de aislamiento entre parejas (S)** Las 24 pruebas que confirman que una pareja no puede leer/editar/borrar nada de otra no están en el repo. Sin ellas, un cambio futuro a las políticas RLS puede romper el aislamiento sin que nada lo avise. Hecho cuando: `supabase/tests/` existe y corre en CI o al menos documentado cómo correrlas localmente.

## P1 — Paridad con el prototipo (lo que ya existía y se perdió al migrar)

Ordenado por cuánto se nota su ausencia en el uso diario de la app.

- [x] **Pantalla de Ajustes / editar perfil de pareja (S)** Hoy `couple/api.ts` solo tiene crear/unirse/salir — no hay forma de corregir el nombre, la fecha de inicio o la ciudad después del onboarding. Es la carencia más molesta de las que quedan: cualquier error al llenar el onboarding queda fijo para siempre. Hecho cuando: existe una ruta `/settings` con un formulario que llama a un nuevo `updateCouple()` (couple_id, nombre propio, ciudad/lat/lon, fecha de inicio) y refleja el cambio en Home al guardar.
- [x] **Hitos (día 100, 500, 1000, aniversario de N años) (M)** Portar `milestones()` del prototipo HTML. Tarjeta en Home con las próximas 3-4 fechas redondas. Hecho cuando: aparece en Home, calculado desde `couple.start_date`, con `Intl.DateTimeFormat`/`Intl.NumberFormat` como el resto de la app.
- [x] **Distancia entre ciudades (M)** Cada `couple_member` ya guarda `city/lat/lon`; falta la tarjeta que calcula la distancia (fórmula haversine, ya escrita en el prototipo) y el mini-mapa SVG. Hecho cuando: tarjeta en Home con km, tiempo de vuelo/carretera aproximado y el mapa, solo si ambos miembros tienen ciudad cargada.
- [ ] **Calendario mensual en Fechas (M)** `DatesPage.tsx` sigue siendo solo una lista. Portar el calendario del prototipo (grilla del mes, puntos de color por tipo de contenido, detalle del día seleccionado). Hecho cuando: vista de calendario junto a la lista de próximas fechas, con recuerdos/fechas/momentos marcados por día.
- [ ] **"Recuerdo al azar" / "un día como hoy" (S)** Tarjeta en Home que muestra un recuerdo aleatorio, o prioriza uno que ocurrió el mismo día-mes en un año anterior. Hecho cuando: aparece en Home cuando hay al menos un recuerdo guardado, con botón para pedir otro al azar.
- [ ] **Hilo visual + contador de segundos en vivo (M)** El hero del prototipo tenía una curva SVG entre las dos ciudades con un punto de progreso hacia el próximo encuentro, y un contador que sube segundo a segundo. Es más decorativo que funcional — dejarlo de último dentro de este grupo. Hecho cuando: Home muestra el hilo (si hay próximo encuentro guardado) y el contador de segundos actualiza sin recargar la página.

## P2 — Resiliencia y distribución

Todo esto es "la app deja de sentirse fina" si falta, pero no bloquea usar las funciones principales.

- [ ] **PWA instalable (S)** Falta `manifest.webmanifest` y los íconos (`public/` solo tiene `favicon.svg`/`icons.svg`). El prototipo ya tenía esto resuelto. Hecho cuando: Chrome/Safari ofrecen "Instalar app" y abre a pantalla completa, con ícono propio.
- [ ] **Exportar / importar copia de seguridad en JSON (S)** Botón en Ajustes para descargar todo el contenido de la pareja como JSON, y restaurarlo. Es la red de seguridad más barata de construir mientras no exista backup automático del lado de Supabase. Hecho cuando: el archivo descargado incluye recuerdos, fechas y momentos, y "importar" los vuelve a crear vía las mismas funciones de `api.ts` de cada feature (no un insert directo a la tabla).
- [ ] **Modo sin conexión con cola de sincronización (L)** La app depende 100% de que Supabase responda; sin red no carga nada. Es el ítem más grande de este backlog — requiere una capa de caché local (IndexedDB, por ejemplo con Dexie) y una cola de cambios pendientes que se reintenta al volver la conexión. Hecho cuando: con el wifi apagado, la app sigue mostrando el último estado conocido, y los cambios hechos offline se sincronizan solos al reconectar.

## P3 — Features nuevas (no existían ni en el prototipo)

Aprovechan que ahora es multi-pareja; no tiene sentido antes de que P0/P1 estén resueltos, porque construyen sobre una base que todavía se está estabilizando.

- [ ] **Notificaciones push (L)** Recordatorio de fecha próxima, aniversario, o de un momento especial. Es el punto que más sube la retención según el plan de producto original — requiere Edge Functions + un proveedor de push (FCM o Web Push).
- [ ] **Biblioteca de fechas culturales por país (M)** San Valentín, Amor y Amistad (Colombia), Día de las flores amarillas, White Day, Qixi... sugeridas automáticamente según el país de cada miembro, con un botón para agregarlas como Momento.
- [ ] **Plantillas de Momentos compartibles entre parejas (M)** Que una pareja publique el diseño de un Momento (paleta, motivo, mensaje-plantilla sin datos personales) y otras lo usen como punto de partida. Funciona también como gancho de crecimiento.
- [ ] **Resumen anual (M)** Un "resumen del año" de la relación (días juntos, recuerdos guardados, momentos vividos) exportable como imagen o PDF para compartir.
- [ ] **Zonas horarias (S)** Mostrar la hora local del otro miembro en Home — relevante para parejas a distancia real (usa el mismo `city/lat/lon` que ya existe).
- [ ] **Cápsulas del tiempo (M)** Mensajes que se escriben ahora y se revelan en una fecha futura elegida.
- [ ] **Plan Premium (L)** La columna `plan` en `couples` ya existe (`free`/`premium`) pero no se usa todavía. Definir qué queda detrás del muro (más fotos, momentos ilimitados, cifrado extremo a extremo) e integrar Stripe o RevenueCat.
- [ ] **Widget de pantalla de inicio (L)** Solo tiene sentido una vez exista la app empaquetada con Capacitor (fase de publicación en tiendas del plan original, todavía no arrancada).

## Cómo usar esto con Claude Code

Cada casilla es una unidad de trabajo razonable para una sesión. Sugerencia de mensaje inicial por tarea:

> Trabajemos en el ítem "[nombre del ítem]" del BACKLOG.md. Lee el contexto del README y el código de la feature más parecida que ya exista (por ejemplo, `couple/api.ts` como patrón) antes de escribir código.

Marca la casilla y comitea `BACKLOG.md` junto con el cambio, así el archivo queda como historial de qué se decidió y en qué orden.
