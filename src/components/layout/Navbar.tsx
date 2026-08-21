import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { waGeneral } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const links = [
  { label: "Colección", href: "#coleccion" },
  { label: "Nuevos ingresos", href: "#nuevos" },
  { label: "Nosotras", href: "#manifiesto" },
  { label: "Instagram", href: "#instagram" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

        <ul className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative text-[13px] font-medium tracking-wide text-tinta/80 transition-colors hover:text-salvia-700"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-salvia-600 transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
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
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-salvia/15 py-4 font-display text-2xl text-tinta transition-colors hover:text-salvia-700"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
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
