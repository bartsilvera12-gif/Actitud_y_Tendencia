import { Link } from "react-router-dom";
import { ExternalLink, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

/**
 * Placeholder del panel. El dashboard con métricas y el layout con sidebar
 * llegan en la fase 6; esto sirve para comprobar la cadena de autenticación.
 */
export default function Dashboard() {
  const { admin, salir } = useAuth();

  return (
    <div className="min-h-svh bg-gradient-to-br from-menta/40 via-crema to-lila/25 px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-white/70 bg-crema/85 p-8 shadow-[0_30px_70px_-40px_rgba(94,138,111,0.5)] sm:p-10">
          <img src="/brand/logo-gold.png" alt="" className="h-9 w-auto" />

          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.25em] text-salvia-700">
            Panel de administración
          </p>
          <h1 className="mt-2 font-display text-3xl text-tinta">
            Hola, <span className="italic text-salvia-700">{admin?.nombre}</span>
          </h1>
          <p className="mt-3 text-sm text-tinta-500">
            Sesión iniciada como <strong className="text-tinta">{admin?.rol}</strong>.
            El catálogo y los editores de contenido llegan en las próximas fases.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/"
              className="flex min-h-11 items-center gap-2 rounded-full border border-salvia/40 px-5 text-sm font-medium text-tinta transition-colors hover:border-salvia-600 hover:bg-salvia/15"
            >
              <ExternalLink className="h-4 w-4" />
              Ver el sitio
            </Link>
            <button
              type="button"
              onClick={() => void salir()}
              className="flex min-h-11 items-center gap-2 rounded-full bg-salvia-600 px-5 text-sm font-medium text-crema transition-colors hover:bg-salvia-700"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
