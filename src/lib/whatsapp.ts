import type { Product } from "@/data/products";
import { formatGs } from "@/lib/utils";

/** Número de WhatsApp de la boutique (manual de marca). */
export const WHATSAPP_NUMBER = "595983460912";
export const INSTAGRAM_USER = "actitud_tendencia.sdg";
export const INSTAGRAM_URL = "https://instagram.com/actitud_tendencia.sdg";

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
