import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/sections/ProductCard";
import ProductModal from "@/components/sections/ProductModal";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import SplitText from "@/components/reactbits/SplitText";
import FloralAccent from "@/components/ui/FloralAccent";
import { ErrorCarga, SkeletonProductos } from "@/components/ui/Skeleton";
import { useCatalogo } from "@/lib/catalogo";
import { useDatos } from "@/lib/datos";
import type { Product } from "@/types/contenido";

/** Cuántas prendas se muestran como adelanto en el home. */
const ADELANTO = 4;

export default function Products() {
  const { abrir } = useCatalogo();
  const { productos, cargando, error, seccion } = useDatos();
  const [active, setActive] = useState<Product | null>(null);
  const s = seccion("productos");

  // El adelanto respeta `mostrar_home` y `orden_home`, editables desde el panel.
  const adelanto = useMemo(
    () =>
      productos
        .filter((p) => p.mostrarHome !== false)
        .sort((a, b) => (a.ordenHome ?? 0) - (b.ordenHome ?? 0))
        .slice(0, ADELANTO),
    [productos]
  );
  const restantes = productos.length - adelanto.length;

  if (!s) return null;

  return (
    <section id="coleccion" className="relative overflow-hidden py-20 md:py-28">
      <FloralAccent flor="ramaHorizontal" className="left-0 top-24 hidden w-40 lg:block" opacity={45} />
      <FloralAccent flor="ramilleteRosa" className="right-4 top-16 hidden w-16 md:block" rotate={12} opacity={80} />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center text-center">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-salvia-700">
              {s.eyebrow ?? "Productos"}
            </p>
          </ScrollReveal>
          <h2 className="mt-3 font-display text-4xl text-tinta sm:text-5xl md:text-6xl">
            <SplitText text={s.titulo ?? "Encontrá tu próxima"} by="word" />
            {s.tituloDestacado && (
              <span className="block italic text-salvia-700">
                <SplitText text={s.tituloDestacado} by="word" delay={0.2} />
              </span>
            )}
          </h2>
          {s.descripcion && (
            <ScrollReveal delay={0.15}>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-tinta-500">
                {s.descripcion}
              </p>
            </ScrollReveal>
          )}
        </div>

        {error ? (
          <div className="mt-12">
            <ErrorCarga mensaje={error} />
          </div>
        ) : cargando ? (
          <SkeletonProductos cantidad={ADELANTO} />
        ) : (
          <>
            {/* Grilla: solo un adelanto; el catálogo completo vive en la vista
                de "Productos" del navbar, adonde lleva el botón de abajo. */}
            <motion.div
              layout
              id="productos"
              className="mt-12 grid scroll-mt-28 grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {adelanto.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProductCard product={p} onOpen={setActive} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {restantes > 0 && (
              <ScrollReveal delay={0.2}>
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => abrir()}
                    className="group flex items-center gap-2 rounded-full bg-salvia-600 px-6 py-3 text-sm font-medium text-crema shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-salvia-700"
                  >
                    Ver más ({restantes})
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </ScrollReveal>
            )}
          </>
        )}
      </div>

      <ProductModal product={active} onClose={() => setActive(null)} />
    </section>
  );
}
