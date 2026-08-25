import { supabase } from "@/lib/supabase";
import { auditar } from "@/services/admin";
import type {
  FilaConfiguracion,
  FilaHero,
  FilaHeroChip,
  FilaLookbookItem,
  FilaRedSocial,
  FilaSeccion,
  FilaValorManifiesto,
  TemaColor,
} from "@/types/database";

/** Escrituras del contenido editable del home. RLS decide si pasan. */

/* ── Secciones del home ─────────────────────────────────────────────────── */

export async function listarSeccionesAdmin(): Promise<FilaSeccion[]> {
  const { data, error } = await supabase
    .from("secciones_home")
    .select("id, clave, eyebrow, titulo, titulo_destacado, descripcion, activo, orden, configuracion")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data as FilaSeccion[];
}

export async function guardarSeccion(
  id: string,
  datos: Partial<FilaSeccion>
): Promise<void> {
  const { error } = await supabase.from("secciones_home").update(datos).eq("id", id);
  if (error) throw error;
  await auditar("editar", "seccion_home", id, datos as Record<string, unknown>);
}

/** Intercambia el orden de dos secciones. */
export async function intercambiarOrden(
  a: FilaSeccion,
  b: FilaSeccion
): Promise<void> {
  await Promise.all([
    guardarSeccion(a.id, { orden: b.orden }),
    guardarSeccion(b.id, { orden: a.orden }),
  ]);
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

export async function obtenerHeroAdmin(): Promise<FilaHero | null> {
  const { data, error } = await supabase
    .from("hero_banners")
    .select(`
      id, etiqueta, titulo_linea_1, titulo_destacado_1, titulo_linea_2,
      titulo_destacado_2, descripcion, imagen_url, imagen_storage_path,
      activo, orden,
      hero_chips ( id, hero_id, texto, color, orden, activo )
    `)
    .order("orden", { ascending: true })
    .limit(1);
  if (error) throw error;
  return ((data as unknown as FilaHero[])[0]) ?? null;
}

export async function guardarHero(
  id: string | null,
  datos: Partial<FilaHero>
): Promise<string> {
  // Se quitan las relaciones: PostgREST rechaza columnas que no existen.
  const { hero_chips: _chips, ...limpio } = datos as FilaHero;
  if (id) {
    const { error } = await supabase.from("hero_banners").update(limpio).eq("id", id);
    if (error) throw error;
    await auditar("editar", "hero", id);
    return id;
  }
  const { data, error } = await supabase
    .from("hero_banners")
    .insert(limpio)
    .select("id")
    .single();
  if (error) throw error;
  await auditar("crear", "hero", data.id);
  return data.id as string;
}

/** Reemplaza los chips del hero conservando el orden recibido. */
export async function guardarChips(
  heroId: string,
  chips: { texto: string; color: TemaColor }[]
): Promise<void> {
  const { error: errBorrar } = await supabase
    .from("hero_chips")
    .delete()
    .eq("hero_id", heroId);
  if (errBorrar) throw errBorrar;
  if (chips.length === 0) return;
  const { error } = await supabase.from("hero_chips").insert(
    chips.map((c, orden) => ({ hero_id: heroId, texto: c.texto, color: c.color, orden }))
  );
  if (error) throw error;
}

/* ── Valores del manifiesto ─────────────────────────────────────────────── */

export async function listarValoresAdmin(): Promise<FilaValorManifiesto[]> {
  const { data, error } = await supabase
    .from("manifiesto_valores")
    .select("id, texto, color, orden, activo")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data as FilaValorManifiesto[];
}

export async function guardarValores(
  valores: { texto: string; color: TemaColor }[]
): Promise<void> {
  const { error: errBorrar } = await supabase
    .from("manifiesto_valores")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (errBorrar) throw errBorrar;
  if (valores.length === 0) return;
  const { error } = await supabase.from("manifiesto_valores").insert(
    valores.map((v, orden) => ({ texto: v.texto, color: v.color, orden }))
  );
  if (error) throw error;
}

/* ── Lookbook ───────────────────────────────────────────────────────────── */

export async function listarLookbookAdmin(): Promise<FilaLookbookItem[]> {
  const { data, error } = await supabase
    .from("lookbook_items")
    .select("id, producto_id, imagen_url, imagen_storage_path, orden, activo")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data as FilaLookbookItem[];
}

export async function agregarLookbookItem(
  datos: Partial<FilaLookbookItem>
): Promise<void> {
  const { error } = await supabase.from("lookbook_items").insert(datos);
  if (error) throw error;
  await auditar("crear", "lookbook_item", null, datos as Record<string, unknown>);
}

export async function guardarLookbookItem(
  id: string,
  datos: Partial<FilaLookbookItem>
): Promise<void> {
  const { error } = await supabase.from("lookbook_items").update(datos).eq("id", id);
  if (error) throw error;
}

export async function eliminarLookbookItem(id: string): Promise<void> {
  const { error } = await supabase.from("lookbook_items").delete().eq("id", id);
  if (error) throw error;
  await auditar("eliminar", "lookbook_item", id);
}

/* ── Redes ──────────────────────────────────────────────────────────────── */

export async function listarRedesAdmin(): Promise<FilaRedSocial[]> {
  const { data, error } = await supabase
    .from("redes_sociales")
    .select("id, tipo, nombre, usuario, url, orden, activo")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data as FilaRedSocial[];
}

export async function guardarRed(
  id: string | null,
  datos: Partial<FilaRedSocial>
): Promise<void> {
  if (id) {
    const { error } = await supabase.from("redes_sociales").update(datos).eq("id", id);
    if (error) throw error;
    await auditar("editar", "red_social", id);
  } else {
    const { error } = await supabase.from("redes_sociales").insert(datos);
    if (error) throw error;
    await auditar("crear", "red_social", null, datos as Record<string, unknown>);
  }
}

export async function eliminarRed(id: string): Promise<void> {
  const { error } = await supabase.from("redes_sociales").delete().eq("id", id);
  if (error) throw error;
  await auditar("eliminar", "red_social", id);
}

/* ── Configuración ──────────────────────────────────────────────────────── */

export async function obtenerConfigAdmin(): Promise<FilaConfiguracion | null> {
  const { data, error } = await supabase
    .from("configuracion_sitio")
    .select(`
      id, nombre_marca, logo_url, logo_storage_path, whatsapp_numero,
      whatsapp_display, whatsapp_mensaje_general, ubicacion, seo_title,
      seo_description, seo_keywords, favicon_url
    `)
    .limit(1);
  if (error) throw error;
  return ((data as FilaConfiguracion[])[0]) ?? null;
}

export async function guardarConfig(
  id: string | null,
  datos: Partial<FilaConfiguracion>
): Promise<void> {
  if (id) {
    const { error } = await supabase.from("configuracion_sitio").update(datos).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("configuracion_sitio").insert(datos);
    if (error) throw error;
  }
  await auditar("editar", "configuracion", id);
}

/** wa.me exige solo dígitos: sin +, espacios ni guiones. */
export function normalizarWhatsapp(valor: string): string {
  return valor.replace(/\D/g, "");
}
