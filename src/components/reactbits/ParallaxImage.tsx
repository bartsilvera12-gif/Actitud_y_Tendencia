import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** Recorrido del parallax, en píxeles hacia cada lado. */
  amplitud?: number;
};

/**
 * Foto con parallax al hacer scroll.
 *
 * Se desplaza la tarjeta entera, no la imagen dentro de un marco fijo: así la
 * foto se ve completa. La variante que movía la imagen obligaba a escalarla
 * para no dejar bordes vacíos, y ese escalado recortaba la prenda.
 */
export default function ParallaxImage({
  src,
  alt,
  className,
  amplitud = 26,
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
  const y = useTransform(suave, [0, 1], [amplitud, -amplitud]);

  return (
    <motion.div ref={ref} style={{ y }} className={cn("overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}
