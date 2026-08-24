import { supabase } from "@/lib/supabase";
import type {
  FilaCategoria,
  FilaLinea,
  FilaProductoCompleto,
} from "@/types/database";
import type { Categoria, Linea, Product } from "@/types/contenido";

/**
 * Acceso al catálogo. Todas las consultas del sitio público pasan por acá:
 * ningún componente habla con Supabase directamente.
 */

// Se piden solo las columnas que la UI usa; nada de select *.
const CAMPOS_PRODUCTO = `
  id, slug, nombre, color, precio, descripcion, tipo_talle,
  nuevo, destacado, mostrar_home, orden_home, orden_catalogo,
  categoria:categorias ( nombre, slug, tema_color, flor_key ),
  linea:lineas ( nombre, slug ),
  producto_talles ( talle, orden ),
  producto_imagenes ( url, alt_text, orden, principal )
`;

/** Fila de la base → el shape que ya usaban los componentes. */
export function mapProducto(fila: FilaProductoCompleto): Product {
  const talles = [...(fila.producto_talles ?? [])]
    .sort((a, b) => a.orden - b.orden)
    .map((t) => t.talle);

  // La principal primero; el resto por orden.
  const fotos = [...(fila.producto_imagenes ?? [])]
    .sort((a, b) => {
      if (a.principal !== b.principal) return a.principal ? -1 : 1;
      return a.orden - b.orden;
    })
    .map((i) => i.url);

  return {
    id: fila.slug,
    uuid: fila.id,
    nombre: fila.nombre,
    linea: fila.linea?.nombre ?? "",
    categoria: fila.categoria?.nombre ?? "",
    color: fila.color ?? "",
    precio: Number(fila.precio) || 0,
    talles,
    tipoTalle: fila.tipo_talle,
    descripcion: fila.descripcion ?? "",
    fotos,
    nuevo: fila.nuevo,
    destacado: fila.destacado,
    mostrarHome: fila.mostrar_home,
    ordenHome: fila.orden_home,
    ordenCatalogo: fila.orden_catalogo,
  };
}

export function mapCategoria(fila: FilaCategoria): Categoria {
  return {
    id: fila.id,
    nombre: fila.nombre,
    slug: fila.slug,
    descripcion: fila.descripcion,
    imagenUrl: fila.imagen_url,
    temaColor: fila.tema_color,
    florKey: fila.flor_key,
    orden: fila.orden,
  };
}

export function mapLinea(fila: FilaLinea): Linea {
  return {
    id: fila.id,
    nombre: fila.nombre,
    slug: fila.slug,
    orden: fila.orden,
  };
}

export async function obtenerProductos(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("productos")
    .select(CAMPOS_PRODUCTO)
    .eq("activo", true)
    .order("orden_catalogo", { ascending: true });

  if (error) throw error;
  return (data as unknown as FilaProductoCompleto[]).map(mapProducto);
}

export async function obtenerCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre, slug, descripcion, imagen_url, imagen_storage_path, tema_color, flor_key, orden, activo")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) throw error;
  return (data as FilaCategoria[]).map(mapCategoria);
}

export async function obtenerLineas(): Promise<Linea[]> {
  const { data, error } = await supabase
    .from("lineas")
    .select("id, nombre, slug, descripcion, imagen_url, orden, activo")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) throw error;
  return (data as FilaLinea[]).map(mapLinea);
}
