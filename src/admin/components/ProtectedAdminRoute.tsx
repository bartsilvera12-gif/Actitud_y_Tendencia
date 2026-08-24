import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2, TriangleAlert } from "lucide-react";
import { useAuth } from "@/lib/auth";

/**
 * Puerta de las rutas `/admin/*`.
 *
 * Es solo comodidad de navegación: quien impide de verdad leer o escribir es
 * RLS en la base. Si alguien saltea esta ruta, sus consultas igual fallan.
 */
export default function ProtectedAdminRoute() {
  const { estado, error } = useAuth();
  const location = useLocation();

  if (estado === "cargando") {
    return (
      <div className="flex min-h-svh items-center justify-center bg-crema">
        <div className="flex flex-col items-center gap-3 text-tinta-500">
          <Loader2 className="h-6 w-6 animate-spin text-salvia-600" />
          <p className="text-sm">Verificando tu acceso…</p>
        </div>
      </div>
    );
  }

  // No se pudo verificar (base caída o schema sin exponer). Mandarlo al login
  // sería confuso: parecería un problema de credenciales.
  if (estado === "error") {
    return (
      <div className="flex min-h-svh items-center justify-center bg-crema px-5">
        <div className="max-w-md rounded-[2rem] border border-salvia/30 bg-white/70 p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amarillo/40">
            <TriangleAlert className="h-6 w-6 text-dorado-700" />
          </span>
          <h1 className="mt-5 font-display text-2xl text-tinta">
            No se puede verificar el acceso
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-tinta-500">{error}</p>
        </div>
      </div>
    );
  }

  if (estado !== "admin") {
    return <Navigate to="/admin/login" replace state={{ desde: location.pathname }} />;
  }

  return <Outlet />;
}
