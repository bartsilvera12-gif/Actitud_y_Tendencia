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
`PGRST106 Invalid schema` en todas las consultas.

En esta instancia self-hosted PostgREST lee su configuración del rol
`authenticator` **dentro de la propia base**, así que se resuelve por SQL, sin
tocar el servidor ni reiniciar contenedores:

```bash
psql "$DATABASE_URL" -f supabase/migrations/20260825_0003_expose_schema.sql
```

La migración **appendea** a la lista existente y nunca la reescribe. Es
importante: la instancia es compartida con más de cien schemas de otros
clientes y pisar la lista los sacaría a todos de la API.

Para verificar:

```bash
curl -s "$VITE_SUPABASE_URL/rest/v1/productos?select=nombre&limit=1" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Accept-Profile: actitudytendencia"
```

Debe devolver JSON con un producto, no un error.

En Supabase Cloud el equivalente es **Settings → API → Exposed schemas**.

---

## 4. Storage

```bash
psql "$DATABASE_URL" -f supabase/migrations/20260825_0005_storage.sql
```

Crea el bucket público `actitudytendencia` (5 MB por archivo, solo
`jpeg`/`png`/`webp`) y sus policies sobre `storage.objects`: lectura pública,
escritura y borrado solo para administradores activos.

`storage.objects` es una tabla **compartida por toda la instancia**. Por eso
cada policy filtra por `bucket_id` y lleva el prefijo `ayt_`, y la migración
solo dropea las propias.

Estructura de carpetas:

```
actitudytendencia/
  productos/<producto_uuid>/<archivo>.webp
  categorias/    hero/    lookbook/    brand/
```

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

---

## 8. Estado de la verificación

Verificado con el schema expuesto y el bucket creado, ejecutando contra la base
real — no por lectura de código.

**Autorización (20 pruebas):** el administrador real puede escribir en las 13
tablas de contenido; un autenticado que no es admin no modifica ninguna fila;
`anon` solo lee lo activo. `administradores` y `auditoria` responden 401 a
`anon`, no una lista vacía.

**Reglas de negocio:** el borrado en cascada limpia talles e imágenes, el
CHECK rechaza precios negativos, el índice único impide dos portadas por
producto, el CHECK del WhatsApp rechaza letras, el índice singleton impide una
segunda fila de configuración y el trigger actualiza `updated_at`.

**Ciclo completo desde el panel:** login en `/admin`; alta de un producto que
apareció en la web pública **sin volver a desplegar**; desactivarlo lo sacó del
sitio; eliminarlo lo borró junto con sus talles e imágenes.

**Storage (7 pruebas):** `anon` no puede subir ni borrar; el administrador sí;
la lectura pública funciona sin sesión; un `text/plain` es rechazado por el
bucket. Desde el panel: subir, reordenar, marcar portada y eliminar — al
eliminar, el archivo desaparece también del bucket, sin quedar huérfano.

**Contenido:** ocultar una sección la saca del home y del menú; editar el
número de WhatsApp cambió los 3 enlaces del sitio en vivo.

### Bugs encontrados y corregidos

1. La policy `superadmin_gestiona` consultaba `administradores` dentro de una
   policy de esa misma tabla → `infinite recursion detected in policy`. Como
   el login verifica ahí si el usuario es administrador, **nadie habría podido
   entrar al panel**. Corregido en
   `20260824_0002_fix_recursion_administradores.sql` con `is_superadmin()`
   SECURITY DEFINER.
2. Unos `GRANT` amplios aplicados por fuera de estas migraciones devolvieron a
   `anon` el `SELECT` sobre `administradores` y `auditoria` (HTTP 200 en vez
   de 401; RLS igual devolvía `[]`, así que no hubo filtración). Revertido en
   `20260825_0004_revocar_anon_tablas_internas.sql`.
3. Ocultar una sección desde el panel la sacaba de la página pero **dejaba su
   ítem en el menú**, apuntando a un ancla inexistente. El menú ahora se filtra
   por las secciones visibles.

### Pendiente

- La auditoría registra altas, bajas y ediciones, pero no las operaciones sobre
  fotos (subir, reordenar, portada, eliminar).
