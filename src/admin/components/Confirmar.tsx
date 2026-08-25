import { AnimatePresence, motion } from "framer-motion";
import { Loader2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  /** Texto del botón que confirma. Debe nombrar la acción, no decir "OK". */
  confirmar?: string;
  cancelar?: string;
  /** `peligro` para acciones destructivas. */
  tono?: "peligro" | "normal";
  procesando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

/** Modal de confirmación de la marca, en lugar de window.confirm(). */
export default function Confirmar({
  abierto,
  titulo,
  mensaje,
  confirmar = "Confirmar",
  cancelar = "Cancelar",
  tono = "normal",
  procesando = false,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-tinta/45 backdrop-blur-sm"
            onClick={procesando ? undefined : onCancelar}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-label={titulo}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-md rounded-[1.75rem] bg-crema p-7 shadow-2xl"
          >
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                tono === "peligro" ? "bg-rosa/40" : "bg-menta"
              )}
            >
              <TriangleAlert
                className={cn(
                  "h-5 w-5",
                  tono === "peligro" ? "text-tinta" : "text-salvia-700"
                )}
              />
            </span>

            <h2 className="mt-5 font-display text-2xl text-tinta">{titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-tinta-500">{mensaje}</p>

            <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancelar}
                disabled={procesando}
                className="min-h-11 rounded-full border border-salvia/40 px-5 text-sm font-medium text-tinta transition-colors hover:bg-salvia/15 disabled:opacity-50"
              >
                {cancelar}
              </button>
              <button
                type="button"
                onClick={onConfirmar}
                disabled={procesando}
                className={cn(
                  "flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors disabled:opacity-60",
                  tono === "peligro"
                    ? "bg-tinta text-crema hover:bg-tinta/85"
                    : "bg-salvia-600 text-crema hover:bg-salvia-700"
                )}
              >
                {procesando && <Loader2 className="h-4 w-4 animate-spin" />}
                {confirmar}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
