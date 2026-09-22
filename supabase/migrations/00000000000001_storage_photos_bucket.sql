-- Bucket privado para las fotos de recuerdos/momentos y su política de
-- acceso: cada archivo vive bajo "<couple_id>/...", así que solo los
-- miembros de esa pareja pueden leer/escribir/borrar sus propias fotos.
-- Reconstruido a mano a partir de `storage.buckets`/`storage.objects` del
-- proyecto real (storage_couple_id() y is_couple_member() ya están
-- definidas en 00000000000000_baseline.sql).

insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

create policy "photos_rw" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'photos'
    and public.is_couple_member(public.storage_couple_id(name))
  )
  with check (
    bucket_id = 'photos'
    and public.is_couple_member(public.storage_couple_id(name))
  );
