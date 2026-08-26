import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  Heart,
  Image,
  LayoutDashboard,
  Layers,
  LogOut,
  Menu,
  Settings,
  Share2,
  Shirt,
  Tags,
  X,
} from "lucide-react";
import Confirmar from "@/admin/components/Confirmar";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const MENU = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exacto: true },
  { to: "/admin/productos", label: "Productos", Icon: Shirt },
  { to: "/admin/categorias", label: "Categorías", Icon: Tags },
  { to: "/admin/lineas", label: "Líneas", Icon: Layers },
  // "Contenido del inicio" se saca del menú a pedido. La ruta /admin/inicio
  // sigue viva y se llega escribiéndola: es el único lugar donde se editan los
  // textos de las secciones de la web y se las oculta o reordena.
  { to: "/admin/hero", label: "Hero", Icon: Image },
  { to: "/admin/lookbook", label: "Lookbook", Icon: Heart },
  { to: "/admin/redes", label: "Redes y contacto", Icon: Share2 },
  { to: "/admin/configuracion", label: "Configuración", Icon: Settings },
];

export default function AdminLayout() {
  const { admin, salir } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [confirmarSalida, setConfirmarSalida] = useState(false);
  const location = useLocation();

  const actual = MENU.find((m) =>
    m.exacto ? location.pathname === m.to : location.pathname.startsWith(m.to)
  );

  const navegacion = (
    <nav className="flex flex-1 flex-col gap-1">
      {MENU.map(({ to, label, Icon, exacto }) => (
        <NavLink
          key={to}
          to={to}
          end={exacto}
          onClick={() => setMenuAbierto(false)}
          className={({ isActive }) =>
            cn(
              "flex min-h-11 items-center gap-3 rounded-2xl px-4 text-sm transition-all duration-200",
              isActive
                ? "bg-salvia-600 font-medium text-crema shadow-sm"
                : "text-tinta hover:bg-salvia/20"
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-svh bg-gradient-to-br from-menta/35 via-crema to-lila/20">
      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar desktop */}
        <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-salvia/25 bg-crema/70 px-4 py-6 backdrop-blur lg:flex">
          <img src="/brand/logo-gold.png" alt="Actitud & Tendencia" className="mx-2 h-8 w-auto" />
          <p className="mx-2 mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-salvia-700">
            Panel
          </p>
          <div className="mt-7 flex flex-1 flex-col">{navegacion}</div>
          <PieSidebar admin={admin?.nombre} onSalir={() => setConfirmarSalida(true)} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-salvia/25 bg-crema/85 px-4 py-3 backdrop-blur-xl md:px-6">
            <button
              onClick={() => setMenuAbierto(true)}
              aria-label="Abrir menú"
              className="rounded-full p-2.5 text-tinta transition-colors hover:bg-salvia/15 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <h1 className="min-w-0 flex-1 truncate font-display text-xl text-tinta md:text-2xl">
              {actual?.label ?? "Panel"}
            </h1>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-10 items-center gap-2 rounded-full border border-salvia/40 px-4 text-sm text-tinta transition-colors hover:bg-salvia/15 sm:flex"
            >
              <ExternalLink className="h-4 w-4" />
              Ver sitio
            </a>
            <span className="hidden text-sm text-tinta-500 md:inline">
              {admin?.nombre}
            </span>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 md:px-6 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Drawer mobile */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-tinta/35 backdrop-blur-sm"
              onClick={() => setMenuAbierto(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute left-0 top-0 flex h-full w-4/5 max-w-xs flex-col bg-crema px-4 py-6 shadow-2xl"
            >
              <div className="flex items-center justify-between px-2">
                <img src="/brand/logo-gold.png" alt="" className="h-8 w-auto" />
                <button
                  onClick={() => setMenuAbierto(false)}
                  aria-label="Cerrar menú"
                  className="rounded-full p-2.5 text-tinta"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-7 flex flex-1 flex-col">{navegacion}</div>
              <PieSidebar admin={admin?.nombre} onSalir={() => setConfirmarSalida(true)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Confirmar
        abierto={confirmarSalida}
        titulo="¿Cerrar sesión?"
        mensaje="Vas a volver a la pantalla de ingreso. Los cambios ya guardados no se pierden."
        confirmar="Cerrar sesión"
        onConfirmar={() => void salir()}
        onCancelar={() => setConfirmarSalida(false)}
      />
    </div>
  );
}

function PieSidebar({
  admin,
  onSalir,
}: {
  admin?: string;
  onSalir: () => void;
}) {
  return (
    <div className="mt-4 border-t border-salvia/25 pt-4">
      <p className="px-4 text-xs text-tinta-500">{admin}</p>
      <button
        type="button"
        onClick={onSalir}
        className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 text-sm text-tinta transition-colors hover:bg-rosa/25"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </button>
    </div>
  );
}
