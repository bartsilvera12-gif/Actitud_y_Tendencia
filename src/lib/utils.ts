/** Une clases condicionalmente (mini clsx). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Formatea un número de guaraníes: 299000 -> "Gs. 299.000". */
export function formatGs(value: number): string {
  return "Gs. " + value.toLocaleString("es-PY");
}

/**
 * El precio que se cobra: la oferta si la hay, si no el de lista.
 *
 * Todo lo que sume plata —el carrito, el total, el mensaje de WhatsApp— y todo
 * lo que filtre u ordene por precio tiene que pasar por acá, o el visitante ve
 * un numero y paga otro.
 */
export function precioVigente(p: { precio: number; precioOferta: number | null }): number {
  return p.precioOferta ?? p.precio;
}

/** `true` si la prenda tiene una oferta activa. */
export function enOferta(p: { precio: number; precioOferta: number | null }): boolean {
  return p.precioOferta !== null && p.precioOferta < p.precio;
}
