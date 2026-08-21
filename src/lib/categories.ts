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
    ring: "ring-rosa/50",
    tint: "bg-rosa/30",
    badge: "bg-rosa text-tinta",
    dot: "bg-rosa",
    flor: "cosmosRosa",
  },
  Blusas: {
    chip: "border-lila bg-lila text-tinta",
    ring: "ring-lila/50",
    tint: "bg-lila/30",
    badge: "bg-lila text-tinta",
    dot: "bg-lila",
    flor: "cosmosLila",
  },
  Camisetas: {
    chip: "border-amarillo bg-amarillo text-tinta",
    ring: "ring-amarillo/60",
    tint: "bg-amarillo/30",
    badge: "bg-amarillo text-tinta",
    dot: "bg-amarillo",
    flor: "cosmosAmarillo",
  },
  Regatas: {
    chip: "border-menta bg-menta text-tinta",
    ring: "ring-menta/70",
    tint: "bg-menta/55",
    badge: "bg-menta text-tinta",
    dot: "bg-menta",
    flor: "lavanda",
  },
  Chalecos: {
    chip: "border-salvia-700 bg-salvia-600 text-crema",
    ring: "ring-salvia/50",
    tint: "bg-salvia/30",
    badge: "bg-salvia-600 text-crema",
    dot: "bg-salvia-600",
    flor: "cosmosLila",
  },
  Pantalones: {
    chip: "border-amarillo bg-amarillo text-tinta",
    ring: "ring-amarillo/60",
    tint: "bg-amarillo/30",
    badge: "bg-amarillo text-tinta",
    dot: "bg-amarillo",
    flor: "ramilleteAmarillo",
  },
  Vestidos: {
    chip: "border-rosa bg-rosa text-tinta",
    ring: "ring-rosa/50",
    tint: "bg-rosa/30",
    badge: "bg-rosa text-tinta",
    dot: "bg-rosa",
    flor: "peoniaRosa",
  },
};

const fallback: CatTheme = {
  chip: "border-salvia-700 bg-salvia-600 text-crema",
  ring: "ring-salvia/50",
  tint: "bg-salvia/30",
  badge: "bg-salvia-600 text-crema",
  dot: "bg-salvia-600",
  flor: "tulipanLila",
};

export function themeFor(categoria: string): CatTheme {
  return themes[categoria] ?? fallback;
}
