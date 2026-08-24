import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  obtenerCategorias,
  obtenerLineas,
  obtenerProductos,
} from "@/services/catalogo";
import {
  obtenerConfiguracion,
  obtenerHero,
  obtenerLookbook,
  obtenerRedes,
  obtenerSecciones,
  obtenerValoresManifiesto,
} from "@/services/contenido";
import { supabaseConfigurado } from "@/lib/supabase";
import type {
  Categoria,
  ConfiguracionSitio,
  Hero,
  Linea,
  LookbookItem,
  Product,
  RedSocial,
  Seccion,
  ValorManifiesto,
} from "@/types/contenido";
import type { ClaveSeccion } from "@/types/database";

/**
 * Carga única de todo el contenido del sitio.
 *
 * El catálogo son ~10 productos y un puñado de textos: traerlo de una es más
 * barato que una consulta por sección, y evita que cada componente hable con
 * Supabase por su cuenta. `refrescar()` lo vuelve a pedir después de guardar
 * desde el panel, sin recargar la página.
 */
type DatosCtx = {
  productos: Product[];
  categorias: Categoria[];
  lineas: Linea[];
  secciones: Seccion[];
  hero: Hero | null;
  valores: ValorManifiesto[];
  lookbook: LookbookItem[];
  redes: RedSocial[];
  config: ConfiguracionSitio | null;
  cargando: boolean;
  error: string | null;
  refrescar: () => Promise<void>;
  /** Sección por clave; `null` si está oculta desde el panel. */
  seccion: (clave: ClaveSeccion) => Seccion | null;
  /** Producto por slug, respetando lo que esté activo. */
  productoPorId: (id: string) => Product | undefined;
};

const Ctx = createContext<DatosCtx | null>(null);

const VACIO = {
  productos: [] as Product[],
  categorias: [] as Categoria[],
  lineas: [] as Linea[],
  secciones: [] as Seccion[],
  hero: null as Hero | null,
  valores: [] as ValorManifiesto[],
  lookbook: [] as LookbookItem[],
  redes: [] as RedSocial[],
  config: null as ConfiguracionSitio | null,
};

export function DatosProvider({ children }: { children: ReactNode }) {
  const [datos, setDatos] = useState(VACIO);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!supabaseConfigurado) {
      setError(
        "Faltan las variables de Supabase. Ver docs/SETUP_ADMIN.md"
      );
      setCargando(false);
      return;
    }

    setError(null);
    try {
      const [
        productos,
        categorias,
        lineas,
        secciones,
        hero,
        valores,
        lookbook,
        redes,
        config,
      ] = await Promise.all([
        obtenerProductos(),
        obtenerCategorias(),
        obtenerLineas(),
        obtenerSecciones(),
        obtenerHero(),
        obtenerValoresManifiesto(),
        obtenerLookbook(),
        obtenerRedes(),
        obtenerConfiguracion(),
      ]);
      setDatos({
        productos,
        categorias,
        lineas,
        secciones,
        hero,
        valores,
        lookbook,
        redes,
        config,
      });
    } catch (e) {
      // Los errores de PostgREST no son instancias de Error: traen
      // { message, code, hint }. Sin esto el aviso decía "[object Object]".
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e !== null && "message" in e
            ? String((e as { message: unknown }).message)
            : String(e);
      // El caso típico: el schema no está expuesto en PostgREST todavía.
      setError(
        /schema|404|not found/i.test(msg)
          ? "No se puede leer el contenido. Verificá que el schema esté expuesto en PostgREST (ver docs/SETUP_ADMIN.md)."
          : msg
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  // Si las secciones no cargaron (base caída o schema sin exponer) se devuelve
  // una sección vacía pero visible, para que el sitio se arme con los textos
  // por defecto de cada componente en vez de quedar sin contenido. Cuando sí
  // cargaron, una clave ausente significa "ocultada desde el panel".
  const seccion = useCallback(
    (clave: ClaveSeccion): Seccion | null =>
      datos.secciones.length === 0
        ? {
            clave,
            eyebrow: null,
            titulo: null,
            tituloDestacado: null,
            descripcion: null,
            activo: true,
            orden: 0,
            configuracion: {},
          }
        : (datos.secciones.find((s) => s.clave === clave && s.activo) ?? null),
    [datos.secciones]
  );

  const productoPorId = useCallback(
    (id: string) => datos.productos.find((p) => p.id === id),
    [datos.productos]
  );

  const value = useMemo(
    () => ({ ...datos, cargando, error, refrescar: cargar, seccion, productoPorId }),
    [datos, cargando, error, cargar, seccion, productoPorId]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDatos(): DatosCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDatos() requiere <DatosProvider> arriba.");
  return ctx;
}

/* Hooks de conveniencia, para que los componentes pidan solo lo suyo. */

export function useProductos() {
  const { productos, cargando, error } = useDatos();
  return { productos, cargando, error };
}

export function useCategorias() {
  const { categorias, cargando } = useDatos();
  return { categorias, cargando };
}

export function useConfiguracion() {
  return useDatos().config;
}

export function useSeccion(clave: ClaveSeccion) {
  return useDatos().seccion(clave);
}
