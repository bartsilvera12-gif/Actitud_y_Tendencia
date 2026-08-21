import { flores, type FlorKey } from "@/lib/flowers";
import { cn } from "@/lib/utils";

type Props = {
  flor: FlorKey;
  className?: string;
  /** rotación en grados */
  rotate?: number;
  /** flotar suavemente */
  float?: boolean;
  /** opacidad 0-100 */
  opacity?: number;
  /** espejar horizontalmente */
  flip?: boolean;
  delay?: number;
};

/**
 * Acento floral acuarelado. Decorativo (las flores acompañan, no compiten).
 * Se posiciona con clases utilitarias desde el contenedor padre (absolute).
 */
export default function FloralAccent({
  flor,
  className,
  rotate = 0,
  float = false,
  opacity = 100,
  flip = false,
  delay = 0,
}: Props) {
  return (
    <img
      src={flores[flor]}
      alt=""
      aria-hidden
      loading="lazy"
      className={cn("pointer-events-none absolute select-none", className)}
      style={{
        transform: `rotate(${rotate}deg)${flip ? " scaleX(-1)" : ""}`,
        opacity: opacity / 100,
        animation: float ? `float ${7 + delay}s ease-in-out ${delay}s infinite` : undefined,
      }}
    />
  );
}
