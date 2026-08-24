import type { Product } from "@/types/contenido";
import { formatGs } from "@/lib/utils";

/**
 * Armado de links de WhatsApp.
 *
 * El número ya no es una constante: viene de `configuracion_sitio` y se pasa
 * como argumento. Los valores de acá abajo son solo el respaldo para cuando
 * la configuración todavía no cargó, y coinciden con los que estaban fijos
 * antes para que nada cambie de comportamiento.
 */
export const WHATSAPP_FALLBACK = "595985960203";

/** wa.me exige solo dígitos: sin +, espacios ni guiones. */
export function normalizarNumero(numero: string | null | undefined): string {
  const limpio = (numero ?? "").replace(/\D/g, "");
  return limpio.length >= 8 ? limpio : WHATSAPP_FALLBACK;
}

export function waLink(numero: string | null | undefined, mensaje: string): string {
  return `https://wa.me/${normalizarNumero(numero)}?text=${encodeURIComponent(mensaje)}`;
}

/** Consulta general. El mensaje también es editable desde el panel. */
export function waGeneral(
  numero: string | null | undefined,
  mensaje?: string | null
): string {
  return waLink(
    numero,
    mensaje ?? "¡Hola Actitud & Tendencia! 🌷 Quería consultar por la nueva colección."
  );
}

/** Consulta por una prenda puntual. */
export function waProduct(
  numero: string | null | undefined,
  product: Product,
  talle?: string
): string {
  const talleTxt = talle ? ` en talle ${talle}` : "";
  return waLink(
    numero,
    `¡Hola Actitud & Tendencia! 🌷\n` +
      `Me interesa *${product.nombre}*${talleTxt} (${formatGs(product.precio)}).\n` +
      `¿Tienen disponibilidad?`
  );
}

/** Pedido completo del carrito. */
export function waPedido(
  numero: string | null | undefined,
  lineas: Array<{ nombre: string; talle: string; cantidad: number; subtotal: number }>,
  total: number
): string {
  const detalle = lineas
    .map(
      (l) =>
        `• ${l.nombre} — talle ${l.talle} × ${l.cantidad} (${formatGs(l.subtotal)})`
    )
    .join("\n");
  return waLink(
    numero,
    `¡Hola Actitud & Tendencia! 🌷\nQuiero hacer este pedido:\n\n${detalle}\n\n*Total: ${formatGs(total)}*`
  );
}
