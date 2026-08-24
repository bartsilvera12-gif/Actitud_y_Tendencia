import type { FlorKey } from "@/lib/flowers";
import type { Categoria } from "@/types/contenido";
import type { TemaColor } from "@/types/database";

/**
 * Tema visual por categoría.
 *
 * Las clases se escriben COMPLETAS a propósito: Tailwind v4 escanea el código
 * fuente y purga lo que no encuentra escrito, así que construirlas desde la
 * base (`bg-${color}`) las dejaría fuera del CSS. Por eso la base guarda una
 * *clave* de tema y el mapa vive acá. Una categoría nueva creada desde el
 * panel elige entre estos temas, sin tocar código.
 */
export type CatTheme = {
  chip: string;
  ring: string;
  tint: string;
  badge: string;
  dot: string;
  flor: FlorKey;
};

const TEMAS: Record<TemaColor, Omit<CatTheme, "flor">> = {
  rosa: {
    chip: "border-rosa bg-rosa text-tinta",
    ring: "ring-rosa/50",
    tint: "bg-rosa/30",
    badge: "bg-rosa text-tinta",
    dot: "bg-rosa",
  },
  lila: {
    chip: "border-lila bg-lila text-tinta",
    ring: "ring-lila/50",
    tint: "bg-lila/30",
    badge: "bg-lila text-tinta",
    dot: "bg-lila",
  },
  amarillo: {
    chip: "border-amarillo bg-amarillo text-tinta",
    ring: "ring-amarillo/60",
    tint: "bg-amarillo/30",
    badge: "bg-amarillo text-tinta",
    dot: "bg-amarillo",
  },
  menta: {
    chip: "border-menta bg-menta text-tinta",
    ring: "ring-menta/70",
    tint: "bg-menta/55",
    badge: "bg-menta text-tinta",
    dot: "bg-menta",
  },
  salvia: {
    chip: "border-salvia-700 bg-salvia-600 text-crema",
    ring: "ring-salvia/50",
    tint: "bg-salvia/30",
    badge: "bg-salvia-600 text-crema",
    dot: "bg-salvia-600",
  },
  dorado: {
    chip: "border-dorado-700 bg-dorado text-crema",
    ring: "ring-dorado/50",
    tint: "bg-dorado/20",
    badge: "bg-dorado text-crema",
    dot: "bg-dorado-700",
  },
};

/** Temas disponibles para el selector del panel. */
export const TEMAS_DISPONIBLES = Object.keys(TEMAS) as TemaColor[];

const FALLBACK: CatTheme = { ...TEMAS.salvia, flor: "tulipanLila" };

/** Tema a partir de la clave guardada en la base. */
export function temaPorClave(
  clave: TemaColor | string | null | undefined,
  flor: string | null | undefined
): CatTheme {
  const base = TEMAS[(clave ?? "") as TemaColor] ?? TEMAS.salvia;
  return { ...base, flor: (flor as FlorKey) ?? FALLBACK.flor };
}

/**
 * Tema de una categoría por su nombre, resolviendo contra las categorías
 * cargadas desde la base. Si no aparece —por ejemplo el chip "Todos" del
 * catálogo— cae al tema neutro.
 */
export function temaDe(
  nombreCategoria: string,
  categorias: Categoria[]
): CatTheme {
  const cat = categorias.find((c) => c.nombre === nombreCategoria);
  if (!cat) return FALLBACK;
  return temaPorClave(cat.temaColor, cat.florKey);
}
