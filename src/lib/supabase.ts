import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Schema propio del proyecto. Nada vive en `public`. */
export const SCHEMA =
  (import.meta.env.VITE_SUPABASE_SCHEMA as string | undefined) ??
  "actitudytendencia";

/**
 * Si faltan las variables no reventamos la app: el sitio público cae a su
 * contenido de respaldo y el panel muestra el error. Es preferible a una
 * pantalla en blanco durante un deploy mal configurado.
 */
export const supabaseConfigurado = Boolean(url && anonKey);

if (!supabaseConfigurado && import.meta.env.DEV) {
  console.warn(
    "[supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. " +
      "El sitio usa el contenido de respaldo. Ver docs/SETUP_ADMIN.md"
  );
}

export const supabase = createClient(
  url ?? "http://localhost",
  anonKey ?? "anon",
  {
    // Todas las consultas apuntan al schema del proyecto sin repetirlo
    // en cada llamada.
    db: { schema: SCHEMA },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // La sesión del panel vive en su propia clave, para no pisar nada.
      storageKey: "ayt.auth",
    },
  }
);
