-- Pruebas de aislamiento entre parejas: confirman que una pareja no puede
-- leer, insertar, editar ni borrar nada de otra pareja, en ninguna de las
-- tablas con contenido (couples, couple_members, couple_dates, memories,
-- moments) ni en el bucket de fotos. Todas las políticas RLS dependen de
-- public.is_couple_member(), así que si algo aquí falla es una señal de
-- que un cambio futuro a esas políticas rompió el aislamiento.
--
-- Cómo correrlas localmente:
--   supabase start
--   supabase test db
--
-- Fixtures montados directamente como "postgres" (superusuario, sin RLS)
-- dentro de esta misma transacción; las aserciones cambian de rol a
-- "authenticated" simulando el JWT de cada usuario, exactamente como lo
-- hace PostgREST con una sesión real.
begin;

create extension if not exists pgtap with schema extensions;

select plan(24);

-- ── Fixtures ────────────────────────────────────────────────────────────
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000a001', 'a1@example.com'),
  ('00000000-0000-0000-0000-00000000a002', 'a2@example.com'),
  ('00000000-0000-0000-0000-00000000b001', 'b1@example.com');

insert into public.couples (id, invite_code, start_date) values
  ('00000000-0000-0000-0000-0000000c0001', 'TESTAAAA', '2024-01-01'),
  ('00000000-0000-0000-0000-0000000c0002', 'TESTBBBB', '2024-02-02');

insert into public.couple_members (couple_id, user_id, display_name) values
  ('00000000-0000-0000-0000-0000000c0001', '00000000-0000-0000-0000-00000000a001', 'A1'),
  ('00000000-0000-0000-0000-0000000c0001', '00000000-0000-0000-0000-00000000a002', 'A2'),
  ('00000000-0000-0000-0000-0000000c0002', '00000000-0000-0000-0000-00000000b001', 'B1');

insert into public.couple_dates (id, couple_id, title, happens_on) values
  ('00000000-0000-0000-0000-00000000d001', '00000000-0000-0000-0000-0000000c0001', 'Fecha de A', '2024-06-01');

insert into public.memories (id, couple_id, title, happened_on) values
  ('00000000-0000-0000-0000-00000000e001', '00000000-0000-0000-0000-0000000c0001', 'Recuerdo de A', '2024-05-01');

insert into public.moments (id, couple_id, name) values
  ('00000000-0000-0000-0000-00000000f001', '00000000-0000-0000-0000-0000000c0001', 'Momento de A');

insert into storage.buckets (id, name, public) values ('photos', 'photos', false)
  on conflict (id) do nothing;
insert into storage.objects (bucket_id, name, owner) values
  ('photos', '00000000-0000-0000-0000-0000000c0001/foto.webp', '00000000-0000-0000-0000-00000000a001'),
  ('photos', '00000000-0000-0000-0000-0000000c0002/foto.webp', '00000000-0000-0000-0000-00000000b001');

-- ── B1 (ajeno a la pareja A) contra los datos de A ─────────────────────
set local role authenticated;
set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-00000000b001","role":"authenticated"}';

select is_empty(
  $$ select 1 from public.couples where id = '00000000-0000-0000-0000-0000000c0001' $$,
  'B1 no puede ver la fila de couples de A'
);
select is_empty(
  $$ select 1 from public.couple_members where couple_id = '00000000-0000-0000-0000-0000000c0001' $$,
  'B1 no puede ver los miembros de A'
);
select is_empty(
  $$ select 1 from public.couple_dates where couple_id = '00000000-0000-0000-0000-0000000c0001' $$,
  'B1 no puede ver las fechas de A'
);
select is_empty(
  $$ select 1 from public.memories where couple_id = '00000000-0000-0000-0000-0000000c0001' $$,
  'B1 no puede ver los recuerdos de A'
);
select is_empty(
  $$ select 1 from public.moments where couple_id = '00000000-0000-0000-0000-0000000c0001' $$,
  'B1 no puede ver los momentos de A'
);
select is_empty(
  $$ select 1 from storage.objects where bucket_id = 'photos' and name like '00000000-0000-0000-0000-0000000c0001/%' $$,
  'B1 no puede ver las fotos de A'
);

select throws_like(
  $$ insert into public.couple_dates (couple_id, title, happens_on)
     values ('00000000-0000-0000-0000-0000000c0001', 'Intrusa', '2024-07-01') $$,
  '%row-level security policy%',
  'B1 no puede insertar una fecha en la pareja de A'
);
select throws_like(
  $$ insert into public.memories (couple_id, title, happened_on)
     values ('00000000-0000-0000-0000-0000000c0001', 'Intruso', '2024-07-01') $$,
  '%row-level security policy%',
  'B1 no puede insertar un recuerdo en la pareja de A'
);
select throws_like(
  $$ insert into public.moments (couple_id, name)
     values ('00000000-0000-0000-0000-0000000c0001', 'Intruso') $$,
  '%row-level security policy%',
  'B1 no puede insertar un momento en la pareja de A'
);
select throws_like(
  $$ insert into storage.objects (bucket_id, name, owner)
     values ('photos', '00000000-0000-0000-0000-0000000c0001/intrusa.webp', '00000000-0000-0000-0000-00000000b001') $$,
  '%row-level security policy%',
  'B1 no puede subir una foto al espacio de A'
);

select is_empty(
  $$ update public.couples set locale = 'en'
     where id = '00000000-0000-0000-0000-0000000c0001' returning 1 $$,
  'B1 no puede editar la pareja de A'
);
select is_empty(
  $$ update public.couple_members set display_name = 'hackeado'
     where couple_id = '00000000-0000-0000-0000-0000000c0001' returning 1 $$,
  'B1 no puede editar los miembros de A'
);
select is_empty(
  $$ update public.couple_dates set title = 'hackeada'
     where id = '00000000-0000-0000-0000-00000000d001' returning 1 $$,
  'B1 no puede editar las fechas de A'
);
select is_empty(
  $$ update public.memories set title = 'hackeado'
     where id = '00000000-0000-0000-0000-00000000e001' returning 1 $$,
  'B1 no puede editar los recuerdos de A'
);
select is_empty(
  $$ update public.moments set name = 'hackeado'
     where id = '00000000-0000-0000-0000-00000000f001' returning 1 $$,
  'B1 no puede editar los momentos de A'
);

select is_empty(
  $$ delete from public.couple_members
     where couple_id = '00000000-0000-0000-0000-0000000c0001' returning 1 $$,
  'B1 no puede borrar miembros de A'
);
select is_empty(
  $$ delete from public.couple_dates
     where id = '00000000-0000-0000-0000-00000000d001' returning 1 $$,
  'B1 no puede borrar las fechas de A'
);
select is_empty(
  $$ delete from public.memories
     where id = '00000000-0000-0000-0000-00000000e001' returning 1 $$,
  'B1 no puede borrar los recuerdos de A'
);
select is_empty(
  $$ delete from public.moments
     where id = '00000000-0000-0000-0000-00000000f001' returning 1 $$,
  'B1 no puede borrar los momentos de A'
);
-- El borrado de storage.objects no pasa por RLS de tabla sino por la
-- Storage API (un trigger bloquea el DELETE directo por SQL para
-- cualquiera, incluido el dueño); por eso el aislamiento de fotos ya
-- quedó cubierto arriba con el SELECT y el INSERT, y aquí en cambio
-- confirmamos el otro lado: B1 sí ve su propia foto.
select isnt_empty(
  $$ select 1 from storage.objects where bucket_id = 'photos' and name like '00000000-0000-0000-0000-0000000c0002/%' $$,
  'B1 sí puede ver una foto de su propia pareja'
);
select is_empty(
  $$ delete from public.couples where id = '00000000-0000-0000-0000-0000000c0001' returning 1 $$,
  'B1 no puede borrar la pareja de A'
);

-- ── Controles positivos: A1 sí ve lo suyo (si esto fallara, las pruebas
--    de arriba estarían "pasando" solo porque RLS bloquea a todo el
--    mundo, no porque aísle correctamente por pareja) ────────────────────
set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-00000000a001","role":"authenticated"}';

select isnt_empty(
  $$ select 1 from public.couple_dates where id = '00000000-0000-0000-0000-00000000d001' $$,
  'A1 sí puede ver las fechas de su propia pareja'
);
select isnt_empty(
  $$ select 1 from public.memories where id = '00000000-0000-0000-0000-00000000e001' $$,
  'A1 sí puede ver los recuerdos de su propia pareja'
);
select isnt_empty(
  $$ select 1 from public.moments where id = '00000000-0000-0000-0000-00000000f001' $$,
  'A1 sí puede ver los momentos de su propia pareja'
);

select * from finish();
rollback;
