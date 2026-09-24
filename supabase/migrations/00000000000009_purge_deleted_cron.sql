-- Cron semanal que invoca la Edge Function purge-deleted (BACKLOG P0
-- legal: "borrado" debe significar borrado real en un plazo razonable, no
-- una fila con deleted_at oculta para siempre).
--
-- Mismo patrón que 00000000000008_push_reminders_cron_vault.sql: la URL y
-- la key se leen de Supabase Vault en cada corrida, no como literales acá,
-- para que la migración siga siendo portable entre proyectos. Los
-- secretos se crean una sola vez por proyecto, fuera de git:
--
--   select vault.create_secret('https://TU-PROYECTO.supabase.co/functions/v1/purge-deleted', 'purge_deleted_url');
--   select vault.create_secret('TU_ANON_KEY', 'purge_deleted_bearer');
--
-- (ver README.md, sección "Edge Functions").
SELECT cron.schedule(
  'purge-deleted-weekly',
  '0 3 * * 0', -- domingos 03:00 UTC
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'purge_deleted_url'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'purge_deleted_bearer')
    ),
    body := '{}'::jsonb
  );
  $$
);
