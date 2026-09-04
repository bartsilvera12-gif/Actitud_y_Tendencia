/**
 * Filas tal como vienen del schema `actitudytendencia`.
 * Los tipos que usa la UI viven en src/types/contenido.ts.
 */

export type TemaColor =
  | "salvia"
  | "menta"
  | "lila"
  | "rosa"
  | "amarillo"
  | "dorado";

export type TipoTalle = "numerico" | "letra" | "unico";

export type ClaveSeccion =
  | "hero"
  | "categorias"
  | "productos"
  | "nuevos_ingresos"
  | "manifesto"
  | "lookbook"
  | "redes"
  | "whatsapp_cta";

export type TipoRed = "instagram" | "facebook" | "tiktok" | "whatsapp" | "otro";

export type FilaCategoria = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_url: string | null;
  imagen_storage_path: string | null;
  tema_color: TemaColor;
  flor_key: string;
  orden: number;
  activo: boolean;
};

export type FilaLinea = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_url: string | null;
  orden: number;
  activo: boolean;
};

export type FilaTalle = {
  id: string;
  producto_id: string;
  talle: string;
  orden: number;
  activo: boolean;
  stock: number | null;
};

export type FilaImagen = {
  id: string;
  producto_id: string;
  url: string;
  storage_path: string | null;
  alt_text: string | null;
  orden: number;
  principal: boolean;
};

export type FilaProducto = {
  id: string;
  slug: string;
  nombre: string;
  categoria_id: string | null;
  linea_id: string | null;
  color: string | null;
  precio: number;
  /** Precio promocional. `null` = sin oferta. Siempre menor que `precio`. */
  precio_oferta: number | null;
  descripcion: string | null;
  tipo_talle: TipoTalle;
  nuevo: boolean;
  destacado: boolean;
  activo: boolean;
  mostrar_home: boolean;
  orden_home: number;
  orden_catalogo: number;
  seo_title: string | null;
  seo_description: string | null;
};

/** Producto con sus relaciones, tal como lo devuelve el select anidado. */
export type FilaProductoCompleto = FilaProducto & {
  categoria: Pick<FilaCategoria, "nombre" | "slug" | "tema_color" | "flor_key"> | null;
  linea: Pick<FilaLinea, "nombre" | "slug"> | null;
  producto_talles: Pick<FilaTalle, "talle" | "orden">[];
  producto_imagenes: Pick<FilaImagen, "url" | "alt_text" | "orden" | "principal">[];
};

export type FilaSeccion = {
  id: string;
  clave: ClaveSeccion;
  eyebrow: string | null;
  titulo: string | null;
  titulo_destacado: string | null;
  descripcion: string | null;
  activo: boolean;
  orden: number;
  configuracion: Record<string, unknown>;
};

export type FilaHeroChip = {
  id: string;
  hero_id: string;
  texto: string;
  color: TemaColor;
  orden: number;
  activo: boolean;
};

export type FilaHero = {
  id: string;
  etiqueta: string | null;
  titulo_linea_1: string | null;
  titulo_destacado_1: string | null;
  titulo_linea_2: string | null;
  titulo_destacado_2: string | null;
  descripcion: string | null;
  imagen_url: string | null;
  imagen_storage_path: string | null;
  activo: boolean;
  orden: number;
  hero_chips?: FilaHeroChip[];
};

export type FilaValorManifiesto = {
  id: string;
  texto: string;
  color: TemaColor;
  orden: number;
  activo: boolean;
};

export type FilaLookbookItem = {
  id: string;
  producto_id: string | null;
  imagen_url: string | null;
  imagen_storage_path: string | null;
  orden: number;
  activo: boolean;
};

export type FilaRedSocial = {
  id: string;
  tipo: TipoRed;
  nombre: string | null;
  usuario: string | null;
  url: string;
  orden: number;
  activo: boolean;
};

export type FilaConfiguracion = {
  id: string;
  nombre_marca: string;
  logo_url: string | null;
  logo_storage_path: string | null;
  whatsapp_numero: string;
  whatsapp_display: string | null;
  whatsapp_mensaje_general: string | null;
  ubicacion: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  favicon_url: string | null;
};

export type FilaAdministrador = {
  id: string;
  user_id: string;
  nombre: string;
  rol: "superadmin" | "admin";
  activo: boolean;
};
