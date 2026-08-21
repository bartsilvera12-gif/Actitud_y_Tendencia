import type { Product } from "@/data/products";
import { formatGs } from "@/lib/utils";

/** Contacto y redes de la boutique. */
export const WHATSAPP_NUMBER = "595985960203";
export const WHATSAPP_DISPLAY = "+595 985 960 203";

export const INSTAGRAM_USER = "actitud_tendencia.sdg";
export const INSTAGRAM_URL = "https://instagram.com/actitud_tendencia.sdg";

export const FACEBOOK_NAME = "Actitud y Tendencia";
export const FACEBOOK_URL = "https://facebook.com/actitudytendencia";

export const TIKTOK_USER = "actitudytendencia";
export const TIKTOK_URL = "https://tiktok.com/@actitudytendencia";

/** Link de WhatsApp con mensaje pre-cargado. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Consulta de un producto puntual. */
export function waProduct(product: Product, talle?: string): string {
  const talleTxt = talle ? ` en talle ${talle}` : "";
  const msg =
    `¡Hola Actitud & Tendencia! 🌷\n` +
    `Me interesa *${product.nombre}*${talleTxt} (${formatGs(product.precio)}).\n` +
    `¿Tienen disponibilidad?`;
  return waLink(msg);
}

/** Consulta general. */
export function waGeneral(): string {
  return waLink(
    "¡Hola Actitud & Tendencia! 🌷 Quería consultar por la nueva colección."
  );
}
