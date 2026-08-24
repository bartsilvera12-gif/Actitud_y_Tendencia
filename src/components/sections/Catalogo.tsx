import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import { useDatos } from "@/lib/datos";
import type { Product } from "@/types/contenido";
import ProductCard from "@/components/sections/ProductCard";
import ProductModal from "@/components/sections/ProductModal";
import FloralAccent from "@/components/ui/FloralAccent";
import { useCatalogo } from "@/lib/catalogo";
import { temaDe } from "@/lib/categories";
import { cn, formatGs } from "@/lib/utils";

type Orden = "recientes" | "menor" | "mayor";

const ordenes: Array<{ id: Orden; label: string }> = [
  { id: "recientes", label: "Más recientes" },
  { id: "menor", label: "Menor precio" },
  { id: "mayor", label: "Mayor precio" },
];

export default function Catalogo() {
  const { categoriaInicial, cerrar } = useCatalogo();
  const { productos, categorias, lineas, cargando } = useDatos();

  // El rango de precios sale del catálogo real, que ahora es dinámico.
  const [precioPiso, precioTope] = useMemo(() => {
    if (productos.length === 0) return [0, 0];
    const ps = productos.map((p) => p.precio);
    return [Math.min(...ps), Math.max(...ps)];
  }, [productos]);

  const [categoria, setCategoria] = useState(categoriaInicial);
  const [linea, setLinea] = useState("Todas");
  const [precioMax, setPrecioMax] = useState<number | null>(null);
  const [orden, setOrden] = useState<Orden>("recientes");
  const [soloDestacados, setSoloDestacados] = useState(false);
  const [soloNuevos, setSoloNuevos] = useState(false);
  const [active, setActive] = useState<Product | null>(null);

  // Si se reabre el catálogo desde otra categoría, arranca en esa.
  useEffect(() => setCategoria(categoriaInicial), [categoriaInicial]);

  const visibles = useMemo(() => {
    const filtrados = productos.filter(
      (p) =>
        (categoria === "Todos" || p.categoria === categoria) &&
        (linea === "Todas" || p.linea === linea) &&
        p.precio <= (precioMax ?? precioTope) &&
        (!soloDestacados || p.destacado) &&
        (!soloNuevos || p.nuevo)
    );
    if (orden === "menor") return [...filtrados].sort((a, b) => a.precio - b.precio);
    if (orden === "mayor") return [...filtrados].sort((a, b) => b.precio - a.precio);
    return filtrados; // "recientes" = orden curado del catálogo
  }, [productos, categoria, linea, precioMax, precioTope, orden, soloDestacados, soloNuevos]);

  const limpio =
    categoria === "Todos" &&
    linea === "Todas" &&
    (precioMax === null || precioMax === precioTope) &&
    orden === "recientes" &&
    !soloDestacados &&
    !soloNuevos;

  const limpiar = () => {
    setCategoria("Todos");
    setLinea("Todas");
    setPrecioMax(null);
    setOrden("recientes");
    setSoloDestacados(false);
    setSoloNuevos(false);
  };

  const titulo = categoria === "Todos" ? "Todos los productos" : categoria;

  return (
    <div className="relative min-h-screen overflow-hidden pt-28 pb-20 md:pt-32">
      <FloralAccent flor="cosmosRosa" className="right-6 top-20 hidden w-16 md:block" rotate={12} opacity={80} />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <button
          type="button"
          onClick={cerrar}
          className="group -my-2 flex min-h-10 items-center gap-2 py-2 text-sm font-medium text-tinta-500 transition-colors hover:text-salvia-700"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Volver al inicio
        </button>

        {/* ── Encabezado: título + filtros de categoría y línea ───────── */}
        <div className="relative mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-menta/70 via-menta/40 to-salvia/45 px-6 py-9 ring-1 ring-inset ring-salvia/25 md:px-10 md:py-11">
          <FloralAccent
            flor="ramilleteRosa"
            className="right-6 top-6 hidden w-16 md:block"
            rotate={10}
            opacity={70}
          />

          <span className="inline-flex rounded-full bg-salvia-900 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-crema">
            Catálogo
          </span>

          <h1 className="mt-5 font-display text-4xl text-tinta sm:text-5xl md:text-6xl">
            {titulo}
          </h1>
          <p className="mt-2.5 text-[15px] text-tinta-500">
            {visibles.length} {visibles.length === 1 ? "producto" : "productos"}
            {visibles.length > 0 && (
              <> · precio hasta {formatGs(Math.max(...visibles.map((p) => p.precio)))}</>
            )}
          </p>

          <FilaChips titulo="Categoría">
            {["Todos", ...categorias.map((c) => c.nombre)].map((c) => (
              <Chip
                key={c}
                activo={categoria === c}
                claseActiva={temaDe(c, categorias).chip}
                onClick={() => setCategoria(c)}
              >
                {c}
              </Chip>
            ))}
          </FilaChips>

          <FilaChips titulo="Línea">
            {["Todas", ...lineas.map((l) => l.nombre)].map((l) => (
              <Chip
                key={l}
                activo={linea === l}
                claseActiva="border-salvia-700 bg-salvia-600 text-crema"
                onClick={() => setLinea(l)}
              >
                {l}
              </Chip>
            ))}
          </FilaChips>
        </div>

        {/* ── Sidebar de filtros + grilla ─────────────────────────────── */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.5rem] border border-salvia/25 bg-crema/50 p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-tinta">
                  <SlidersHorizontal className="h-4 w-4 text-salvia-700" />
                  Filtros
                </span>
                {!limpio && (
                  <button
                    type="button"
                    onClick={limpiar}
                    className="flex items-center gap-1 text-xs font-medium text-salvia-700 transition-colors hover:text-salvia-900"
                  >
                    <X className="h-3.5 w-3.5" />
                    Limpiar
                  </button>
                )}
              </div>

              <div className="mt-6">
                <div className="flex items-baseline justify-between">
                  <p className="text-[13px] font-semibold text-tinta">Precio máximo</p>
                  <p className="text-[13px] font-semibold text-salvia-700">
                    {formatGs(precioMax ?? precioTope)}
                  </p>
                </div>
                <input
                  type="range"
                  min={precioPiso}
                  max={precioTope}
                  step={10000}
                  value={precioMax ?? precioTope}
                  onChange={(e) => setPrecioMax(Number(e.target.value))}
                  aria-label="Precio máximo"
                  className="mt-3 w-full accent-salvia-600"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="orden"
                  className="text-[13px] font-semibold text-tinta"
                >
                  Ordenar por
                </label>
                <select
                  id="orden"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as Orden)}
                  className="mt-2 w-full rounded-xl border border-salvia/35 bg-white px-3.5 py-2.5 text-[13px] text-tinta transition-colors hover:border-salvia-600 focus:border-salvia-600 focus:outline-none"
                >
                  {ordenes.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 border-t border-salvia/20 pt-5">
                <Toggle label="Destacados" activo={soloDestacados} onChange={setSoloDestacados} />
                <Toggle label="Novedades" activo={soloNuevos} onChange={setSoloNuevos} />
              </div>
            </div>
          </aside>

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
              <motion.div layout className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
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

/** Etiqueta a la izquierda y los chips fluyendo al lado, como en la referencia. */
function FilaChips({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-tinta-500">
        {titulo}
      </span>
      {children}
    </div>
  );
}

function Chip({
  activo,
  claseActiva,
  onClick,
  children,
}: {
  activo: boolean;
  claseActiva: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // min-h de 40px en táctil: 33px queda por debajo del mínimo cómodo.
        "inline-flex min-h-10 items-center rounded-full border px-4 py-1.5 text-[13px] font-medium transition-all duration-300 sm:min-h-0",
        activo
          ? cn(claseActiva, "shadow-sm")
          : "border-transparent bg-white/75 text-tinta hover:bg-white"
      )}
    >
      {children}
    </button>
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
      className="flex min-h-10 items-center justify-between gap-3 text-[13px] text-tinta"
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
