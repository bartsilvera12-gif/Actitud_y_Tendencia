# Panel de administración — puesta en marcha

El sitio público y el panel `/admin` leen y escriben en el schema
`actitudytendencia` de Supabase. Nada de este proyecto vive en `public`.

---

## 1. Variables de entorno

Crear un `.env` en la raíz (ya está en `.gitignore`):

```env
VITE_SUPABASE_URL=https://api.neura.com.py
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_SUPABASE_SCHEMA=actitudytendencia
```

En Vercel, cargar las mismas tres en **Settings → Environment Variables**.

> Solo la `anon key`. El `service_role` **nunca** va al frontend: saltea RLS y
> quien lo obtenga puede leer y borrar cualquier tabla.

---

## 2. Migraciones

```bash
psql "$DATABASE_URL" -f supabase/migrations/20260824_0001_actitudytendencia.sql
psql "$DATABASE_URL" -f supabase/seed_productos.sql
psql "$DATABASE_URL" -f supabase/seed_contenido.sql
```

La migración es idempotente: se puede correr de nuevo sin romper nada.

`seed_productos.sql` está **generado** a partir de `src/data/products.ts`; no
editarlo a mano.

---

## 3. Exponer el schema en PostgREST — **paso obligatorio**

Crear el schema **no** lo publica en la API. Sin esto, el frontend recibe
`404` en todas las consultas.

Esta instancia es self-hosted, así que hay que editar la variable de entorno
del contenedor de PostgREST:

```env
PGRST_DB_SCHEMAS=public,storage,graphql_public,actitudytendencia
```

y reiniciar el servicio. Para verificar que quedó expuesto:

```bash
curl -s "$VITE_SUPABASE_URL/rest/v1/productos?select=nombre&limit=1" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Accept-Profile: actitudytendencia"
```

Debe devolver JSON con un producto, no un error.

En Supabase Cloud el equivalente es **Settings → API → Exposed schemas**.

---

## 4. Storage

Crear un bucket **público** llamado `actitudytendencia` con esta estructura:

```
actitudytendencia/
  productos/<producto_uuid>/<archivo>.webp
  categorias/
  hero/
  lookbook/
  brand/
```

Formatos aceptados: `jpg`, `jpeg`, `png`, `webp`.

Las fotos que ya existen siguen sirviéndose desde `/productos/...` del repo;
solo las nuevas van a Storage. Conviven sin problema.

---

## 5. Primer administrador

No hay registro público de administradores: se dan de alta a mano.

1. Crear el usuario en **Authentication → Users** de Supabase.
2. Copiar su UUID.
3. Insertarlo:

```sql
INSERT INTO actitudytendencia.administradores (user_id, nombre, rol, activo)
VALUES ('UUID_DEL_USUARIO', 'Administrador', 'superadmin', true);
```

Roles: `superadmin` (gestiona otros administradores) y `admin`.

Un usuario autenticado que **no** figure en esta tabla, o que tenga
`activo = false`, no puede entrar al panel ni modificar datos: lo impide RLS
en la base, no solo el frontend.

---

## 6. Modelo de seguridad

| Rol | Puede |
|---|---|
| `anon` | Leer productos, categorías, líneas, secciones y redes **activos**. Nada más. |
| `authenticated` sin ser admin | Lo mismo que `anon`. Sus escrituras no afectan ninguna fila. |
| `authenticated` + admin activo | CRUD completo sobre el contenido. |

RLS está **habilitado y forzado** en las 14 tablas. La autorización vive en la
base: ocultar botones en React no alcanza y no es de lo que dependemos.

`administradores` y `auditoria` no son legibles por `anon` ni siquiera vacías.

---

## 7. Verificación rápida

```sql
-- RLS activo en todas las tablas
SELECT relname, relrowsecurity, relforcerowsecurity
FROM pg_class WHERE relnamespace = 'actitudytendencia'::regnamespace AND relkind = 'r';

-- anon no puede escribir
SET ROLE anon;
INSERT INTO actitudytendencia.productos (slug, nombre) VALUES ('x','X'); -- debe fallar
RESET ROLE;
```
