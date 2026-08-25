#!/usr/bin/env bash
# Comprueba qué schemas responden en PostgREST.
#
# Correlo ANTES de tocar PGRST_DB_SCHEMAS y otra vez DESPUÉS del reinicio:
# si la cantidad de schemas expuestos no baja y aparece actitudytendencia,
# el cambio salió bien y ningún proyecto quedó afuera.
#
#   ./supabase/verificar-schemas.sh antes
#   ...aplicás el cambio y reiniciás PostgREST...
#   ./supabase/verificar-schemas.sh despues
#
# Necesita: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el entorno o en .env

set -u

MOMENTO="${1:-ahora}"
DIR="$(cd "$(dirname "$0")" && pwd)"
SALIDA="$DIR/.schemas-$MOMENTO.txt"

# Toma las credenciales del .env si están ahí.
if [ -f "$DIR/../.env" ]; then
  URL=$(grep '^VITE_SUPABASE_URL=' "$DIR/../.env" | cut -d= -f2-)
  KEY=$(grep '^VITE_SUPABASE_ANON_KEY=' "$DIR/../.env" | cut -d= -f2-)
fi
URL="${VITE_SUPABASE_URL:-${URL:-}}"
KEY="${VITE_SUPABASE_ANON_KEY:-${KEY:-}}"

if [ -z "$URL" ] || [ -z "$KEY" ]; then
  echo "Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY."
  exit 1
fi

echo "Consultando $URL …"

# Pide un schema inexistente: PostgREST responde con la lista de los expuestos.
RESP=$(curl -s --max-time 25 "$URL/rest/v1/x?select=x&limit=1" \
  -H "apikey: $KEY" -H "Accept-Profile: __no_existe__")

if echo "$RESP" | grep -q 'PGRST106'; then
  echo "$RESP" \
    | sed 's/.*Only the following schemas are exposed: //; s/".*//' \
    | tr ',' '\n' | tr -d ' ' | sed '/^$/d' | sort -u > "$SALIDA"
else
  echo "Respuesta inesperada del servidor:"
  echo "$RESP" | head -c 300
  exit 1
fi

TOTAL=$(wc -l < "$SALIDA")
echo "Schemas expuestos: $TOTAL  ->  guardado en $SALIDA"

if grep -qx 'actitudytendencia' "$SALIDA"; then
  echo "actitudytendencia: EXPUESTO"
else
  echo "actitudytendencia: todavía no"
fi

# Si existe la foto previa, se comparan.
PREVIO="$DIR/.schemas-antes.txt"
if [ "$MOMENTO" = "despues" ] && [ -f "$PREVIO" ]; then
  echo
  echo "=== Comparación con el estado anterior ==="
  PERDIDOS=$(comm -23 "$PREVIO" "$SALIDA")
  NUEVOS=$(comm -13 "$PREVIO" "$SALIDA")

  if [ -z "$PERDIDOS" ]; then
    echo "Ningún schema dejó de estar expuesto. Ningún proyecto se rompió."
  else
    echo "ATENCIÓN — estos schemas YA NO están expuestos:"
    echo "$PERDIDOS" | sed 's/^/  - /'
    echo "Restaurá el valor anterior de PGRST_DB_SCHEMAS y reiniciá."
  fi

  [ -n "$NUEVOS" ] && { echo "Se agregaron:"; echo "$NUEVOS" | sed 's/^/  + /'; }
fi
