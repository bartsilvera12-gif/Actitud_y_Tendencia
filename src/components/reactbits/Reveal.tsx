import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
};

/**
 * Reveal con máscara: la línea entra deslizándose desde abajo de un recorte,
 * como un telón. Se nota mucho más que un fade con desplazamiento chico.
 *
 * El padding/margen negativo de 0.22em da aire a las colas de la itálica
 * (Cormorant tiene descendentes largas) sin romper el interlineado.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 1.05,
}: Props) {
  return (
    <span className={cn("block overflow-hidden pb-[0.22em] -mb-[0.22em]", className)}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "115%" }}
        animate={{ y: "0%" }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
