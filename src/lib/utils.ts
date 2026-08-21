/** Une clases condicionalmente (mini clsx). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Formatea un número de guaraníes: 299000 -> "Gs. 299.000". */
export function formatGs(value: number): string {
  return "Gs. " + value.toLocaleString("es-PY");
}
