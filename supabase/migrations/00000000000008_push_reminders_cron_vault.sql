-- Reemplaza el cron de 00000000000007, que tenía la URL de la función y la
-- anon key como literales en el SQL (acoplaba la migración a un proyecto
-- Supabase específico: clonar el repo y aplicar migraciones contra un
-- proyecto propio hacía que el cron llamara a la función de otro).
--
-- Ahora ambos valores se leen de Supabase Vault en cada corrida, por nombre
-- de secreto, así que la migración queda portable. Los secretos NO se crean
-- acá (eso metería el mismo valor real en el historial de git): se crean
-- una sola vez por proyecto, fuera del control de versiones, con:
--
--   select vault.create_secret('https://TU-PROYECTO.supabase.co/functions/v1/send-reminders', 'send_reminders_url');
--   select vault.create_secret('TU_ANON_KEY', 'send_reminders_bearer');
--
-- (ver README.md, sección "Notificaciones push").
SELECT cron.unschedule('send-push-reminders-daily');

SELECT cron.schedule(
  'send-push-reminders-daily',
  '0 13 * * *',
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'send_reminders_url'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'send_reminders_bearer')
    ),
    body := '{}'::jsonb
  );
  $$
);
