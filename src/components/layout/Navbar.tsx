import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useCatalogo } from "@/lib/catalogo";
import { waGeneral } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// `href` baja a una sección del home; `catalogo` abre la vista de catálogo completo.
// `pill` es el estado normal (pastel al 25-60%) y `activo` el de "estás acá":
// el mismo tono a full, con anillo y sombra para que el salto se note.
const links = [
  {
    label: "Colección",
    href: "#coleccion",
    pill: "bg-salvia/25 hover:bg-salvia/45",
    activo: "bg-salvia ring-salvia-700",
    dot: "bg-salvia-600",
    dotActivo: "bg-salvia-900",
  },
  {
    label: "Categorías",
    href: "#categorias",
    pill: "bg-menta/60 hover:bg-menta",
    activo: "bg-menta ring-dorado",
    dot: "bg-dorado",
    dotActivo: "bg-dorado-700",
  },
  {
    label: "Productos",
    catalogo: true,
    pill: "bg-amarillo/35 hover:bg-amarillo/55",
    activo: "bg-amarillo ring-dorado-700",
    dot: "bg-amarillo",
    dotActivo: "bg-dorado-700",
  },
  {
    label: "Nuevos ingresos",
    href: "#nuevos",
    pill: "bg-rosa/30 hover:bg-rosa/50",
    activo: "bg-rosa ring-tinta/30",
    dot: "bg-rosa",
    dotActivo: "bg-tinta",
  },
  {
    label: "Nosotras",
    href: "#manifiesto",
    pill: "bg-lila/30 hover:bg-lila/50",
    activo: "bg-lila ring-tinta/30",
    dot: "bg-lila",
    dotActivo: "bg-tinta",
  },
] as const;

type Link = (typeof links)[number];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<string | null>(null);
  const { abierto, abrir, irASeccion } = useCatalogo();

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

    const observados = links
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
  }, [abierto]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-salvia/25 bg-crema/85 backdrop-blur-xl py-3"
          : "bg-transparent py-5"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <a href="#top" className="shrink-0" aria-label="Actitud & Tendencia — inicio">
          <img
            src="/brand/logo-gold.png"
            alt="Actitud & Tendencia"
            className="h-8 w-auto md:h-9"
          />
        </a>

        <ul className="hidden items-center gap-1.5 lg:flex xl:gap-2">
          {links.map((l) => {
            const activo = esActivo(l);
            return (
              <li key={l.label}>
                <button
                  type="button"
                  aria-current={activo ? "page" : undefined}
                  onClick={() => navegar(l)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] tracking-wide text-tinta transition-all duration-300 hover:-translate-y-0.5 xl:px-4",
                    activo
                      ? cn("font-semibold shadow-sm ring-2 ring-inset", l.activo)
                      : cn("font-medium", l.pill)
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                      activo ? l.dotActivo : l.dot
                    )}
                  />
                  {l.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Button
            href={waGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Consultar
          </Button>
          <button
            className="rounded-full p-2 text-tinta lg:hidden"
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
                {links.map((l) => {
                  const activo = esActivo(l);
                  return (
                    <li key={l.label}>
                      <button
                        type="button"
                        aria-current={activo ? "page" : undefined}
                        onClick={() => navegar(l)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border-b border-salvia/15 px-3 py-4 text-left font-display text-2xl text-tinta transition-all duration-300",
                          activo
                            ? cn("ring-2 ring-inset", l.activo)
                            : "hover:text-salvia-700"
                        )}
                      >
                        <span
                          className={cn(
                            "h-2.5 w-2.5 rounded-full",
                            activo ? l.dotActivo : l.dot
                          )}
                        />
                        {l.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Button
                href={waGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="lg"
                className="mt-auto"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Escribinos por WhatsApp
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
