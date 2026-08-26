import { supabase } from "@/lib/supabase";

/** Bucket del proyecto. Ver docs/SETUP_ADMIN.md para crearlo. */
export const BUCKET = "actitudytendencia";

const TIPOS_OK = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export type CarpetaStorage =
  | "productos"
  | "categorias"
  | "hero"
  | "lookbook"
  | "brand";

export type ResultadoSubida = { url: string; path: string };

/** Valida antes de subir. Devuelve el motivo, o null si el archivo sirve. */
export function validarImagen(file: File): string | null {
  if (!TIPOS_OK.includes(file.type)) {
    return `"${file.name}": formato no admitido. Usá JPG, PNG o WebP.`;
  }
  if (file.size > MAX_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return `"${file.name}" pesa ${mb} MB. El máximo es 5 MB.`;
  }
  return null;
}

/** Nombre único conservando la extensión, sin acentos ni espacios. */
function nombreArchivo(file: File): string {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  // Sin Date.now() a secas: dos archivos subidos en el mismo milisegundo
  // chocarían. El sufijo aleatorio lo evita.
  const sufijo = Math.random().toString(36).slice(2, 8);
  return `${base || "imagen"}-${Date.now()}-${sufijo}.${ext}`;
}

/**
 * Sube una imagen y devuelve su URL pública.
 * `subcarpeta` sirve para agrupar por producto: productos/<uuid>/archivo.webp
 */
export async function subirImagen(
  file: File,
  carpeta: CarpetaStorage,
  subcarpeta?: string
): Promise<ResultadoSubida> {
  const invalido = validarImagen(file);
  if (invalido) throw new Error(invalido);

  const path = [carpeta, subcarpeta, nombreArchivo(file)]
    .filter(Boolean)
    .join("/");

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) {
    if (/bucket not found/i.test(error.message)) {
      throw new Error(
        `No existe el bucket "${BUCKET}". Crealo en Storage (ver docs/SETUP_ADMIN.md).`
      );
    }
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/**
 * Borra del bucket. No propaga el error a propósito: si el archivo ya no
 * estaba, la fila igual tiene que poder eliminarse.
 */
/**
 * Borra varios archivos de una. Se usa al eliminar un producto: sus filas de
 * `producto_imagenes` se van en cascada, pero los archivos del bucket no.
 */
export async function borrarImagenes(paths: Array<string | null>): Promise<void> {
  const rutas = paths.filter((p): p is string => Boolean(p));
  if (rutas.length === 0) return;
  try {
    await supabase.storage.from(BUCKET).remove(rutas);
  } catch {
    /* huérfanos en el bucket: molesto, pero no bloquea al usuario */
  }
}

export async function borrarImagen(path: string | null): Promise<void> {
  if (!path) return;
  try {
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    /* huérfano en el bucket: molesto, pero no bloquea al usuario */
  }
}
