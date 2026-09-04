import type { ClaveSeccion, TemaColor, TipoRed } from "@/types/database";

/**
 * Tipos que consume la UI.
 *
 * `id` sigue siendo el slug y no el uuid a propósito: los carritos y favoritos
 * ya guardados en el localStorage de los visitantes referencian ese valor.
 * Cambiarlo los vaciaría. El uuid viaja aparte para las operaciones del panel.
 */
export type Product = {
  /** Slug. Es la clave estable de cara al público y al localStorage. */
  id: string;
  /** uuid en la base. Solo lo necesita el panel. */
  uuid?: string;
  nombre: string;
  linea: string;
  categoria: string;
  color: string;
  precio: number;
  /** Precio promocional. `null` = sin oferta. */
  precioOferta: number | null;
  talles: string[];
  tipoTalle: "numerico" | "letra" | "unico";
  descripcion: string;
  fotos: string[];
  nuevo?: boolean;
  destacado?: boolean;
  mostrarHome?: boolean;
  ordenHome?: number;
  ordenCatalogo?: number;
};

export type Categoria = {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  temaColor: TemaColor;
  florKey: string;
  orden: number;
};

export type Linea = {
  id: string;
  nombre: string;
  slug: string;
  orden: number;
};

export type Seccion = {
  clave: ClaveSeccion;
  eyebrow: string | null;
  titulo: string | null;
  tituloDestacado: string | null;
  descripcion: string | null;
  activo: boolean;
  orden: number;
  configuracion: Record<string, unknown>;
};

export type HeroChip = {
  id: string;
  texto: string;
  color: TemaColor;
};

export type Hero = {
  id: string;
  etiqueta: string | null;
  tituloLinea1: string | null;
  tituloDestacado1: string | null;
  tituloLinea2: string | null;
  tituloDestacado2: string | null;
  descripcion: string | null;
  imagenUrl: string | null;
  chips: HeroChip[];
};

export type ValorManifiesto = {
  id: string;
  texto: string;
  color: TemaColor;
};

export type LookbookItem = {
  id: string;
  productoId: string | null;
  imagenUrl: string | null;
};

export type RedSocial = {
  id: string;
  tipo: TipoRed;
  nombre: string | null;
  usuario: string | null;
  url: string;
};

export type ConfiguracionSitio = {
  nombreMarca: string;
  logoUrl: string | null;
  whatsappNumero: string;
  whatsappDisplay: string;
  whatsappMensajeGeneral: string;
  ubicacion: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  faviconUrl: string | null;
};
