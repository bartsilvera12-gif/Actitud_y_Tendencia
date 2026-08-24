import { Heart, Plus } from "lucide-react";
import type { Product } from "@/data/products";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import FloralAccent from "@/components/ui/FloralAccent";
import { themeFor } from "@/lib/categories";
import { useTienda } from "@/lib/tienda";
import { cn, formatGs } from "@/lib/utils";

type Props = {
  product: Product;
  onOpen: (p: Product) => void;
};

export default function ProductCard({ product, onOpen }: Props) {
  const [front, back] = product.fotos;
  const t = themeFor(product.categoria);
  const { esFavorito, alternarFavorito } = useTienda();
  const favorito = esFavorito(product.id);

  return (
    <div className="group relative transition-transform duration-500 hover:-translate-y-1.5">
      <SpotlightCard
        className={cn(
          "rounded-[1.6rem] border border-white/60 p-3 shadow-[0_18px_50px_-30px_rgba(94,138,111,0.5)] ring-1 transition-shadow duration-500 group-hover:shadow-[0_34px_70px_-30px_rgba(94,138,111,0.55)]",
          t.tint,
          t.ring
        )}
      >
      <button
        onClick={() => onOpen(product)}
        className="relative block w-full overflow-hidden rounded-[1.2rem]"
        aria-label={`Ver ${product.nombre}`}
      >
        <div className="relative aspect-[2/3] w-full">
          <img
            src={front}
            alt={product.nombre}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 group-hover:opacity-0"
          />
          <img
            src={back ?? front}
            alt=""
            loading="lazy"
            aria-hidden
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        </div>

        {/* Abajo y no arriba: en la card angosta del celular, el badge en la
            esquina superior caía justo sobre la cara de la modelo. */}
        {product.nuevo && (
          <span
            className={cn(
              "absolute bottom-3 left-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] shadow-sm",
              t.badge
            )}
          >
            Nuevo
          </span>
        )}

        <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-3 items-center gap-1.5 rounded-full bg-tinta/85 px-4 py-2 text-xs font-medium text-crema opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Plus className="h-3.5 w-3.5" />
          Ver detalle
        </span>
      </button>

      <div className="px-1.5 pb-1 pt-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-tinta-500">
          {product.categoria}
        </p>
        <h3 className="mt-0.5 truncate text-sm font-medium text-tinta">
          {product.nombre}
        </h3>
        <p className="mt-1 text-sm font-medium text-salvia-700">
          {formatGs(product.precio)}
        </p>
      </div>
      </SpotlightCard>

      {/* Corazón de favoritos: hermano del botón de "Ver detalle" y no hijo,
          porque un botón dentro de otro botón es HTML inválido y el click no
          llega. Se posiciona contra el contenedor de la card. */}
      <button
        type="button"
        onClick={() => alternarFavorito(product.id)}
        aria-pressed={favorito}
        aria-label={
          favorito
            ? `Quitar ${product.nombre} de favoritos`
            : `Guardar ${product.nombre} en favoritos`
        }
        className="absolute right-5 top-5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-crema/85 text-tinta shadow-sm backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-crema"
      >
        <Heart className={cn("h-4 w-4", favorito && "fill-rosa text-rosa")} />
      </button>

      {/* Flor de la categoría asomando en la esquina (fuera del recorte de la card).
          En el celular no se muestra: con dos columnas angostas se salía de la
          card y se metía sobre la de al lado o fuera de la pantalla. */}
      <FloralAccent
        flor={t.flor}
        className="-right-3 -top-4 z-20 hidden w-14 drop-shadow-sm sm:block md:w-16"
        rotate={14}
      />
    </div>
  );
}
