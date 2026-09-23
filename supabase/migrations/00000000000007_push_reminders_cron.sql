CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

-- Corre todos los días a las 13:00 UTC (punto medio razonable entre husos
-- horarios: no hay una hora perfecta para una pareja que puede estar en
-- continentes distintos) y llama a la Edge Function send-reminders.
--
-- El header usa la anon key (ya es pública: vive en .env.example) solo
-- para que el gateway de Functions acepte la llamada; la función NO usa
-- esa key para leer datos. Adentro arma su propio cliente con
-- SUPABASE_SERVICE_ROLE_KEY, que Supabase inyecta automáticamente en el
-- entorno de toda Edge Function sin que haga falta guardarla a mano en
-- ningún lado (por eso el cron nunca necesita tocar la service_role key).
SELECT cron.schedule(
  'send-push-reminders-daily',
  '0 13 * * *',
  $$
  SELECT net.http_post(
    url := 'https://vgimknxjdxsjalzscxdx.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaW1rbnhqZHhzamFsenNjeGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMzYxODksImV4cCI6MjEwNTYxMjE4OX0.GAEv8LkgRLUaLJ3lJW71Nx5X57Sgm_8oNPeCLa3-i7Y'
    ),
    body := '{}'::jsonb
  );
  $$
);
