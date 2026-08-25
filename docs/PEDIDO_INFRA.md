# Un solo paso pendiente de infraestructura

## Qué ya está hecho

La migración `20260825_0003_expose_schema.sql` **ya agregó** `actitudytendencia`
a `pgrst.db_schemas` del rol `authenticator`, appendeando al final sin pisar a
los demás proyectos de la instancia.

Verificado antes y después: **108 entradas, ningún schema perdido**, solo se
sumó el nuestro.

## Qué falta

PostgREST todavía no recargó esa configuración.

En este servidor el acceso a la base es solo por **pgbouncer (puerto 6432, modo
transacción)**, que no entrega `LISTEN/NOTIFY`, y el puerto directo 5432 no está
expuesto. Por eso el `notify pgrst, 'reload config'` de la migración no llega al
proceso de PostgREST, aunque haya conexiones escuchando ese canal.

Es exactamente lo mismo que le pasó a Panel_Hito, documentado en
`Panel_Hito/README_SUPABASE.md`.

Hasta que se resuelva, la API responde `PGRST106 Invalid schema:
actitudytendencia` y el sitio cae a su contenido de respaldo.

---

## El pedido

Copiá esto y pasáselo a quien administra `api.neura.com.py`.

---

**Asunto: reiniciar PostgREST en api.neura.com.py**

Hola. Necesitamos que PostgREST recargue su configuración. **No hay que editar
ninguna variable**: el cambio ya está aplicado en la base, en
`pgrst.db_schemas` del rol `authenticator`, agregado al final de la lista sin
tocar los demás schemas.

Alcanza con una de estas dos:

```bash
# a) Reiniciar el contenedor de PostgREST (recomendado)
docker compose restart rest
```

```bash
# b) O mandar el NOTIFY desde una conexión directa, sin pasar por pgbouncer
psql "postgresql://postgres:***@127.0.0.1:5432/postgres" \
  -c "notify pgrst, 'reload config';"
```

Para verificar (tiene que devolver **200**, no 406):

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "apikey: <ANON_KEY>" -H "Accept-Profile: actitudytendencia" \
  "https://api.neura.com.py/rest/v1/productos?select=slug&limit=1"
```

No hace falta cambiar nada más: ni variables de entorno, ni la lista de
schemas, ni código.

**Aparte:** también necesitamos un bucket de Storage llamado
`actitudytendencia`, público. Si tenemos acceso al panel lo creamos nosotros.

Gracias.

---

## Comprobar desde acá cuándo quedó listo

```bash
curl -s "https://api.neura.com.py/rest/v1/productos?select=nombre&limit=1" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Accept-Profile: actitudytendencia"
```

Devuelve un producto cuando PostgREST ya recargó.
