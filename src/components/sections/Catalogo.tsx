import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { categorias, lineas, products, type Product } from "@/data/products";
import ProductCard from "@/components/sections/ProductCard";
import ProductModal from "@/components/sections/ProductModal";
import FloralAccent from "@/components/ui/FloralAccent";
import { useCatalogo } from "@/lib/catalogo";
import { themeFor } from "@/lib/categories";
import { cn, formatGs } from "@/lib/utils";

type Orden = "recientes" | "menor" | "mayor";

const ordenes: Array<{ id: Orden; label: string }> = [
  { id: "recientes", label: "Más recientes" },
  { id: "menor", label: "Menor precio" },
  { id: "mayor", label: "Mayor precio" },
];

const precioTope = Math.max(...products.map((p) => p.precio));
const precioPiso = Math.min(...products.map((p) => p.precio));

export default function Catalogo() {
  const { categoriaInicial, cerrar } = useCatalogo();

  const [categoria, setCategoria] = useState(categoriaInicial);
  const [linea, setLinea] = useState("Todas");
  const [precioMax, setPrecioMax] = useState(precioTope);
  const [orden, setOrden] = useState<Orden>("recientes");
  const [soloDestacados, setSoloDestacados] = useState(false);
  const [soloNuevos, setSoloNuevos] = useState(false);
  const [active, setActive] = useState<Product | null>(null);

  // Si se reabre el catálogo desde otra categoría, arranca en esa.
  useEffect(() => setCategoria(categoriaInicial), [categoriaInicial]);

  const visibles = useMemo(() => {
    const filtrados = products.filter(
      (p) =>
        (categoria === "Todos" || p.categoria === categoria) &&
        (linea === "Todas" || p.linea === linea) &&
        p.precio <= precioMax &&
        (!soloDestacados || p.destacado) &&
        (!soloNuevos || p.nuevo)
    );
    if (orden === "menor") return [...filtrados].sort((a, b) => a.precio - b.precio);
    if (orden === "mayor") return [...filtrados].sort((a, b) => b.precio - a.precio);
    return filtrados; // "recientes" = orden curado del catálogo
  }, [categoria, linea, precioMax, orden, soloDestacados, soloNuevos]);

  const limpio =
    categoria === "Todos" &&
    linea === "Todas" &&
    precioMax === precioTope &&
    orden === "recientes" &&
    !soloDestacados &&
    !soloNuevos;

  const limpiar = () => {
    setCategoria("Todos");
    setLinea("Todas");
    setPrecioMax(precioTope);
    setOrden("recientes");
    setSoloDestacados(false);
    setSoloNuevos(false);
  };

  const titulo = categoria === "Todos" ? "Todos los productos" : categoria;

  return (
    <div className="relative min-h-screen overflow-hidden pt-28 pb-20 md:pt-32">
      <FloralAccent flor="ramaHorizontal" className="left-0 top-24 hidden w-40 lg:block" opacity={40} />
      <FloralAccent flor="cosmosRosa" className="right-6 top-20 hidden w-16 md:block" rotate={12} opacity={80} />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <button
          type="button"
          onClick={cerrar}
          className="group flex items-center gap-2 text-sm font-medium text-tinta-500 transition-colors hover:text-salvia-700"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Volver al inicio
        </button>

        <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.25em] text-salvia-700">
          Catálogo
        </p>
        <h1 className="mt-2 font-display text-4xl text-tinta sm:text-5xl md:text-6xl">
          {titulo}
        </h1>
        <p className="mt-3 text-[15px] text-tinta-500">
          {visibles.length} {visibles.length === 1 ? "producto" : "productos"}
          {visibles.length > 0 && (
            <> · precio hasta {formatGs(Math.max(...visibles.map((p) => p.precio)))}</>
          )}
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[248px_1fr] lg:gap-10">
          {/* ── Panel de filtros ─────────────────────────────── */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.5rem] border border-salvia/25 bg-crema/50 p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-tinta">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filtros
                </span>
                {!limpio && (
                  <button
                    type="button"
                    onClick={limpiar}
                    className="text-xs font-medium text-salvia-700 underline underline-offset-4 transition-colors hover:text-salvia-900"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              <Grupo titulo="Categoría">
                <div className="flex flex-wrap gap-2">
                  {["Todos", ...categorias].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategoria(c)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-300",
                        categoria === c
                          ? cn(themeFor(c).chip, "shadow-sm")
                          : "border-salvia/30 text-tinta hover:border-salvia-600 hover:bg-salvia/10"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Grupo>

              <Grupo titulo="Línea">
                <div className="flex flex-wrap gap-2">
                  {["Todas", ...lineas].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLinea(l)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-300",
                        linea === l
                          ? "border-salvia-700 bg-salvia-600 text-crema shadow-sm"
                          : "border-salvia/30 text-tinta hover:border-salvia-600 hover:bg-salvia/10"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </Grupo>

              <Grupo titulo="Precio máximo">
                <input
                  type="range"
                  min={precioPiso}
                  max={precioTope}
                  step={10000}
                  value={precioMax}
                  onChange={(e) => setPrecioMax(Number(e.target.value))}
                  aria-label="Precio máximo"
                  className="w-full accent-salvia-600"
                />
                <p className="mt-2 text-sm font-medium text-salvia-700">
                  {formatGs(precioMax)}
                </p>
              </Grupo>

              <Grupo titulo="Ordenar por">
                <div className="flex flex-col gap-1.5">
                  {ordenes.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setOrden(o.id)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors duration-300",
                        orden === o.id
                          ? "bg-salvia/25 font-medium text-tinta"
                          : "text-tinta-500 hover:bg-salvia/10"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-colors",
                          orden === o.id ? "bg-salvia-600" : "bg-salvia/40"
                        )}
                      />
                      {o.label}
                    </button>
                  ))}
                </div>
              </Grupo>

              <Grupo titulo="Mostrar solo">
                <div className="flex flex-col gap-2">
                  <Toggle label="Destacados" activo={soloDestacados} onChange={setSoloDestacados} />
                  <Toggle label="Novedades" activo={soloNuevos} onChange={setSoloNuevos} />
                </div>
              </Grupo>
            </div>
          </aside>

          {/* ── Grilla ───────────────────────────────────────── */}
          <div>
            {visibles.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-salvia/40 px-6 py-20 text-center">
                <p className="font-display text-2xl text-tinta">
                  No encontramos prendas con esos filtros
                </p>
                <p className="mt-2 text-[15px] text-tinta-500">
                  Probá ampliando el precio o sacando alguna categoría.
                </p>
                <button
                  type="button"
                  onClick={limpiar}
                  className="mt-6 rounded-full bg-salvia-600 px-6 py-2.5 text-sm font-medium text-crema transition-colors hover:bg-salvia-700"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {visibles.map((p, i) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ProductCard product={p} onOpen={setActive} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <ProductModal product={active} onClose={() => setActive(null)} />
    </div>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t border-salvia/20 pt-5 first-of-type:mt-5">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-tinta-500">
        {titulo}
      </p>
      {children}
    </div>
  );
}

function Toggle({
  label,
  activo,
  onChange,
}: {
  label: string;
  activo: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      onClick={() => onChange(!activo)}
      className="flex items-center justify-between gap-3 text-[13px] text-tinta"
    >
      {label}
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300",
          activo ? "bg-salvia-600" : "bg-salvia/30"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300",
            activo ? "translate-x-[1.15rem]" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
}
