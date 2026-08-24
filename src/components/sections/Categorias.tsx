import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import SplitText from "@/components/reactbits/SplitText";
import FloralAccent from "@/components/ui/FloralAccent";
import { SkeletonCategorias } from "@/components/ui/Skeleton";
import { useCatalogo } from "@/lib/catalogo";
import { useDatos } from "@/lib/datos";
import { temaPorClave } from "@/lib/categories";
import { cn } from "@/lib/utils";

export default function Categorias() {
  const { abrir } = useCatalogo();
  const { categorias, productos, cargando, seccion } = useDatos();
  const s = seccion("categorias");

  // Conteo y foto representativa por categoría, ahora desde la base.
  const tarjetas = useMemo(
    () =>
      categorias.map((cat) => {
        const items = productos.filter((p) => p.categoria === cat.nombre);
        return {
          ...cat,
          cantidad: items.length,
          foto: cat.imagenUrl ?? items[0]?.fotos[0],
        };
      }),
    [categorias, productos]
  );

  if (!s) return null;

  return (
    <section id="categorias" className="relative scroll-mt-24 overflow-hidden py-20 md:py-24">
      <FloralAccent flor="ramilleteAmarillo" className="right-2 top-10 hidden w-16 md:block" rotate={14} opacity={80} />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-salvia-700">
                {s.eyebrow ?? "Categorías"}
              </p>
            </ScrollReveal>
            <h2 className="mt-3 font-display text-4xl text-tinta sm:text-5xl">
              <SplitText text={s.titulo ?? "Comprá por categoría"} by="word" />
            </h2>
          </div>

          <ScrollReveal delay={0.1}>
            <button
              type="button"
              onClick={() => abrir()}
              className="group flex items-center gap-2 rounded-full border border-salvia/40 px-5 py-2.5 text-sm font-medium text-tinta transition-all duration-300 hover:border-salvia-600 hover:bg-salvia/15"
            >
              Ver todo el catálogo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </ScrollReveal>
        </div>

        {cargando ? (
          <SkeletonCategorias />
        ) : (
          /* Carrusel horizontal: entran todas las categorías sin apretar la grilla. */
          <ScrollReveal delay={0.15}>
            <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:-mx-8 md:px-8">
              {tarjetas.map((cat) => {
                const t = temaPorClave(cat.temaColor, cat.florKey);
                return (
                  <li key={cat.id} className="shrink-0 snap-start">
                    <button
                      type="button"
                      onClick={() => abrir(cat.nombre)}
                      className={cn(
                        "group relative block aspect-[2/3] w-[190px] overflow-hidden rounded-[1.4rem] text-left ring-1 transition-all duration-500 hover:-translate-y-1.5 sm:w-[220px]",
                        t.ring
                      )}
                    >
                      {cat.foto && (
                        <img
                          src={cat.foto}
                          alt={cat.nombre}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      <span className="absolute inset-0 bg-gradient-to-t from-salvia-900/85 via-salvia-900/15 to-transparent" />

                      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                        <span>
                          <span className="block font-display text-xl text-crema">
                            {cat.nombre}
                          </span>
                          <span className="mt-0.5 block text-[12px] text-crema/75">
                            {cat.cantidad} {cat.cantidad === 1 ? "producto" : "productos"}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-tinta opacity-0 transition-all duration-300 group-hover:opacity-100",
                            t.badge
                          )}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
