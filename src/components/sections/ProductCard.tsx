import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { waProduct } from "@/lib/whatsapp";
import { formatGs } from "@/lib/utils";

type Props = {
  product: Product;
  onOpen: (p: Product) => void;
};

export default function ProductCard({ product, onOpen }: Props) {
  const [front, back] = product.fotos;

  return (
    <SpotlightCard className="group rounded-[1.6rem] border border-crema-200 bg-crema p-2.5 shadow-[0_18px_50px_-30px_rgba(94,138,111,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(94,138,111,0.6)]">
      <button
        onClick={() => onOpen(product)}
        className="relative block w-full overflow-hidden rounded-[1.2rem]"
        aria-label={`Ver ${product.nombre}`}
      >
        <div className="relative aspect-[3/4] w-full">
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

        {product.nuevo && (
          <span className="absolute left-3 top-3 rounded-full bg-crema/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-salvia-700 shadow-sm backdrop-blur">
            Nuevo
          </span>
        )}

        <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-3 items-center gap-1.5 rounded-full bg-tinta/85 px-4 py-2 text-xs font-medium text-crema opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Plus className="h-3.5 w-3.5" />
          Ver detalle
        </span>
      </button>

      <div className="flex items-start justify-between gap-3 px-2 pb-2 pt-3.5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-tinta-500">
            {product.categoria}
          </p>
          <h3 className="mt-0.5 truncate text-sm font-medium text-tinta">
            {product.nombre}
          </h3>
          <p className="mt-1 text-sm font-light text-salvia-700">
            {formatGs(product.precio)}
          </p>
        </div>
        <a
          href={waProduct(product)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Consultar ${product.nombre} por WhatsApp`}
          className="mt-0.5 shrink-0 rounded-full bg-menta/70 p-2.5 text-salvia-700 transition-all hover:bg-[#25D366] hover:text-white"
        >
          <WhatsAppIcon className="h-4 w-4" />
        </a>
      </div>
    </SpotlightCard>
  );
}
