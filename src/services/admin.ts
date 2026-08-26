import { borrarImagenes } from "@/services/storage";
import { supabase } from "@/lib/supabase";
import type {
  FilaCategoria,
  FilaImagen,
  FilaLinea,
  FilaProducto,
  FilaTalle,
} from "@/types/database";

/**
 * Escrituras del panel.
 *
 * RLS decide si pasan o no: estas funciones fallan solas si quien las llama no
 * es un administrador activo. La UI no es la que autoriza.
 */

/** Texto → slug. Misma regla que `actitudytendencia.slugify()` en la base. */
export function generarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** ¿Ya existe ese slug? `exceptoId` evita chocar consigo mismo al editar. */
export async function slugDisponible(
  tabla: "productos" | "categorias" | "lineas",
  slug: string,
  exceptoId?: string
): Promise<boolean> {
  let q = supabase.from(tabla).select("id").eq("slug", slug).limit(1);
  if (exceptoId) q = q.neq("id", exceptoId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).length === 0;
}

/** Slug libre agregando -2, -3… si hace falta. */
export async function slugLibre(
  tabla: "productos" | "categorias" | "lineas",
  base: string,
  exceptoId?: string
): Promise<string> {
  const raiz = generarSlug(base) || "sin-nombre";
  let intento = raiz;
  let n = 2;
  while (!(await slugDisponible(tabla, intento, exceptoId))) {
    intento = `${raiz}-${n++}`;
    if (n > 50) break; // guarda contra un bucle infinito
  }
  return intento;
}

/* ── Auditoría ──────────────────────────────────────────────────────────── */

/**
 * Registra una acción administrativa. Nunca corta la operación principal: si
 * la auditoría falla, el producto igual se guardó.
 */
export async function auditar(
  accion: string,
  entidad: string,
  entidadId: string | null,
  datos: Record<string, unknown> = {}
): Promise<void> {
  try {
    const { data: sesion } = await supabase.auth.getUser();
    await supabase.from("auditoria").insert({
      usuario_id: sesion.user?.id ?? null,
      accion,
      entidad,
      entidad_id: entidadId,
      datos,
    });
  } catch {
    /* la auditoría es secundaria: no se le arruina la operación al usuario */
  }
}

/* ── Productos ──────────────────────────────────────────────────────────── */

export type ProductoAdmin = FilaProducto & {
  categoria: { nombre: string } | null;
  linea: { nombre: string } | null;
  producto_imagenes: Pick<FilaImagen, "url" | "principal" | "orden">[];
};

const CAMPOS_ADMIN = `
  id, slug, nombre, categoria_id, linea_id, color, precio, descripcion,
  tipo_talle, nuevo, destacado, activo, mostrar_home, orden_home,
  orden_catalogo, seo_title, seo_description, created_at, updated_at,
  categoria:categorias ( nombre ),
  linea:lineas ( nombre ),
  producto_imagenes ( url, principal, orden )
`;

/** Listado del panel: incluye inactivos, que el público no ve. */
export async function listarProductos(): Promise<ProductoAdmin[]> {
  const { data, error } = await supabase
    .from("productos")
    .select(CAMPOS_ADMIN)
    .order("orden_catalogo", { ascending: true });
  if (error) throw error;
  return data as unknown as ProductoAdmin[];
}

export type ProductoDetalle = ProductoAdmin & {
  producto_talles: FilaTalle[];
  imagenes: FilaImagen[];
};

export async function obtenerProductoPorSlug(
  slug: string
): Promise<ProductoDetalle | null> {
  const { data, error } = await supabase
    .from("productos")
    .select(
      CAMPOS_ADMIN +
        `, producto_talles ( id, producto_id, talle, orden, activo, stock ),
           imagenes:producto_imagenes ( id, producto_id, url, storage_path, alt_text, orden, principal )`
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ProductoDetalle) ?? null;
}

export type DatosProducto = {
  nombre: string;
  slug: string;
  categoria_id: string | null;
  linea_id: string | null;
  color: string | null;
  precio: number;
  descripcion: string | null;
  tipo_talle: "numerico" | "letra" | "unico";
  nuevo: boolean;
  destacado: boolean;
  activo: boolean;
  mostrar_home: boolean;
  orden_home: number;
  orden_catalogo: number;
  seo_title: string | null;
  seo_description: string | null;
};

export async function crearProducto(datos: DatosProducto): Promise<string> {
  const { data, error } = await supabase
    .from("productos")
    .insert(datos)
    .select("id")
    .single();
  if (error) throw error;
  await auditar("crear", "producto", data.id, { nombre: datos.nombre });
  return data.id as string;
}

export async function actualizarProducto(
  id: string,
  datos: Partial<DatosProducto>
): Promise<void> {
  const { error } = await supabase.from("productos").update(datos).eq("id", id);
  if (error) throw error;
  await auditar("editar", "producto", id, datos as Record<string, unknown>);
}

/** Baja lógica. Se prefiere a borrar: no rompe nada que apunte al producto. */
export async function alternarActivoProducto(
  id: string,
  activo: boolean
): Promise<void> {
  const { error } = await supabase.from("productos").update({ activo }).eq("id", id);
  if (error) throw error;
  await auditar(activo ? "activar" : "desactivar", "producto", id);
}

export async function eliminarProducto(id: string): Promise<void> {
  // Las filas de `producto_imagenes` caen en cascada, pero los archivos del
  // bucket no. Hay que juntar las rutas ANTES del delete o se pierden y las
  // fotos quedan huérfanas ocupando lugar para siempre.
  const { data: imagenes } = await supabase
    .from("producto_imagenes")
    .select("storage_path")
    .eq("producto_id", id);

  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw error;

  await borrarImagenes((imagenes ?? []).map((i) => i.storage_path));
  await auditar("eliminar", "producto", id);
}

/** Duplica producto, talles e imágenes con un slug nuevo. */
export async function duplicarProducto(slug: string): Promise<string> {
  const orig = await obtenerProductoPorSlug(slug);
  if (!orig) throw new Error("No se encontró el producto a duplicar");

  const nuevoSlug = await slugLibre("productos", orig.slug + "-copia");
  const id = await crearProducto({
    nombre: orig.nombre + " (copia)",
    slug: nuevoSlug,
    categoria_id: orig.categoria_id,
    linea_id: orig.linea_id,
    color: orig.color,
    precio: Number(orig.precio),
    descripcion: orig.descripcion,
    tipo_talle: orig.tipo_talle,
    nuevo: orig.nuevo,
    destacado: false,
    // La copia arranca inactiva: se revisa antes de publicarla.
    activo: false,
    mostrar_home: orig.mostrar_home,
    orden_home: orig.orden_home,
    orden_catalogo: orig.orden_catalogo,
    seo_title: orig.seo_title,
    seo_description: orig.seo_description,
  });

  await guardarTalles(id, orig.producto_talles.map((t) => t.talle));
  if (orig.imagenes.length > 0) {
    const { error } = await supabase.from("producto_imagenes").insert(
      orig.imagenes.map((i) => ({
        producto_id: id,
        url: i.url,
        storage_path: i.storage_path,
        alt_text: i.alt_text,
        orden: i.orden,
        principal: i.principal,
      }))
    );
    if (error) throw error;
  }
  return nuevoSlug;
}

/* ── Talles ─────────────────────────────────────────────────────────────── */

/** Reemplaza el set de talles respetando el orden recibido. */
export async function guardarTalles(
  productoId: string,
  talles: string[]
): Promise<void> {
  const { error: errBorrar } = await supabase
    .from("producto_talles")
    .delete()
    .eq("producto_id", productoId);
  if (errBorrar) throw errBorrar;

  if (talles.length === 0) return;
  const { error } = await supabase.from("producto_talles").insert(
    talles.map((talle, orden) => ({ producto_id: productoId, talle, orden }))
  );
  if (error) throw error;
}

/* ── Imágenes ───────────────────────────────────────────────────────────── */

export async function agregarImagen(
  productoId: string,
  url: string,
  storagePath: string | null,
  orden: number,
  principal: boolean
): Promise<void> {
  const { error } = await supabase.from("producto_imagenes").insert({
    producto_id: productoId,
    url,
    storage_path: storagePath,
    orden,
    principal,
  });
  if (error) throw error;
}

export async function eliminarImagen(id: string): Promise<void> {
  const { error } = await supabase.from("producto_imagenes").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Reordena y fija la portada.
 *
 * La principal se limpia primero: hay un índice único parcial que impide dos
 * portadas por producto, y actualizar en otro orden lo violaría a mitad.
 */
export async function reordenarImagenes(
  productoId: string,
  ids: string[],
  principalId: string | null
): Promise<void> {
  const { error: errLimpiar } = await supabase
    .from("producto_imagenes")
    .update({ principal: false })
    .eq("producto_id", productoId);
  if (errLimpiar) throw errLimpiar;

  for (const [orden, id] of ids.entries()) {
    const { error } = await supabase
      .from("producto_imagenes")
      .update({ orden, principal: id === principalId })
      .eq("id", id);
    if (error) throw error;
  }
}

/* ── Categorías y líneas ────────────────────────────────────────────────── */

export async function listarCategoriasAdmin(): Promise<FilaCategoria[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre, slug, descripcion, imagen_url, imagen_storage_path, tema_color, flor_key, orden, activo")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data as FilaCategoria[];
}

export async function guardarCategoria(
  id: string | null,
  datos: Partial<FilaCategoria>
): Promise<void> {
  if (id) {
    const { error } = await supabase.from("categorias").update(datos).eq("id", id);
    if (error) throw error;
    await auditar("editar", "categoria", id, datos as Record<string, unknown>);
  } else {
    const { data, error } = await supabase
      .from("categorias")
      .insert(datos)
      .select("id")
      .single();
    if (error) throw error;
    await auditar("crear", "categoria", data.id, datos as Record<string, unknown>);
  }
}

export async function eliminarCategoria(id: string): Promise<void> {
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) throw error;
  await auditar("eliminar", "categoria", id);
}

export async function listarLineasAdmin(): Promise<FilaLinea[]> {
  const { data, error } = await supabase
    .from("lineas")
    .select("id, nombre, slug, descripcion, imagen_url, orden, activo")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data as FilaLinea[];
}

export async function guardarLinea(
  id: string | null,
  datos: Partial<FilaLinea>
): Promise<void> {
  if (id) {
    const { error } = await supabase.from("lineas").update(datos).eq("id", id);
    if (error) throw error;
    await auditar("editar", "linea", id, datos as Record<string, unknown>);
  } else {
    const { data, error } = await supabase
      .from("lineas")
      .insert(datos)
      .select("id")
      .single();
    if (error) throw error;
    await auditar("crear", "linea", data.id, datos as Record<string, unknown>);
  }
}

export async function eliminarLinea(id: string): Promise<void> {
  const { error } = await supabase.from("lineas").delete().eq("id", id);
  if (error) throw error;
  await auditar("eliminar", "linea", id);
}

/** Mensaje legible de un error de PostgREST. */
export function mensajeError(e: unknown): string {
  if (typeof e === "object" && e !== null) {
    const err = e as { message?: string; code?: string; details?: string };
    if (err.code === "PGRST106")
      return "El schema no está expuesto en PostgREST. Ver docs/SETUP_ADMIN.md";
    if (err.code === "23503")
      return "No se puede eliminar: hay productos que dependen de este registro.";
    if (err.code === "23505") return "Ya existe un registro con ese slug.";
    if (err.code === "42501")
      return "Tu usuario no tiene permisos para esta acción.";
    if (err.message) return err.message;
  }
  return String(e);
}
