-- couple_dates/memories/moments están en la publicación de Realtime del
-- proyecto real (activado desde el dashboard; nada en el código todavía
-- se suscribe a esto, pero lo versionamos para que el esquema se
-- reproduzca completo).

alter publication supabase_realtime add table public.couple_dates;
alter publication supabase_realtime add table public.memories;
alter publication supabase_realtime add table public.moments;
