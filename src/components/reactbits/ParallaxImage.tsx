import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** Recorrido del parallax, en % del alto de la foto. */
  amplitud?: number;
};

/**
 * Foto con parallax al hacer scroll: se desplaza en sentido contrario al de la
 * página, apenas. La imagen se renderiza más grande (`scale`) para que el
 * desplazamiento nunca deje un borde vacío dentro del recorte.
 */
export default function ParallaxImage({
  src,
  alt,
  className,
  amplitud = 7,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // El spring saca lo brusco del scroll con rueda o trackpad.
  const suave = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const y = useTransform(suave, [0, 1], [`-${amplitud}%`, `${amplitud}%`]);

  return (
    <div ref={ref} className={cn("group overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y, scale: 1 + amplitud / 100 + 0.06 }}
        className="h-full w-full object-cover transition-transform duration-700 will-change-transform"
      />
    </div>
  );
}
