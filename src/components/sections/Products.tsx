import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { products, type Product } from "@/data/products";
import ProductCard from "@/components/sections/ProductCard";
import ProductModal from "@/components/sections/ProductModal";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import SplitText from "@/components/reactbits/SplitText";
import FloralAccent from "@/components/ui/FloralAccent";
import { useCatalogo } from "@/lib/catalogo";

export default function Products() {
  const { abrir } = useCatalogo();
  const [active, setActive] = useState<Product | null>(null);

  return (
    <section id="coleccion" className="relative overflow-hidden py-20 md:py-28">
      <FloralAccent flor="ramaHorizontal" className="left-0 top-24 hidden w-40 lg:block" opacity={45} />
      <FloralAccent flor="ramilleteRosa" className="right-4 top-16 hidden w-16 md:block" rotate={12} opacity={80} />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center text-center">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-salvia-700">
              La colección
            </p>
          </ScrollReveal>
          <h2 className="mt-3 font-display text-4xl text-tinta sm:text-5xl md:text-6xl">
            <SplitText text="Encontrá tu próxima" by="word" />
            <span className="block italic text-salvia-700">
              <SplitText text="prenda favorita" by="word" delay={0.2} />
            </span>
          </h2>
          <ScrollReveal delay={0.15}>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-tinta-500">
              Piezas seleccionadas de nuestra línea Giverny y básicos que combinan
              con todo. Tocá una prenda para ver el detalle y consultá por WhatsApp.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.2}>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => abrir()}
              className="group flex items-center gap-2 rounded-full border border-salvia/40 px-5 py-2.5 text-sm font-medium text-tinta transition-all duration-300 hover:border-salvia-600 hover:bg-salvia/15"
            >
              Ver todos
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </ScrollReveal>

        {/* Grilla */}
        <motion.div
          layout
          id="productos"
          className="mt-12 grid scroll-mt-28 grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {products.map((p, i) => (
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
      </div>

      <ProductModal product={active} onClose={() => setActive(null)} />
    </section>
  );
}
