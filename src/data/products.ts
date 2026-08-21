export type Product = {
  id: string;
  nombre: string;
  linea: string;
  categoria: string;
  color: string;
  precio: number;
  talles: string[];
  tipoTalle: "numerico" | "letra";
  descripcion: string;
  fotos: string[];
  nuevo?: boolean;
  destacado?: boolean;
};

/** Fotos servidas desde /public/productos/<id>/0n.webp */
export const products: Product[] = [
  {
    id: "camisa-giverny-estampada-offwhite",
    nombre: "Camisa Giverny Estampada",
    linea: "Giverny",
    categoria: "Camisas",
    color: "Off-white",
    precio: 299000,
    talles: ["36", "38", "40"],
    tipoTalle: "numerico",
    descripcion:
      "Camisa de manga corta en tejido liviano con estampado floral pintado a mano sobre base off-white. Caída fluida y frescura para el día.",
    fotos: [
      "/productos/camisa-giverny-estampada-offwhite/01.webp",
      "/productos/camisa-giverny-estampada-offwhite/02.webp",
      "/productos/camisa-giverny-estampada-offwhite/03.webp",
      "/productos/camisa-giverny-estampada-offwhite/04.webp",
    ],
    nuevo: true,
    destacado: true,
  },
  {
    id: "blusa-tricot-sinmanga-giverny-offwhite",
    nombre: "Blusa Tricot Sin Manga Giverny",
    linea: "Giverny",
    categoria: "Blusas",
    color: "Off-white",
    precio: 299000,
    talles: ["P", "M", "G"],
    tipoTalle: "letra",
    descripcion:
      "Blusa de tricot sin mangas con gran flor pintada en tonos rosa y verde sobre off-white. Cuello redondo y terminación canelada.",
    fotos: [
      "/productos/blusa-tricot-sinmanga-giverny-offwhite/01.webp",
      "/productos/blusa-tricot-sinmanga-giverny-offwhite/02.webp",
      "/productos/blusa-tricot-sinmanga-giverny-offwhite/03.webp",
      "/productos/blusa-tricot-sinmanga-giverny-offwhite/04.webp",
    ],
    nuevo: true,
    destacado: true,
  },
  {
    id: "camiseta-fleurs-de-giverny-offwhite",
    nombre: "Camiseta Fleurs de Giverny",
    linea: "Giverny",
    categoria: "Camisetas",
    color: "Off-white",
    precio: 199000,
    talles: ["P", "M", "G"],
    tipoTalle: "letra",
    descripcion:
      "Camiseta off-white de algodón con estampado 'Fleurs de Giverny': una grilla botánica de flores en acuarela con lettering delicado.",
    fotos: [
      "/productos/camiseta-fleurs-de-giverny-offwhite/01.webp",
      "/productos/camiseta-fleurs-de-giverny-offwhite/02.webp",
      "/productos/camiseta-fleurs-de-giverny-offwhite/03.webp",
      "/productos/camiseta-fleurs-de-giverny-offwhite/04.webp",
    ],
    nuevo: true,
  },
  {
    id: "regata-canelada-lilas",
    nombre: "Regata Canelada Lilas",
    linea: "Básicos",
    categoria: "Regatas",
    color: "Lila",
    precio: 199000,
    talles: ["P", "M"],
    tipoTalle: "letra",
    descripcion:
      "Regata canelada (rib) al cuerpo en un lila suave. Escote alto y calce prolijo: la base ideal para combinar con estampados.",
    fotos: [
      "/productos/regata-canelada-lilas/01.webp",
      "/productos/regata-canelada-lilas/02.webp",
      "/productos/regata-canelada-lilas/03.webp",
      "/productos/regata-canelada-lilas/04.webp",
    ],
    nuevo: true,
  },
];

/** Categorías presentes en el catálogo, en orden. */
export const categorias = Array.from(new Set(products.map((p) => p.categoria)));
