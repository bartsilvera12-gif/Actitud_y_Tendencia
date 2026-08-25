-- ============================================================================
--  Actitud & Tendencia · Exponer el schema `actitudytendencia` en PostgREST
--
--  La instancia es compartida: PostgREST toma su configuración del rol
--  `authenticator` en la propia base, así que esto se aplica por SQL, sin
--  tocar el servidor ni reiniciar contenedores.
--
--  APPENDEA a la lista existente. Nunca la reescribe: si se pisara, los demás
--  proyectos de la instancia dejarían de responder.
--
--  Idempotente: correrlo dos veces no duplica el schema.
--  Mismo patrón que Panel_Hito/supabase/migrations/0003_expose_schema.sql.
-- ============================================================================

do $$
declare
  actual text;
  nuevo  text;
begin
  select (regexp_match(array_to_string(rolconfig, E'\n'), 'pgrst\.db_schemas=([^\n]*)'))[1]
    into actual
  from pg_roles
  where rolname = 'authenticator';

  if actual is null then
    -- Sin configuración previa. En esta instancia no debería pasar; queda
    -- como default seguro para un entorno limpio.
    nuevo := 'public, storage, graphql_public, actitudytendencia';
  elsif (',' || replace(actual, ' ', '') || ',') like '%,actitudytendencia,%' then
    nuevo := actual;  -- ya estaba: no se toca
    raise notice 'actitudytendencia ya estaba expuesto';
  else
    nuevo := actual || ',actitudytendencia';
  end if;

  execute format('alter role authenticator set pgrst.db_schemas = %L', nuevo);
  raise notice 'pgrst.db_schemas => % schemas', array_length(string_to_array(nuevo, ','), 1);
end $$;

-- Recarga la configuración de PostgREST sin reiniciar el servicio.
notify pgrst, 'reload config';

-- Verificación:
--   select (regexp_match(array_to_string(rolconfig, E'\n'), 'pgrst\.db_schemas=([^\n]*)'))[1]
--   from pg_roles where rolname = 'authenticator';
