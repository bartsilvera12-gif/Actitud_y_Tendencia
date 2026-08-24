import { cn } from "@/lib/utils";

/**
 * Placeholders mientras responde Supabase. Usan los tonos de la marca en vez
 * del gris genérico, así la espera no rompe la estética del sitio.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-2xl bg-salvia/20", className)}
    />
  );
}

/** Grilla de cards de producto. */
export function SkeletonProductos({ cantidad = 4 }: { cantidad?: number }) {
  return (
    <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: cantidad }).map((_, i) => (
        <div key={i} className="rounded-[1.6rem] border border-white/60 bg-salvia/10 p-3">
          <Skeleton className="aspect-[2/3] w-full rounded-[1.2rem]" />
          <div className="px-1.5 pb-1 pt-3.5">
            <Skeleton className="h-2.5 w-16 rounded-full" />
            <Skeleton className="mt-2 h-3.5 w-full rounded-full" />
            <Skeleton className="mt-2 h-3.5 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Carrusel horizontal de categorías. */
export function SkeletonCategorias({ cantidad = 5 }: { cantidad?: number }) {
  return (
    <div className="-mx-5 mt-10 flex gap-4 overflow-hidden px-5 pb-4 md:-mx-8 md:px-8">
      {Array.from({ length: cantidad }).map((_, i) => (
        <Skeleton
          key={i}
          className="aspect-[2/3] w-[190px] shrink-0 rounded-[1.4rem] sm:w-[220px]"
        />
      ))}
    </div>
  );
}

/** Bloque de texto centrado (encabezados de sección). */
export function SkeletonTexto({ lineas = 2 }: { lineas?: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {Array.from({ length: lineas }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 rounded-full"
          // La última línea más corta, como un párrafo real.
        />
      ))}
    </div>
  );
}

/** Aviso discreto cuando el contenido no se pudo cargar. */
export function ErrorCarga({ mensaje }: { mensaje: string }) {
  return (
    <div className="mx-auto max-w-lg rounded-[1.5rem] border border-dashed border-salvia/40 bg-crema/60 px-6 py-10 text-center">
      <p className="font-display text-xl text-tinta">
        No pudimos cargar el contenido
      </p>
      <p className="mt-2 text-sm text-tinta-500">{mensaje}</p>
    </div>
  );
}
