import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Product } from "@/data/products";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { waProduct } from "@/lib/whatsapp";
import { cn, formatGs } from "@/lib/utils";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: Props) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const [talle, setTalle] = useState<string | null>(null);

  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  useEffect(() => {
    setTalle(null);
    setSelected(0);
    embla?.scrollTo(0, true);
  }, [product, embla]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (product) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-tinta/45 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            // En una columna (celular) scrollea el modal entero: con
            // `overflow-hidden` el precio, los talles y el botón quedaban
            // recortados y sin forma de llegar a ellos. En dos columnas
            // (desktop) el que scrollea es el panel de detalle.
            className="relative z-10 grid max-h-[90dvh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-3xl bg-crema shadow-2xl md:grid-cols-2 md:overflow-hidden"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              // `sticky` y no `absolute`: con el modal scrolleando en el
              // celular, en absolute la X se iba de pantalla al bajar.
              className="sticky top-4 z-30 -mb-14 ml-auto mr-4 h-fit w-fit rounded-full bg-crema/80 p-2.5 text-tinta shadow-md backdrop-blur transition-colors hover:bg-crema md:absolute md:right-4 md:top-4 md:m-0"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Carrusel */}
            <div className="relative bg-crema-200">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {product.fotos.map((src, i) => (
                    <div key={i} className="min-w-0 flex-[0_0_100%]">
                      <img
                        src={src}
                        alt={`${product.nombre} ${i + 1}`}
                        // 2:3 es la proporción nativa de las fotos, así que
                        // `cover` acá no recorta nada ni deja bandas.
                        className="aspect-[2/3] w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => embla?.scrollPrev()}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-crema/85 p-2.5 text-tinta shadow-md backdrop-blur transition hover:bg-crema"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => embla?.scrollNext()}
                aria-label="Siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-crema/85 p-2.5 text-tinta shadow-md backdrop-blur transition hover:bg-crema"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              {/* El punto mide 6px pero el botón que lo contiene llega a 32px de
                  alto, para que se pueda tocar con el dedo sin agrandar el punto. */}
              <div className="absolute inset-x-0 bottom-0 flex justify-center">
                {product.fotos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    aria-label={`Foto ${i + 1}`}
                    className="flex h-8 items-center px-1.5"
                  >
                    <span
                      className={cn(
                        "block h-1.5 rounded-full transition-all",
                        i === selected ? "w-6 bg-salvia-700" : "w-1.5 bg-crema"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Detalle */}
            <div className="flex flex-col p-7 md:overflow-y-auto md:p-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-salvia-700">
                {product.categoria} · {product.color}
              </p>
              <h3 className="mt-2 font-display text-3xl leading-tight text-tinta">
                {product.nombre}
              </h3>
              <p className="mt-3 text-2xl font-light text-salvia-700">
                {formatGs(product.precio)}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-tinta-500">
                {product.descripcion}
              </p>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-tinta">
                  Talle
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.talles.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTalle(t)}
                      className={cn(
                        "min-w-11 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                        talle === t
                          ? "border-salvia-700 bg-salvia-600 text-crema"
                          : "border-salvia/40 text-tinta hover:border-salvia-600"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                href={waProduct(product, talle ?? undefined)}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="lg"
                className="mt-8 w-full"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {talle ? `Consultar talle ${talle}` : "Consultar por WhatsApp"}
              </Button>
              <p className="mt-3 text-center text-xs text-tinta-500">
                Te respondemos con disponibilidad y formas de pago.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
