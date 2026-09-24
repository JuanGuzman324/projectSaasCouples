# Backlog v4 — Nuestra historia (projectSaasCouples)

Agrega la sección legal y de seguridad que faltaba (nada de esto existía en
el repo al momento de escribir esto: no hay política de privacidad,
términos, aviso de cookies, ni un flujo de borrado de cuenta completo).
Conserva los 4 pendientes de `BACKLOG.md` v3 sin cambios.

**Nota importante**: no soy abogado y esto no es asesoría legal. Lo que
sigue es una lista técnica y operativa de qué falta construir/decidir para
operar con higiene legal razonable — el texto final de la política de
privacidad y los términos, y qué régimen normativo aplica exactamente
(RGPD, la ley de protección de datos colombiana, etc.), conviene revisarlo
con un abogado antes de un lanzamiento público real, especialmente porque
hay usuarios en Alemania y Francia (Unión Europea).

Leyenda de esfuerzo: S = menos de medio día, M = medio a un día, L = varios
días o requiere una decisión externa (ej. contratar revisión legal) antes
de poder cerrarse del todo.

## P0 — Legal y seguridad (antes de tener usuarios reales)

Esta sección es nueva y va primero: a diferencia de la revisión de idiomas
o el widget, operar sin esto no es "queda menos pulido" — es operar fuera
de lo que exige la ley en los mercados donde ya se apunta (Alemania y
Francia son RGPD; Colombia tiene su propia Ley 1581 de 2012 de protección
de datos).

- [x] **Confirmar la región del proyecto Supabase (S)** La región de un proyecto Supabase no se puede cambiar después de creado. Si el proyecto quedó en EE. UU. y hay usuarios en la UE, no es ilegal en sí (RGPD permite transferencias internacionales con las salvaguardas correctas), pero si importa la residencia de datos en la UE, hay que decidirlo ahora — migrar después significa un proyecto nuevo y mover todos los datos. Hecho cuando: se sabe con certeza en qué región está el proyecto (Project Settings → General) y, si no es la deseada, está documentada la decisión de quedarse o migrar. *(Confirmado vía `npx supabase projects list`: `us-east-1`. Decisión del usuario: quedarse ahí — ver README, sección "Región del proyecto Supabase y residencia de datos", y la Política de Privacidad, sección "Dónde se alojan tus datos".)*
- [x] **Política de Privacidad (M, más revisión legal externa)** Debe describir, en términos llanos: qué datos se recogen (correo, nombre, ciudad/coordenadas, fotos, contenido de recuerdos/fechas/momentos/cápsulas del tiempo, el endpoint de push del navegador), para qué se usan, con qué base legal, cuánto se conservan, quién los procesa además de la propia app (ver "subencargados" abajo), y cómo ejercer los derechos de acceso/rectificación/portabilidad/supresión. La exportación de datos (`backup/`) ya cubre acceso y portabilidad — falta que la política lo mencione explícitamente y enlazar ahí. Hecho cuando: existe en los 4 idiomas, enlazada desde el footer y desde la pantalla de Registro, y **un abogado la revisó antes de publicarla como definitiva** (pendiente — el texto actual es un primer borrador técnico, no una versión legal definitiva).
- [x] **Términos y Condiciones de uso (M, más revisión legal externa)** Uso aceptable, responsabilidad de cada cuenta por su contenido, limitación de responsabilidad, ley aplicable y jurisdicción, qué pasa si se incumplen (suspensión/cierre de cuenta). Hecho cuando: existen en los 4 idiomas y el registro exige aceptarlos explícitamente (ver ítem de abajo). Misma salvedad que arriba: pendiente de revisión legal externa antes de considerarse definitivo.
- [x] **Casilla de aceptación en Registro (S)** Hoy `Register.tsx` no tiene ninguna casilla de "he leído y acepto la Política de Privacidad y los Términos". Sin esto, aunque existan las políticas, no hay evidencia de que el usuario las aceptó. Hecho cuando: el formulario de registro no deja continuar sin marcar la casilla, con enlaces reales a ambos documentos.
- [x] **Edad mínima declarada (S)** No se pide fecha de nacimiento ni se verifica edad (razonable para el tamaño actual del proyecto — no hay que construir verificación de edad), pero los Términos deben declarar una edad mínima explícita (típicamente 16 años para RGPD, o 18 si se prefiere ser conservador) y dejar claro que la app no está dirigida a menores de esa edad. Hecho cuando: queda una frase explícita en los Términos; no requiere ningún cambio de código.
- [x] **Aviso de Cookies / almacenamiento local, con matiz correcto (S)** Hoy la app no usa cookies — usa `localStorage` para la sesión de Supabase (`sb-*-auth-token`), el idioma (`nh_lang`) y el tema. Bajo RGPD/ePrivacy esto normalmente no necesita banner de consentimiento porque son usos "estrictamente necesarios" (sesión) o funcionales de bajo riesgo (idioma, tema) — pero si más adelante se agrega analítica (PostHog, Sentry con tracking de usuario) o Stripe, eso sí exige consentimiento previo antes de cargar esos scripts. Hecho cuando: existe una página corta explicando qué se guarda en el dispositivo y por qué (sin necesidad de banner mientras no haya analítica), y queda anotado en este backlog que agregar analítica en el futuro reabre este ítem. *(Nueva página `/legal/local-storage` en los 4 idiomas, enlazada desde un footer nuevo en el Shell —junto a Privacidad y Términos, que antes solo estaban enlazados desde Registro—. Explica sesión/idioma/tema/caché offline (IndexedDB) por su nombre de clave real y por qué no hace falta un banner de "Aceptar" todavía. **Recordatorio anotado aquí, como pide el propio ítem: agregar analítica o Stripe en el futuro reabre este ítem** — haría falta pedir consentimiento antes de cargar esos scripts.)*
- [x] **Borrado de cuenta completo (derecho al olvido) (M)** `leave_couple()` borra el contenido de la pareja, pero no borra la fila en `auth.users` — la cuenta (correo, identidad) sigue existiendo en Supabase Auth después de "salir". No hay ningún flujo hoy para que una persona borre su cuenta por completo. Borrar un usuario de Auth requiere la API de administración (`service_role`, nunca disponible en el cliente), así que esto necesita una Edge Function nueva: verifica el JWT de quien llama, confirma que coincide con el usuario a borrar, y ahí sí usa `supabase.auth.admin.deleteUser()`. Hecho cuando: existe un botón "Eliminar mi cuenta" en Ajustes que, tras confirmar, borra la fila de `auth.users` (con `leave_couple()` corriendo antes o como parte del mismo flujo). *(Edge Function `delete-account` desplegada y probada end-to-end contra el proyecto real: se borró una cuenta de prueba de verdad, confirmado por SQL que desapareció de `auth.users` y que, al no ser el último miembro, la pareja y el otro miembro quedaron intactos. Botón "Eliminar mi cuenta" en Ajustes con modal de confirmación de doble paso —hay que escribir "ELIMINAR"/"DELETE"/"LÖSCHEN"/"SUPPRIMER" según el idioma.)*
- [x] **Purga real de contenido borrado lógicamente (M)** El borrado de recuerdos/fechas/momentos/cápsulas es lógico (`deleted_at`), lo cual está bien para poder deshacer un borrado — pero hoy nada purga esas filas (ni las fotos asociadas en Storage) después de un tiempo. Para RGPD, "borrado" debería significar borrado real en un plazo razonable, no una fila oculta para siempre. Hecho cuando: un cron (mismo patrón que `push_reminders_cron`) borra en firme, cada semana, todo lo que lleve más de N días (30 es un punto de partida razonable) con `deleted_at` no nulo, incluyendo el archivo en el bucket `photos` si tenía `photo_path`. *(Edge Function `purge-deleted` + cron semanal (migración `00000000000009`, mismo patrón de Vault que `push_reminders_cron`), cubre `memories`, `moments`, `couple_dates`, `time_capsules` y `moment_templates`, borrando también la foto en el bucket `photos` cuando aplica. Probado end-to-end contra el proyecto real: se insertó un recuerdo de prueba con `deleted_at` de hace 40 días, se invocó la función manualmente vía `net.http_post` y confirmó `"memories":1` purgado; se verificó por SQL que la fila ya no existe.)*
- [x] **Política de manejo de credenciales (documento interno) (S)** No es una página pública — es un documento corto para quien mantiene el proyecto, formalizando lo que ya se corrigió en la práctica (la clave `anon` que se sacó de `.env.example` y de la migración de cron): qué secretos existen hoy (`service_role` key, clave privada VAPID, la contraseña de la base de datos) y los que vendrán (claves de Stripe/RevenueCat), dónde puede vivir cada uno (solo como secret de Edge Function o variable de CI — nunca en git, nunca en el bundle del cliente), y qué hacer si alguno se filtra (rotar de inmediato en el panel de Supabase/del proveedor correspondiente). Hecho cuando: existe `SECURITY.md` o una sección en el README con esa lista y esas reglas. *(`SECURITY.md` nuevo en la raíz: tabla de dónde vive cada tipo de secreto, inventario de los secretos actuales del proyecto —incluidos los 4 de Vault de `send-reminders`/`purge-deleted`—, qué hacer cuando llegue Stripe/RevenueCat, y pasos concretos de rotación si algo se filtra.)*
- [x] **Registro de subencargados (sub-processors) (S)** Lista de a quién le confía datos personales, para citar en la Política de Privacidad: Supabase (base de datos, autenticación, Storage, funciones), los servicios de push de cada navegador (Google/Mozilla/Apple reciben el envío del push aunque la app no los llame directamente), y — cuando se integren — Stripe o RevenueCat. Hecho cuando: la lista está escrita (puede vivir directo en la Política de Privacidad, no hace falta un documento aparte). *(Cubierto como sección "Con quién compartimos datos" dentro de la Política de Privacidad.)*
- [~] **Activar protección contra registros automatizados (S)** El registro está abierto (cualquiera puede crear cuenta) sin CAPTCHA. Esto ya se había anotado como pendiente para antes de un lanzamiento público — sigue sin hacerse. Hecho cuando: Authentication → Attack Protection tiene un CAPTCHA (hCaptcha o Turnstile) activo en el panel de Supabase. *(Código listo y probado sin claves reales (el widget no se muestra si falta `VITE_TURNSTILE_SITE_KEY`, y Login/Registro siguen funcionando igual): widget de Cloudflare Turnstile en `src/ui/Turnstile.tsx`, usado en Login y Registro —Supabase exige el captcha en ambos endpoints una vez activado, no solo en registro—, `captchaToken` ya se manda en `signInWithPassword`/`signUp`, y `supabase/config.toml` ya declara `[auth.captcha]` con `secret = "env(SUPABASE_AUTH_CAPTCHA_SECRET)"`. **Falta lo que no puedo hacer por ti**: crear la cuenta en Cloudflare Turnstile y conseguir el par de claves (Site Key/Secret Key) — ver README, sección "CAPTCHA en Login/Registro", para los pasos exactos una vez las tengas.)*

## P1 — Revisión nativa de alemán y francés

(sin cambios respecto a v3 — se mantiene como estaba)

- [ ] **Revisar los 13 namespaces de `de/` y `fr/` con un hablante nativo (M)** Ver `REVISION_DE_FR.md` (336 claves, generado directo del contenido real de `src/locales/`). Namespaces nunca revisados: `push`, `premium`, `timecapsules`, `culturaldates`, `momentTemplates`, `yearreview`. Más atención al tono en `moments.json` y `home.json`. Hecho cuando: un hablante nativo de cada idioma revisó los 13 namespaces y `npm run check:locales` sigue en verde. *(Nota: con este backlog se sumó el namespace `legal`, que también queda sin revisión nativa — 14 namespaces en total ahora.)*

## P2 — Decisiones de negocio, cuando se decida lanzar

(sin cambios respecto a v3)

- [ ] **Pagos reales (L)** Los límites del plan gratuito y la página de venta ya existen; `couples.plan` solo cambia a mano hoy. Revisado en esta sesión: no hay ningún paquete, Edge Function de webhook ni tabla de facturación todavía — es un punto de partida limpio, no deuda a medias. Para Colombia, [Wompi](https://wompi.co) (de Bancolombia: PSE, Nequi, tarjetas, sin cuenta en dólares) es mejor alternativa que Stripe/RevenueCat; se integraría con el mismo patrón que las demás Edge Functions (webhook → función → actualiza `couple.plan`). En pausa hasta que el usuario decida crear la cuenta y pasar las claves.
- [~] **Empaquetado con Capacitor + publicación en tiendas (L)** iOS y Android, sobre el mismo build de Vite. *(Scaffolding de Android hecho: `@capacitor/core`/`@capacitor/cli`/`@capacitor/android` instalados, `capacitor.config.ts` + carpeta `android/` generados y sincronizados contra `dist/` (ver README, sección "Empaquetado con Capacitor (Android)"). Falta: 1) compilar/probar de verdad, necesita Android Studio instalado (no está en este entorno); 2) publicar en Play Store, necesita una cuenta de Google Play Developer (USD 25 único) que no puedo crear por código. **iOS sin empezar a propósito**: requiere macOS + Xcode, inexistentes en este entorno Windows — `npx cap add ios` alcanza el día que haya acceso a una Mac, sin más cambios de código antes.)*

## P3 — Depende de P2

(sin cambios respecto a v3)

- [ ] **Widget de pantalla de inicio (L)** Solo tiene sentido una vez exista la app empaquetada.

## Cómo priorizar dentro de P0

Si hay que elegir por dónde empezar dentro de la sección legal, este orden
minimiza el riesgo más rápido con menos esfuerzo:

1. ~~Casilla de aceptación en Registro + Términos/Privacidad~~ (aunque sea
   una primera versión razonable, no perfecta) — es lo que más rápido
   cierra la exposición básica de "recojo datos sin decirlo". **Hecho.**
2. ~~Confirmar la región del proyecto~~ — una sola consulta al panel, cero
   código. **Hecho: `us-east-1`, se queda ahí.**
3. ~~Borrado de cuenta completo~~ — es la brecha más concreta de las
   encontradas (la cuenta literalmente no se puede borrar hoy). **Hecho.**
4. El resto (purga de borrados lógicos, CAPTCHA, documento de
   credenciales, subencargados, cookies) se puede ir haciendo en paralelo,
   ninguno depende de otro.

## Cómo usar esto con Claude Code

Una casilla por sesión, empezando por lo que quede de P0. Antes de tocar
código, confirmar con `git log`/`git diff` que el estado del repo coincide
con lo que describe el ítem. Marcar la casilla y comitear `BACKLOG.md`
junto con el cambio.
