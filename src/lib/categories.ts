import type { FlorKey } from "@/lib/flowers";

// Tema de color por categoría (paleta oficial del manual).
// Las clases se escriben completas para que Tailwind las detecte.
export type CatTheme = {
  chip: string;
  ring: string;
  tint: string; // color inicial del degradado (from-*)
  badge: string;
  dot: string;
  flor: FlorKey;
};

const themes: Record<string, CatTheme> = {
  Camisas: {
    chip: "border-rosa bg-rosa text-tinta",
    ring: "ring-rosa/40",
    tint: "from-rosa/12",
    badge: "bg-rosa text-tinta",
    dot: "bg-rosa",
    flor: "cosmosRosa",
  },
  Blusas: {
    chip: "border-lila bg-lila text-tinta",
    ring: "ring-lila/40",
    tint: "from-lila/12",
    badge: "bg-lila text-tinta",
    dot: "bg-lila",
    flor: "cosmosLila",
  },
  Camisetas: {
    chip: "border-amarillo bg-amarillo text-tinta",
    ring: "ring-amarillo/50",
    tint: "from-amarillo/12",
    badge: "bg-amarillo text-tinta",
    dot: "bg-amarillo",
    flor: "cosmosAmarillo",
  },
  Regatas: {
    chip: "border-menta bg-menta text-tinta",
    ring: "ring-menta/60",
    tint: "from-menta/20",
    badge: "bg-menta text-tinta",
    dot: "bg-menta",
    flor: "lavanda",
  },
  Chalecos: {
    chip: "border-salvia-700 bg-salvia-600 text-crema",
    ring: "ring-salvia/40",
    tint: "from-salvia/12",
    badge: "bg-salvia-600 text-crema",
    dot: "bg-salvia-600",
    flor: "cosmosLila",
  },
  Pantalones: {
    chip: "border-amarillo bg-amarillo text-tinta",
    ring: "ring-amarillo/50",
    tint: "from-amarillo/12",
    badge: "bg-amarillo text-tinta",
    dot: "bg-amarillo",
    flor: "ramilleteAmarillo",
  },
  Vestidos: {
    chip: "border-rosa bg-rosa text-tinta",
    ring: "ring-rosa/40",
    tint: "from-rosa/12",
    badge: "bg-rosa text-tinta",
    dot: "bg-rosa",
    flor: "peoniaRosa",
  },
};

const fallback: CatTheme = {
  chip: "border-salvia-700 bg-salvia-600 text-crema",
  ring: "ring-salvia/50",
  tint: "from-salvia/25",
  badge: "bg-salvia-600 text-crema",
  dot: "bg-salvia-600",
  flor: "tulipanLila",
};

export function themeFor(categoria: string): CatTheme {
  return themes[categoria] ?? fallback;
}
