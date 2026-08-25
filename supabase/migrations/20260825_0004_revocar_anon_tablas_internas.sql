-- ============================================================================
--  anon no necesita leer estas dos tablas.
--
--  RLS ya devuelve 0 filas, pero conviene que PostgREST ni siquiera las
--  exponga: menos superficie y menos información sobre la estructura interna.
--
--  Se reaplica porque un GRANT masivo sobre todas las tablas del schema
--  (por ejemplo al reconfigurar permisos) vuelve a otorgar este privilegio.
-- ============================================================================

REVOKE SELECT ON actitudytendencia.administradores FROM anon;
REVOKE SELECT ON actitudytendencia.auditoria       FROM anon;

-- Que un futuro GRANT por defecto tampoco se las dé.
ALTER DEFAULT PRIVILEGES IN SCHEMA actitudytendencia REVOKE SELECT ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA actitudytendencia GRANT SELECT ON TABLES TO anon;

NOTIFY pgrst, 'reload schema';
