import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useDatos } from "@/lib/datos";
import type { Product } from "@/types/contenido";
import { precioVigente } from "@/lib/utils";

export type ItemCarrito = {
  id: string;
  /** Talle elegido: la misma prenda en dos talles son dos líneas distintas. */
  talle: string;
  cantidad: number;
};

/** Línea del carrito ya resuelta contra el catálogo. */
export type LineaCarrito = ItemCarrito & { producto: Product; subtotal: number };

type Panel = "carrito" | "favoritos" | null;

type TiendaCtx = {
  carrito: ItemCarrito[];
  lineas: LineaCarrito[];
  total: number;
  unidades: number;
  agregar: (id: string, talle: string, cantidad?: number) => void;
  cambiarCantidad: (id: string, talle: string, cantidad: number) => void;
  quitar: (id: string, talle: string) => void;
  vaciar: () => void;

  favoritos: string[];
  esFavorito: (id: string) => boolean;
  alternarFavorito: (id: string) => void;

  panel: Panel;
  abrirPanel: (p: Exclude<Panel, null>) => void;
  cerrarPanel: () => void;
};

const Ctx = createContext<TiendaCtx | null>(null);

const CLAVE_CARRITO = "ayt.carrito";
const CLAVE_FAVORITOS = "ayt.favoritos";

/** Lee del localStorage tolerando JSON corrupto o storage bloqueado. */
function leer<T>(clave: string, porDefecto: T): T {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? (JSON.parse(raw) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function guardar(clave: string, valor: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* modo privado o cuota llena: el carrito sigue vivo en memoria */
  }
}

export function TiendaProvider({ children }: { children: ReactNode }) {
  // El catálogo ya no se importa: viene de la base a través de DatosProvider.
  const { productos } = useDatos();
  const [carrito, setCarrito] = useState<ItemCarrito[]>(() =>
    leer<ItemCarrito[]>(CLAVE_CARRITO, [])
  );
  const [favoritos, setFavoritos] = useState<string[]>(() =>
    leer<string[]>(CLAVE_FAVORITOS, [])
  );
  const [panel, setPanel] = useState<Panel>(null);

  useEffect(() => guardar(CLAVE_CARRITO, carrito), [carrito]);
  useEffect(() => guardar(CLAVE_FAVORITOS, favoritos), [favoritos]);

  const agregar = useCallback((id: string, talle: string, cantidad = 1) => {
    setCarrito((prev) => {
      const i = prev.findIndex((l) => l.id === id && l.talle === talle);
      if (i === -1) return [...prev, { id, talle, cantidad }];
      const copia = [...prev];
      copia[i] = { ...copia[i], cantidad: copia[i].cantidad + cantidad };
      return copia;
    });
  }, []);

  const cambiarCantidad = useCallback(
    (id: string, talle: string, cantidad: number) => {
      setCarrito((prev) =>
        cantidad <= 0
          ? prev.filter((l) => !(l.id === id && l.talle === talle))
          : prev.map((l) =>
              l.id === id && l.talle === talle ? { ...l, cantidad } : l
            )
      );
    },
    []
  );

  const quitar = useCallback((id: string, talle: string) => {
    setCarrito((prev) => prev.filter((l) => !(l.id === id && l.talle === talle)));
  }, []);

  const vaciar = useCallback(() => setCarrito([]), []);

  const alternarFavorito = useCallback((id: string) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const esFavorito = useCallback(
    (id: string) => favoritos.includes(id),
    [favoritos]
  );

  const abrirPanel = useCallback((p: Exclude<Panel, null>) => setPanel(p), []);
  const cerrarPanel = useCallback(() => setPanel(null), []);

  // Se resuelve contra el catálogo y se descartan las líneas cuyo producto ya
  // no exista o esté inactivo, para no romper carritos guardados de antes.
  const lineas = useMemo<LineaCarrito[]>(
    () =>
      carrito.flatMap((l) => {
        const producto = productos.find((p) => p.id === l.id);
        if (!producto) return [];
        return [{ ...l, producto, subtotal: precioVigente(producto) * l.cantidad }];
      }),
    [carrito, productos]
  );

  const total = useMemo(
    () => lineas.reduce((acc, l) => acc + l.subtotal, 0),
    [lineas]
  );
  const unidades = useMemo(
    () => lineas.reduce((acc, l) => acc + l.cantidad, 0),
    [lineas]
  );

  const value = useMemo(
    () => ({
      carrito,
      lineas,
      total,
      unidades,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      favoritos,
      esFavorito,
      alternarFavorito,
      panel,
      abrirPanel,
      cerrarPanel,
    }),
    [
      carrito,
      lineas,
      total,
      unidades,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      favoritos,
      esFavorito,
      alternarFavorito,
      panel,
      abrirPanel,
      cerrarPanel,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTienda(): TiendaCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTienda() requiere <TiendaProvider> arriba.");
  return ctx;
}
