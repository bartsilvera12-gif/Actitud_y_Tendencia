import { supabase } from "@/lib/supabase";
import type {
  FilaConfiguracion,
  FilaHero,
  FilaLookbookItem,
  FilaRedSocial,
  FilaSeccion,
  FilaValorManifiesto,
} from "@/types/database";
import type {
  ConfiguracionSitio,
  Hero,
  LookbookItem,
  RedSocial,
  Seccion,
  ValorManifiesto,
} from "@/types/contenido";

/** Contenido editable del home: textos, hero, manifiesto, lookbook, redes. */

export async function obtenerSecciones(): Promise<Seccion[]> {
  const { data, error } = await supabase
    .from("secciones_home")
    .select("id, clave, eyebrow, titulo, titulo_destacado, descripcion, activo, orden, configuracion")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) throw error;
  return (data as FilaSeccion[]).map((f) => ({
    clave: f.clave,
    eyebrow: f.eyebrow,
    titulo: f.titulo,
    tituloDestacado: f.titulo_destacado,
    descripcion: f.descripcion,
    activo: f.activo,
    orden: f.orden,
    configuracion: f.configuracion ?? {},
  }));
}

export async function obtenerHero(): Promise<Hero | null> {
  const { data, error } = await supabase
    .from("hero_banners")
    .select(`
      id, etiqueta, titulo_linea_1, titulo_destacado_1, titulo_linea_2,
      titulo_destacado_2, descripcion, imagen_url, activo, orden,
      hero_chips ( id, texto, color, orden, activo )
    `)
    .eq("activo", true)
    .order("orden", { ascending: true })
    .limit(1);

  if (error) throw error;
  const fila = (data as unknown as FilaHero[])[0];
  if (!fila) return null;

  return {
    id: fila.id,
    etiqueta: fila.etiqueta,
    tituloLinea1: fila.titulo_linea_1,
    tituloDestacado1: fila.titulo_destacado_1,
    tituloLinea2: fila.titulo_linea_2,
    tituloDestacado2: fila.titulo_destacado_2,
    descripcion: fila.descripcion,
    imagenUrl: fila.imagen_url,
    chips: (fila.hero_chips ?? [])
      .filter((c) => c.activo)
      .sort((a, b) => a.orden - b.orden)
      .map((c) => ({ id: c.id, texto: c.texto, color: c.color })),
  };
}

export async function obtenerValoresManifiesto(): Promise<ValorManifiesto[]> {
  const { data, error } = await supabase
    .from("manifiesto_valores")
    .select("id, texto, color, orden, activo")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) throw error;
  return (data as FilaValorManifiesto[]).map((f) => ({
    id: f.id,
    texto: f.texto,
    color: f.color,
  }));
}

export async function obtenerLookbook(): Promise<LookbookItem[]> {
  const { data, error } = await supabase
    .from("lookbook_items")
    .select("id, producto_id, imagen_url, imagen_storage_path, orden, activo")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) throw error;
  return (data as FilaLookbookItem[]).map((f) => ({
    id: f.id,
    productoId: f.producto_id,
    imagenUrl: f.imagen_url,
  }));
}

export async function obtenerRedes(): Promise<RedSocial[]> {
  const { data, error } = await supabase
    .from("redes_sociales")
    .select("id, tipo, nombre, usuario, url, orden, activo")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) throw error;
  return (data as FilaRedSocial[]).map((f) => ({
    id: f.id,
    tipo: f.tipo,
    nombre: f.nombre,
    usuario: f.usuario,
    url: f.url,
  }));
}

export async function obtenerConfiguracion(): Promise<ConfiguracionSitio | null> {
  const { data, error } = await supabase
    .from("configuracion_sitio")
    .select(`
      id, nombre_marca, logo_url, whatsapp_numero, whatsapp_display,
      whatsapp_mensaje_general, ubicacion, seo_title, seo_description,
      seo_keywords, favicon_url
    `)
    .limit(1);

  if (error) throw error;
  const f = (data as FilaConfiguracion[])[0];
  if (!f) return null;

  return {
    nombreMarca: f.nombre_marca,
    logoUrl: f.logo_url,
    whatsappNumero: f.whatsapp_numero,
    whatsappDisplay: f.whatsapp_display ?? f.whatsapp_numero,
    whatsappMensajeGeneral:
      f.whatsapp_mensaje_general ??
      "¡Hola Actitud & Tendencia! 🌷 Quería consultar por la nueva colección.",
    ubicacion: f.ubicacion,
    seoTitle: f.seo_title,
    seoDescription: f.seo_description,
    seoKeywords: f.seo_keywords,
    faviconUrl: f.favicon_url,
  };
}
