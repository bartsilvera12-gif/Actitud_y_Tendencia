import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { useCatalogo } from "@/lib/catalogo";
import { useDatos } from "@/lib/datos";
import { useTienda } from "@/lib/tienda";
import { cn } from "@/lib/utils";

// `href` baja a una sección del home; `catalogo` abre la vista de catálogo completo.
// El color de cada pill es fijo: la sección activa se marca solo con un anillo
// y el texto en semibold, sin cambiar de tono.
const links = [
  {
    label: "Colección",
    href: "#coleccion",
    seccion: "productos",
    pill: "bg-salvia/80 hover:bg-salvia",
    dot: "bg-salvia-700",
  },
  {
    label: "Categorías",
    href: "#categorias",
    seccion: "categorias",
    pill: "bg-menta hover:bg-menta/80",
    dot: "bg-dorado-700",
  },
  {
    label: "Productos",
    catalogo: true,
    pill: "bg-amarillo/85 hover:bg-amarillo",
    dot: "bg-dorado-700",
  },
  {
    label: "Nuevos ingresos",
    href: "#nuevos",
    seccion: "nuevos_ingresos",
    pill: "bg-rosa/80 hover:bg-rosa",
    dot: "bg-tinta/55",
  },
  {
    label: "Nosotras",
    href: "#manifiesto",
    seccion: "manifesto",
    pill: "bg-lila/80 hover:bg-lila",
    dot: "bg-tinta/55",
  },
] as const;

type Link = (typeof links)[number];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<string | null>(null);
  // El estado del menú vive en el contexto porque el botón flotante de
  // WhatsApp, que está en App, necesita saber si el menú está abierto.
  const {
    abierto,
    abrir,
    irASeccion,
    menuAbierto: open,
    setMenuAbierto: setOpen,
  } = useCatalogo();
  const { unidades, favoritos, abrirPanel } = useTienda();

  // Una sección que el panel apagó no debe dejar un ítem de menú apuntando a
  // un ancla que ya no existe en el DOM. "Productos" abre el catálogo completo,
  // así que no depende de ninguna sección del home y siempre se muestra.
  const { seccion } = useDatos();
  const visibles = links.filter((l) => !("seccion" in l) || seccion(l.seccion) !== null);
  // Clave estable para re-suscribir el scrollspy cuando cambian las secciones
  // (los datos llegan después del primer render).
  const clavesVisibles = visibles.map((l) => l.label).join("|");

  /** Un mismo handler para las dos variantes de link (sección del home o catálogo). */
  const navegar = (link: Link) => {
    setOpen(false);
    if ("catalogo" in link) abrir();
    else irASeccion(link.href);
  };

  /** En el catálogo manda "Productos"; en el home, la sección que estés mirando. */
  const esActivo = (link: Link) =>
    "catalogo" in link ? abierto : !abierto && seccionActiva === link.href;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: la sección activa es la que cruza la franja media del viewport.
  // Se re-suscribe cuando se cierra el catálogo, porque el home se remonta.
  useEffect(() => {
    if (abierto) return;

    const observados = visibles
      .filter((l): l is Extract<Link, { href: string }> => "href" in l)
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    if (observados.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setSeccionActiva("#" + visible.target.id);
      },
      // La franja es el 10% central: entra una sección a la vez.
      { rootMargin: "-45% 0px -45% 0px" }
    );

    observados.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [abierto, clavesVisibles]);

  return (
    <header
      className={cn(
        // Fondo blanco sólido siempre: en transparente la foto del hero se
        // colaba por detrás de la barra y los pills perdían definición.
        "fixed inset-x-0 top-0 z-50 border-b border-salvia/25 bg-white transition-all duration-500",
        scrolled ? "py-3 shadow-sm" : "py-5"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <a
          href="#top"
          className="flex min-h-10 shrink-0 items-center"
          aria-label="Actitud & Tendencia — inicio"
        >
          <img
            src="/brand/logo-gold.png"
            alt="Actitud & Tendencia"
            className="h-8 w-auto md:h-9"
          />
        </a>

        <ul className="hidden items-center gap-1.5 lg:flex xl:gap-2">
          {visibles.map((l) => {
            const activo = esActivo(l);
            return (
              <li key={l.label}>
                <button
                  type="button"
                  aria-current={activo ? "page" : undefined}
                  onClick={() => navegar(l)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] tracking-wide text-tinta ring-inset transition-all duration-300 hover:-translate-y-0.5 xl:px-4",
                    l.pill,
                    activo
                      ? "font-semibold ring-2 ring-tinta/45"
                      : "font-medium ring-1 ring-tinta/10"
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", l.dot)} />
                  {l.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* El `hidden` va en este span y no en el Button: el Button ya trae
              `inline-flex` en su base y esa clase le gana en la hoja de estilos,
              con lo cual nunca se ocultaría. */}
          <IconoConContador
            onClick={() => abrirPanel("favoritos")}
            etiqueta="Favoritos"
            cantidad={favoritos.length}
            colorContador="bg-rosa text-tinta"
          >
            <Heart className={cn("h-5 w-5", favoritos.length > 0 && "fill-rosa text-rosa")} />
          </IconoConContador>

          <IconoConContador
            onClick={() => abrirPanel("carrito")}
            etiqueta="Carrito"
            cantidad={unidades}
            colorContador="bg-salvia-600 text-crema"
          >
            <ShoppingBag className="h-5 w-5" />
          </IconoConContador>

          <button
            className="-mr-1 rounded-full p-2.5 text-tinta lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-tinta/30 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 flex h-full w-4/5 max-w-sm flex-col bg-crema p-7 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="flex items-center justify-between">
                <img src="/brand/logo-gold.png" alt="" className="h-8 w-auto" />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                  className="rounded-full p-2 text-tinta"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <ul className="mt-10 flex flex-col gap-2">
                {visibles.map((l) => {
                  const activo = esActivo(l);
                  return (
                    <li key={l.label}>
                      <button
                        type="button"
                        aria-current={activo ? "page" : undefined}
                        onClick={() => navegar(l)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border-b border-salvia/15 px-3 py-4 text-left font-display text-2xl text-tinta transition-all duration-300",
                          activo ? "ring-2 ring-inset ring-tinta/35" : "hover:text-salvia-700"
                        )}
                      >
                        <span className={cn("h-2.5 w-2.5 rounded-full", l.dot)} />
                        {l.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Icono del navbar con la burbujita de cantidad. */
function IconoConContador({
  children,
  onClick,
  etiqueta,
  cantidad,
  colorContador,
}: {
  children: React.ReactNode;
  onClick: () => void;
  etiqueta: string;
  cantidad: number;
  colorContador: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={cantidad > 0 ? `${etiqueta} (${cantidad})` : etiqueta}
      className="relative rounded-full p-2.5 text-tinta transition-colors hover:bg-salvia/15"
    >
      {children}
      {cantidad > 0 && (
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold shadow-sm",
            colorContador
          )}
        >
          {cantidad}
        </span>
      )}
    </button>
  );
}
