# Exponer `actitudytendencia` en PostgREST — paso a paso

La instancia `api.neura.com.py` es **compartida**: hay más de 100 proyectos en
el mismo servidor, cada uno en su schema. La variable `PGRST_DB_SCHEMAS` es una
lista única para todos. Si se guarda mal, los proyectos que falten en esa lista
dejan de responder.

Por eso: **el cambio es agregar un nombre al final, nunca reescribir la lista
de memoria.**

> Los proyectos no se mezclan entre sí. Cada schema tiene sus propias tablas y
> su propio RLS; exponerlos en la misma lista solo los hace visibles en la API,
> no los conecta. Los nombres repetidos que hay hoy en la lista (`abhuevos`,
> `charme`) son inofensivos: PostgREST la lee como un conjunto.

---

## Paso 1 — Tomar la foto del estado actual

Desde la carpeta del proyecto:

```bash
bash supabase/verificar-schemas.sh antes
```

Guarda en `supabase/.schemas-antes.txt` la lista de lo que responde **hoy**.
Sirve para comparar después y probar que no se rompió nada.

---

## Paso 2 — Copiar el valor exacto

```bash
cat supabase/PGRST_DB_SCHEMAS.txt
```

Es **una sola línea**, sin espacios ni saltos. Son los schemas que el servidor
reporta ahora mismo más `actitudytendencia` al final.

> Si pasaron días desde que se generó, regeneralo antes de usarlo: pudieron
> haberse dado de alta proyectos nuevos y aplicar un valor viejo los daría de
> baja.

---

## Paso 3 — Guardar el valor anterior por las dudas

Antes de tocar nada, copiá a un archivo el valor que tiene hoy la variable en
el servidor. Es el plan de vuelta atrás si algo sale mal.

---

## Paso 4 — Aplicar el cambio

Dónde se edita depende de cómo esté desplegado Supabase:

**Docker Compose** — en el `docker-compose.yml`, servicio `rest`:

```yaml
rest:
  environment:
    PGRST_DB_SCHEMAS: "<pegar acá el contenido del archivo>"
```

**Variables de entorno / archivo `.env` del servidor:**

```env
PGRST_DB_SCHEMAS=<pegar acá el contenido del archivo>
```

Reiniciar **solo PostgREST**, no toda la instancia:

```bash
docker compose restart rest
```

---

## Paso 5 — Verificar

```bash
bash supabase/verificar-schemas.sh despues
```

Compara contra la foto del paso 1 y avisa:

- **"Ningún schema dejó de estar expuesto"** → salió bien.
- **"ATENCIÓN — estos schemas YA NO están expuestos"** → falta alguno.
  Restaurá el valor del paso 3, reiniciá, y volvé a intentar con el archivo
  regenerado.

Y comprobación directa del nuestro:

```bash
curl -s "$VITE_SUPABASE_URL/rest/v1/productos?select=nombre&limit=1" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Accept-Profile: actitudytendencia"
```

Tiene que devolver un producto. Si devuelve `PGRST106`, el valor no se aplicó o
falta reiniciar.

---

## Paso 6 — El bucket de Storage

Aparte de PostgREST, hace falta un bucket **público** llamado
`actitudytendencia`. Sin él, subir fotos desde el panel falla con
"No existe el bucket".

Se crea desde el panel de Supabase, en **Storage → New bucket**, marcando la
opción de público.

---

## Si algo sale mal

El cambio es reversible: restaurar el valor anterior de `PGRST_DB_SCHEMAS` y
reiniciar PostgREST deja todo como estaba. No se toca ninguna base de datos ni
ningún dato: `PGRST_DB_SCHEMAS` solo dice qué schemas publica la API.
