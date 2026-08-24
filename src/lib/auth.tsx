import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseConfigurado } from "@/lib/supabase";
import type { FilaAdministrador } from "@/types/database";

/**
 * Sesión del panel.
 *
 * Estar autenticado no alcanza: el usuario tiene que figurar en
 * `administradores` con `activo = true`. Esa verificación se hace acá para la
 * UI, pero quien realmente manda es RLS en la base — ocultar rutas en React
 * no protege nada por sí solo.
 */
export type EstadoAdmin =
  | "cargando"
  | "sin-sesion"
  /** Autenticado pero no figura como administrador activo. */
  | "no-autorizado"
  | "admin"
  /** No se pudo verificar: la base no respondió. Distinto de no-autorizado. */
  | "error";

type AuthCtx = {
  session: Session | null;
  admin: FilaAdministrador | null;
  estado: EstadoAdmin;
  error: string | null;
  entrar: (email: string, password: string) => Promise<{ error: string | null }>;
  salir: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

/** Mensaje del error de PostgREST, que no es una instancia de Error. */
function mensajeDe(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "object" && e !== null && "message" in e)
    return String((e as { message: unknown }).message);
  return String(e);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [admin, setAdmin] = useState<FilaAdministrador | null>(null);
  const [estado, setEstado] = useState<EstadoAdmin>("cargando");
  const [error, setError] = useState<string | null>(null);

  /** Contrasta el uid autenticado contra la tabla de administradores. */
  const verificarAdmin = useCallback(async (s: Session | null) => {
    if (!s) {
      setAdmin(null);
      setEstado("sin-sesion");
      return;
    }
    try {
      const { data, error: err } = await supabase
        .from("administradores")
        .select("id, user_id, nombre, rol, activo")
        .eq("user_id", s.user.id)
        .eq("activo", true)
        .maybeSingle();

      if (err) throw err;

      if (data) {
        setAdmin(data as FilaAdministrador);
        setEstado("admin");
        setError(null);
      } else {
        setAdmin(null);
        setEstado("no-autorizado");
      }
    } catch (e) {
      const msg = mensajeDe(e);
      setAdmin(null);
      // PGRST106 = el schema no está expuesto en PostgREST. No es un problema
      // de permisos del usuario, así que no se le dice "no autorizado".
      setEstado("error");
      setError(
        /PGRST106|schema/i.test(msg)
          ? "No se puede verificar el acceso: el schema no está expuesto en PostgREST. Ver docs/SETUP_ADMIN.md"
          : msg
      );
    }
  }, []);

  useEffect(() => {
    if (!supabaseConfigurado) {
      setEstado("error");
      setError("Faltan las variables de Supabase. Ver docs/SETUP_ADMIN.md");
      return;
    }

    let vivo = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!vivo) return;
      setSession(data.session);
      void verificarAdmin(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      if (!vivo) return;
      setSession(s);
      void verificarAdmin(s);
    });

    return () => {
      vivo = false;
      sub.subscription.unsubscribe();
    };
  }, [verificarAdmin]);

  const entrar = useCallback(async (email: string, password: string) => {
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (err) {
      // Mensajes de Supabase en inglés; se traducen los dos habituales.
      const msg = /invalid login credentials/i.test(err.message)
        ? "Correo o contraseña incorrectos."
        : /email not confirmed/i.test(err.message)
          ? "El correo todavía no está confirmado."
          : err.message;
      return { error: msg };
    }
    // onAuthStateChange dispara la verificación contra administradores.
    return { error: null };
  }, []);

  const salir = useCallback(async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    setEstado("sin-sesion");
  }, []);

  const value = useMemo(
    () => ({ session, admin, estado, error, entrar, salir }),
    [session, admin, estado, error, entrar, salir]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth() requiere <AuthProvider> arriba.");
  return ctx;
}
