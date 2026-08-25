import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tipo = "ok" | "error";
type Toast = { id: number; tipo: Tipo; texto: string };

type ToastCtx = {
  ok: (texto: string) => void;
  error: (texto: string) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

const ESTILO: Record<Tipo, { caja: string; icono: ReactNode }> = {
  ok: {
    caja: "bg-salvia-600 text-crema",
    icono: <Check className="h-4 w-4" />,
  },
  error: {
    caja: "bg-rosa text-tinta",
    icono: <TriangleAlert className="h-4 w-4" />,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((tipo: Tipo, texto: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((t) => [...t, { id, tipo, texto }]);
    // Los errores duran más: suelen traer texto que hay que leer.
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)),
      tipo === "error" ? 7000 : 3500);
  }, []);

  const value = useMemo(
    () => ({
      ok: (texto: string) => push("ok", texto),
      error: (texto: string) => push("error", texto),
    }),
    [push]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(22rem,calc(100vw-2.5rem))] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              role="status"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className={cn(
                "pointer-events-auto flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm shadow-lg",
                ESTILO[t.tipo].caja
              )}
            >
              <span className="mt-0.5 shrink-0">{ESTILO[t.tipo].icono}</span>
              <span className="flex-1 leading-relaxed">{t.texto}</span>
              <button
                onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
                aria-label="Cerrar aviso"
                className="-mr-1 shrink-0 rounded-full p-1 transition-opacity hover:opacity-70"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast() requiere <ToastProvider> arriba.");
  return ctx;
}
