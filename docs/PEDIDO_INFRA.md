# Pedido para quien administra `api.neura.com.py`

Copiá este texto y pasáselo a quien administra el servidor. Está escrito para
que pueda actuar sin conocer el proyecto.

---

**Asunto: exponer el schema `actitudytendencia` en PostgREST**

Hola. Necesitamos que el schema `actitudytendencia` quede expuesto en la API de
`api.neura.com.py`. El schema y sus tablas ya están creados; lo único que falta
es agregarlo a `PGRST_DB_SCHEMAS` y reiniciar PostgREST.

**Por qué no lo hicimos nosotros:** esa variable es compartida por todos los
proyectos de la instancia. Si se guarda una lista incompleta, los schemas que
falten dejan de responder y se caen sitios de otros clientes. Preferimos que lo
haga quien administra el servidor.

**Qué hay que hacer**

1. Ver el valor actual de `PGRST_DB_SCHEMAS` en el servicio de PostgREST y
   **guardarlo aparte** (plan de vuelta atrás).

2. Agregar `,actitudytendencia` **al final** del valor existente. No reescribir
   la lista: el resto tiene que quedar intacto.

3. Reiniciar únicamente el contenedor de PostgREST.

**Cómo verificar que salió bien**

```bash
curl -s "https://api.neura.com.py/rest/v1/productos?select=nombre&limit=1" \
  -H "apikey: <ANON_KEY>" \
  -H "Accept-Profile: actitudytendencia"
```

Debe devolver un producto en JSON. Si devuelve `PGRST106`, el valor no se
aplicó o falta reiniciar.

Para confirmar que ningún otro proyecto quedó afuera, pedir la lista de
expuestos y comparar la cantidad con la de antes del cambio:

```bash
curl -s "https://api.neura.com.py/rest/v1/x?select=x" \
  -H "apikey: <ANON_KEY>" -H "Accept-Profile: __no_existe__"
```

La respuesta enumera todos los schemas expuestos. Antes del cambio eran **105
distintos**; después tienen que ser esos 105 más `actitudytendencia`.

**Vuelta atrás:** restaurar el valor guardado en el punto 1 y reiniciar. La
variable solo indica qué schemas publica la API: no toca datos ni bases.

**Aparte:** también necesitamos un bucket de Storage llamado
`actitudytendencia`, público. Eso quizás lo podamos crear nosotros desde el
panel de Supabase si tenemos acceso; avisanos si preferís hacerlo vos.

Gracias.

---

## Notas para nosotros (no enviar)

- El valor completo y actualizado está en `supabase/PGRST_DB_SCHEMAS.txt`.
  **Regenerarlo antes de pasarlo** si pasaron días: ya cambió una vez entre que
  lo generamos y lo fuimos a usar.
- `supabase/verificar-schemas.sh antes` / `despues` compara automáticamente y
  avisa si algún schema quedó afuera. Se corre desde nuestra máquina, no hace
  falta acceso al servidor.
- La lista trae `abhuevos` y `charme` repetidos. Es inofensivo y no es nuestro:
  no lo tocamos.
