-- ============================================================================
--  Actitud & Tendencia · Storage
--
--  Bucket `actitudytendencia`, público para lectura, escritura solo para
--  administradores activos (reusa actitudytendencia.is_admin()).
--
--  IMPORTANTE: `storage.objects` es COMPARTIDA por toda la instancia. Cada
--  policy va filtrada por `bucket_id` y con el prefijo `ayt_` en el nombre.
--  Solo se dropean las propias: nunca las de otros proyectos.
--
--  Idempotente.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'actitudytendencia', 'actitudytendencia', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Lectura pública: las fotos del catálogo se ven sin iniciar sesión.
drop policy if exists ayt_media_lectura_publica on storage.objects;
create policy ayt_media_lectura_publica on storage.objects
  for select
  using (bucket_id = 'actitudytendencia');

-- Subir: solo administradores activos.
drop policy if exists ayt_media_admin_insert on storage.objects;
create policy ayt_media_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'actitudytendencia' and actitudytendencia.is_admin());

-- Reemplazar (upsert de una foto existente): solo administradores activos.
drop policy if exists ayt_media_admin_update on storage.objects;
create policy ayt_media_admin_update on storage.objects
  for update to authenticated
  using      (bucket_id = 'actitudytendencia' and actitudytendencia.is_admin())
  with check (bucket_id = 'actitudytendencia' and actitudytendencia.is_admin());

-- Borrar: solo administradores activos.
drop policy if exists ayt_media_admin_delete on storage.objects;
create policy ayt_media_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'actitudytendencia' and actitudytendencia.is_admin());

-- `is_admin()` es SECURITY DEFINER y vive en nuestro schema: hay que dejar que
-- el rol de las policies la pueda ejecutar.
grant usage on schema actitudytendencia to authenticated, anon;
grant execute on function actitudytendencia.is_admin() to authenticated, anon;

-- Estructura de carpetas dentro del bucket:
--   productos/<producto_uuid>/  categorias/  hero/  lookbook/  brand/
