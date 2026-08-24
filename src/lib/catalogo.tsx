import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Estado del catálogo: el home y la vista de catálogo conviven en la misma URL,
 * así que quién está abierto y con qué categoría vive acá y lo consumen el
 * navbar, las cards de categoría y la propia vista.
 */
type CatalogoCtx = {
  abierto: boolean;
  /** Categoría con la que se abrió ("Todos" = catálogo completo). */
  categoriaInicial: string;
  abrir: (categoria?: string) => void;
  cerrar: () => void;
  /** Vuelve al home (cerrando el catálogo si hacía falta) y baja a la sección. */
  irASeccion: (href: string) => void;
  /** Menú mobile abierto. Lo escribe el navbar y lo lee el botón flotante de
   *  WhatsApp, que si no se superpone al "Escribinos por WhatsApp" del menú. */
  menuAbierto: boolean;
  setMenuAbierto: (v: boolean) => void;
};

const Ctx = createContext<CatalogoCtx | null>(null);

export function CatalogoProvider({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriaInicial, setCategoriaInicial] = useState("Todos");
  // Scroll del home al momento de abrir, para devolver al usuario donde estaba.
  const scrollPrevio = useRef(0);
  // Qué hacer con el scroll una vez que el home vuelve a estar montado:
  // un selector al que bajar, o "restaurar" para volver a donde estaba.
  const [alVolver, setAlVolver] = useState<string | null>(null);

  const abrir = useCallback((categoria = "Todos") => {
    scrollPrevio.current = window.scrollY;
    setCategoriaInicial(categoria);
    setAbierto(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const cerrar = useCallback(() => {
    setAbierto(false);
    setAlVolver("restaurar");
  }, []);

  const irASeccion = useCallback(
    (href: string) => {
      if (abierto) {
        // El home todavía no está montado: el scroll queda pendiente y lo
        // resuelve el efecto de abajo, ya con el DOM del home en su lugar.
        setAbierto(false);
        setAlVolver(href);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [abierto]
  );

  useEffect(() => {
    if (abierto || !alVolver) return;
    if (alVolver === "restaurar") {
      window.scrollTo({ top: scrollPrevio.current, behavior: "auto" });
    } else {
      document.querySelector(alVolver)?.scrollIntoView({ behavior: "smooth" });
    }
    setAlVolver(null);
  }, [abierto, alVolver]);

  const value = useMemo(
    () => ({
      abierto,
      categoriaInicial,
      abrir,
      cerrar,
      irASeccion,
      menuAbierto,
      setMenuAbierto,
    }),
    [abierto, categoriaInicial, abrir, cerrar, irASeccion, menuAbierto]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalogo(): CatalogoCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCatalogo() requiere <CatalogoProvider> arriba.");
  return ctx;
}
