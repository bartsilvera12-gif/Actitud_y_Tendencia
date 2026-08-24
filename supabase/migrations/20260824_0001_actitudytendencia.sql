-- ============================================================================
--  Actitud & Tendencia — schema administrable
--  Migración inicial. Idempotente: se puede correr entera desde cero.
--
--  IMPORTANTE: la instancia es compartida. Todo vive en el schema
--  `actitudytendencia`. No se toca `public` ni ningún otro schema.
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS actitudytendencia;

-- ---------------------------------------------------------------------------
--  Funciones auxiliares
-- ---------------------------------------------------------------------------

-- updated_at automático: no dependemos de que el frontend lo mande.
CREATE OR REPLACE FUNCTION actitudytendencia.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- `unaccent` es una extensión que puede no estar disponible en una instancia
-- compartida, así que se traduce el juego de caracteres que usa el catálogo.
CREATE OR REPLACE FUNCTION actitudytendencia.unaccent_fallback(txt text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT translate(
    txt,
    'áàäâãéèëêíìïîóòöôõúùüûñçÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÑÇ',
    'aaaaaeeeeiiiiooooouuuuncAAAAAEEEEIIIIOOOOOUUUUNC'
  );
$$;

-- Slug a partir de un texto: quita acentos, baja a minúsculas y une con guiones.
-- Va después de unaccent_fallback porque la invoca.
CREATE OR REPLACE FUNCTION actitudytendencia.slugify(txt text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT trim(both '-' from
    regexp_replace(
      lower(actitudytendencia.unaccent_fallback(txt)),
      '[^a-z0-9]+', '-', 'g'
    )
  );
$$;

-- ---------------------------------------------------------------------------
--  Administradores
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS actitudytendencia.administradores (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      text NOT NULL,
  rol         text NOT NULL DEFAULT 'admin'
                CHECK (rol IN ('superadmin', 'admin')),
  activo      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
--  Categorías y líneas
-- ---------------------------------------------------------------------------

-- `tema_color` y `flor_key` son CLAVES, no clases de Tailwind. Tailwind v4
-- purga lo que no encuentra en el código, así que las clases viven en TS
-- (src/lib/categories.ts) y la base solo elige cuál usar. Así se pueden crear
-- categorías nuevas desde el panel sin tocar código.
CREATE TABLE IF NOT EXISTS actitudytendencia.categorias (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre              text NOT NULL,
  slug                text NOT NULL UNIQUE,
  descripcion         text,
  imagen_url          text,
  imagen_storage_path text,
  tema_color          text NOT NULL DEFAULT 'salvia'
                        CHECK (tema_color IN ('salvia','menta','lila','rosa','amarillo','dorado')),
  flor_key            text NOT NULL DEFAULT 'tulipanLila',
  orden               integer NOT NULL DEFAULT 0,
  activo              boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS actitudytendencia.lineas (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      text NOT NULL,
  slug        text NOT NULL UNIQUE,
  descripcion text,
  imagen_url  text,
  orden       integer NOT NULL DEFAULT 0,
  activo      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
--  Productos
-- ---------------------------------------------------------------------------

-- precio en bigint: se trabaja en guaraníes, sin decimales. Nada de floats.
CREATE TABLE IF NOT EXISTS actitudytendencia.productos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text NOT NULL UNIQUE,
  nombre          text NOT NULL CHECK (length(trim(nombre)) > 0),
  categoria_id    uuid REFERENCES actitudytendencia.categorias(id) ON DELETE RESTRICT,
  linea_id        uuid REFERENCES actitudytendencia.lineas(id) ON DELETE RESTRICT,
  color           text,
  precio          bigint NOT NULL DEFAULT 0 CHECK (precio >= 0),
  descripcion     text,
  tipo_talle      text NOT NULL DEFAULT 'letra'
                    CHECK (tipo_talle IN ('numerico','letra','unico')),
  nuevo           boolean NOT NULL DEFAULT false,
  destacado       boolean NOT NULL DEFAULT false,
  activo          boolean NOT NULL DEFAULT true,
  mostrar_home    boolean NOT NULL DEFAULT true,
  orden_home      integer NOT NULL DEFAULT 0,
  orden_catalogo  integer NOT NULL DEFAULT 0,
  seo_title       text,
  seo_description text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Talles como filas, no como texto separado por comas.
CREATE TABLE IF NOT EXISTS actitudytendencia.producto_talles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid NOT NULL REFERENCES actitudytendencia.productos(id) ON DELETE CASCADE,
  talle       text NOT NULL,
  orden       integer NOT NULL DEFAULT 0,
  activo      boolean NOT NULL DEFAULT true,
  -- NULL = no se lleva control de inventario. No bloquea la venta.
  stock       integer CHECK (stock IS NULL OR stock >= 0),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (producto_id, talle)
);

CREATE TABLE IF NOT EXISTS actitudytendencia.producto_imagenes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id  uuid NOT NULL REFERENCES actitudytendencia.productos(id) ON DELETE CASCADE,
  url          text NOT NULL,
  storage_path text,
  alt_text     text,
  orden        integer NOT NULL DEFAULT 0,
  principal    boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Una sola imagen principal por producto.
CREATE UNIQUE INDEX IF NOT EXISTS producto_imagenes_una_principal
  ON actitudytendencia.producto_imagenes (producto_id)
  WHERE principal;

-- ---------------------------------------------------------------------------
--  Contenido del home
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS actitudytendencia.secciones_home (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clave            text NOT NULL UNIQUE
                     CHECK (clave IN ('hero','categorias','productos','nuevos_ingresos',
                                      'manifesto','lookbook','redes','whatsapp_cta')),
  eyebrow          text,
  titulo           text,
  titulo_destacado text,
  descripcion      text,
  activo           boolean NOT NULL DEFAULT true,
  orden            integer NOT NULL DEFAULT 0,
  configuracion    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS actitudytendencia.hero_banners (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  etiqueta            text,
  titulo_linea_1      text,
  titulo_destacado_1  text,
  titulo_linea_2      text,
  titulo_destacado_2  text,
  descripcion         text,
  imagen_url          text,
  imagen_storage_path text,
  activo              boolean NOT NULL DEFAULT true,
  orden               integer NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS actitudytendencia.hero_chips (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_id uuid NOT NULL REFERENCES actitudytendencia.hero_banners(id) ON DELETE CASCADE,
  texto   text NOT NULL,
  color   text NOT NULL DEFAULT 'menta'
            CHECK (color IN ('salvia','menta','lila','rosa','amarillo','dorado')),
  orden   integer NOT NULL DEFAULT 0,
  activo  boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS actitudytendencia.manifiesto_valores (
  id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  texto  text NOT NULL,
  color  text NOT NULL DEFAULT 'menta'
           CHECK (color IN ('salvia','menta','lila','rosa','amarillo','dorado')),
  orden  integer NOT NULL DEFAULT 0,
  activo boolean NOT NULL DEFAULT true
);

-- Cada item es una foto propia o la foto de un producto existente.
CREATE TABLE IF NOT EXISTS actitudytendencia.lookbook_items (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id         uuid REFERENCES actitudytendencia.productos(id) ON DELETE SET NULL,
  imagen_url          text,
  imagen_storage_path text,
  orden               integer NOT NULL DEFAULT 0,
  activo              boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lookbook_item_con_origen
    CHECK (producto_id IS NOT NULL OR imagen_url IS NOT NULL)
);

-- ---------------------------------------------------------------------------
--  Configuración y redes
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS actitudytendencia.configuracion_sitio (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Singleton: una sola fila (ver índice único más abajo).
  singleton                boolean NOT NULL DEFAULT true,
  nombre_marca             text NOT NULL DEFAULT 'Actitud & Tendencia',
  logo_url                 text,
  logo_storage_path        text,
  whatsapp_numero          text NOT NULL DEFAULT '595985960203',
  whatsapp_display         text,
  whatsapp_mensaje_general text,
  ubicacion                text,
  seo_title                text,
  seo_description          text,
  seo_keywords             text,
  favicon_url              text,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_solo_digitos CHECK (whatsapp_numero ~ '^[0-9]{8,15}$')
);

CREATE UNIQUE INDEX IF NOT EXISTS configuracion_sitio_singleton
  ON actitudytendencia.configuracion_sitio (singleton);

CREATE TABLE IF NOT EXISTS actitudytendencia.redes_sociales (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo       text NOT NULL
               CHECK (tipo IN ('instagram','facebook','tiktok','whatsapp','otro')),
  nombre     text,
  usuario    text,
  url        text NOT NULL,
  orden      integer NOT NULL DEFAULT 0,
  activo     boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
--  Auditoría
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS actitudytendencia.auditoria (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  accion     text NOT NULL,
  entidad    text NOT NULL,
  entidad_id text,
  datos      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
--  Índices
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS productos_categoria_idx        ON actitudytendencia.productos (categoria_id);
CREATE INDEX IF NOT EXISTS productos_linea_idx            ON actitudytendencia.productos (linea_id);
CREATE INDEX IF NOT EXISTS productos_activo_idx           ON actitudytendencia.productos (activo);
CREATE INDEX IF NOT EXISTS productos_nuevo_idx            ON actitudytendencia.productos (nuevo) WHERE nuevo;
CREATE INDEX IF NOT EXISTS productos_destacado_idx        ON actitudytendencia.productos (destacado) WHERE destacado;
CREATE INDEX IF NOT EXISTS productos_orden_catalogo_idx   ON actitudytendencia.productos (orden_catalogo);
CREATE INDEX IF NOT EXISTS productos_orden_home_idx       ON actitudytendencia.productos (orden_home) WHERE mostrar_home;
CREATE INDEX IF NOT EXISTS producto_imagenes_producto_idx ON actitudytendencia.producto_imagenes (producto_id, orden);
CREATE INDEX IF NOT EXISTS producto_talles_producto_idx   ON actitudytendencia.producto_talles (producto_id, orden);
CREATE INDEX IF NOT EXISTS categorias_slug_idx            ON actitudytendencia.categorias (slug);
CREATE INDEX IF NOT EXISTS categorias_orden_idx           ON actitudytendencia.categorias (orden) WHERE activo;
CREATE INDEX IF NOT EXISTS lineas_slug_idx                ON actitudytendencia.lineas (slug);
CREATE INDEX IF NOT EXISTS lookbook_items_orden_idx       ON actitudytendencia.lookbook_items (orden) WHERE activo;
CREATE INDEX IF NOT EXISTS redes_sociales_orden_idx       ON actitudytendencia.redes_sociales (orden) WHERE activo;
CREATE INDEX IF NOT EXISTS auditoria_created_idx          ON actitudytendencia.auditoria (created_at DESC);

-- ---------------------------------------------------------------------------
--  Triggers de updated_at
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'administradores','categorias','lineas','productos','secciones_home',
    'hero_banners','lookbook_items','configuracion_sitio','redes_sociales'
  ] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON actitudytendencia.%I', t
    );
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON actitudytendencia.%I
         FOR EACH ROW EXECUTE FUNCTION actitudytendencia.set_updated_at()', t
    );
  END LOOP;
END;
$$;

-- ¿El usuario autenticado es admin activo?
--
-- SECURITY DEFINER + search_path fijo: la función lee `administradores`
-- salteando su propio RLS, que es lo que evita la recursión infinita
-- (la policy de administradores necesitaría llamar a esta misma función).
CREATE OR REPLACE FUNCTION actitudytendencia.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = actitudytendencia, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM actitudytendencia.administradores a
    WHERE a.user_id = auth.uid()
      AND a.activo
  );
$$;

-- ---------------------------------------------------------------------------
--  Row Level Security
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'administradores','categorias','lineas','productos','producto_talles',
    'producto_imagenes','secciones_home','hero_banners','hero_chips',
    'manifiesto_valores','lookbook_items','configuracion_sitio',
    'redes_sociales','auditoria'
  ] LOOP
    EXECUTE format('ALTER TABLE actitudytendencia.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE actitudytendencia.%I FORCE ROW LEVEL SECURITY', t);
  END LOOP;
END;
$$;

-- Lectura pública: solo lo activo/publicado. Nunca escritura.
DROP POLICY IF EXISTS lectura_publica ON actitudytendencia.categorias;
CREATE POLICY lectura_publica ON actitudytendencia.categorias
  FOR SELECT TO anon, authenticated USING (activo);

DROP POLICY IF EXISTS lectura_publica ON actitudytendencia.lineas;
CREATE POLICY lectura_publica ON actitudytendencia.lineas
  FOR SELECT TO anon, authenticated USING (activo);

DROP POLICY IF EXISTS lectura_publica ON actitudytendencia.productos;
CREATE POLICY lectura_publica ON actitudytendencia.productos
  FOR SELECT TO anon, authenticated USING (activo);

-- Talles e imágenes: visibles solo si su producto lo está.
DROP POLICY IF EXISTS lectura_publica ON actitudytendencia.producto_talles;
CREATE POLICY lectura_publica ON actitudytendencia.producto_talles
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM actitudytendencia.productos p
                 WHERE p.id = producto_id AND p.activo));

DROP POLICY IF EXISTS lectura_publica ON actitudytendencia.producto_imagenes;
CREATE POLICY lectura_publica ON actitudytendencia.producto_imagenes
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM actitudytendencia.productos p
                 WHERE p.id = producto_id AND p.activo));

DROP POLICY IF EXISTS lectura_publica ON actitudytendencia.secciones_home;
CREATE POLICY lectura_publica ON actitudytendencia.secciones_home
  FOR SELECT TO anon, authenticated USING (activo);

DROP POLICY IF EXISTS lectura_publica ON actitudytendencia.hero_banners;
CREATE POLICY lectura_publica ON actitudytendencia.hero_banners
  FOR SELECT TO anon, authenticated USING (activo);

DROP POLICY IF EXISTS lectura_publica ON actitudytendencia.hero_chips;
CREATE POLICY lectura_publica ON actitudytendencia.hero_chips
  FOR SELECT TO anon, authenticated
  USING (activo AND EXISTS (SELECT 1 FROM actitudytendencia.hero_banners h
                            WHERE h.id = hero_id AND h.activo));

DROP POLICY IF EXISTS lectura_publica ON actitudytendencia.manifiesto_valores;
CREATE POLICY lectura_publica ON actitudytendencia.manifiesto_valores
  FOR SELECT TO anon, authenticated USING (activo);

DROP POLICY IF EXISTS lectura_publica ON actitudytendencia.lookbook_items;
CREATE POLICY lectura_publica ON actitudytendencia.lookbook_items
  FOR SELECT TO anon, authenticated USING (activo);

DROP POLICY IF EXISTS lectura_publica ON actitudytendencia.redes_sociales;
CREATE POLICY lectura_publica ON actitudytendencia.redes_sociales
  FOR SELECT TO anon, authenticated USING (activo);

-- La configuración del sitio es pública por naturaleza (WhatsApp, SEO, logo).
DROP POLICY IF EXISTS lectura_publica ON actitudytendencia.configuracion_sitio;
CREATE POLICY lectura_publica ON actitudytendencia.configuracion_sitio
  FOR SELECT TO anon, authenticated USING (true);

-- Escritura: solo administradores activos. Una policy ALL por tabla.
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'categorias','lineas','productos','producto_talles','producto_imagenes',
    'secciones_home','hero_banners','hero_chips','manifiesto_valores',
    'lookbook_items','configuracion_sitio','redes_sociales'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS admin_total ON actitudytendencia.%I', t);
    EXECUTE format(
      'CREATE POLICY admin_total ON actitudytendencia.%I
         FOR ALL TO authenticated
         USING (actitudytendencia.is_admin())
         WITH CHECK (actitudytendencia.is_admin())', t
    );
  END LOOP;
END;
$$;

-- Administradores: cada uno se ve a sí mismo; los superadmin ven y gestionan
-- a todos. Nadie se puede dar de alta solo.
DROP POLICY IF EXISTS admin_se_ve ON actitudytendencia.administradores;
CREATE POLICY admin_se_ve ON actitudytendencia.administradores
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR actitudytendencia.is_admin());

DROP POLICY IF EXISTS superadmin_gestiona ON actitudytendencia.administradores;
CREATE POLICY superadmin_gestiona ON actitudytendencia.administradores
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM actitudytendencia.administradores a
                 WHERE a.user_id = auth.uid() AND a.activo AND a.rol = 'superadmin'))
  WITH CHECK (EXISTS (SELECT 1 FROM actitudytendencia.administradores a
                      WHERE a.user_id = auth.uid() AND a.activo AND a.rol = 'superadmin'));

-- Auditoría: los admin leen e insertan; nadie edita ni borra.
DROP POLICY IF EXISTS admin_lee ON actitudytendencia.auditoria;
CREATE POLICY admin_lee ON actitudytendencia.auditoria
  FOR SELECT TO authenticated USING (actitudytendencia.is_admin());

DROP POLICY IF EXISTS admin_inserta ON actitudytendencia.auditoria;
CREATE POLICY admin_inserta ON actitudytendencia.auditoria
  FOR INSERT TO authenticated WITH CHECK (actitudytendencia.is_admin());

-- ---------------------------------------------------------------------------
--  Grants
--
--  RLS es la capa real de autorización; los grants solo habilitan el acceso
--  al schema para que PostgREST pueda resolver las tablas.
-- ---------------------------------------------------------------------------

GRANT USAGE ON SCHEMA actitudytendencia TO anon, authenticated, service_role;

GRANT SELECT ON ALL TABLES IN SCHEMA actitudytendencia TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA actitudytendencia TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA actitudytendencia TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA actitudytendencia TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA actitudytendencia TO anon, authenticated, service_role;

-- Que las tablas futuras hereden los mismos permisos.
ALTER DEFAULT PRIVILEGES IN SCHEMA actitudytendencia
  GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA actitudytendencia
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA actitudytendencia
  GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA actitudytendencia
  GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA actitudytendencia
  GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role;

-- Endurecimiento: anon no necesita ni leer estas dos tablas. RLS ya devuelve
-- 0 filas, pero se le quita el privilegio para que PostgREST ni las exponga.
REVOKE SELECT ON actitudytendencia.administradores FROM anon;
REVOKE SELECT ON actitudytendencia.auditoria       FROM anon;
