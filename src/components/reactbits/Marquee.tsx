import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  items: ReactNode[];
  className?: string;
  /** segundos por vuelta */
  speed?: number;
  reverse?: boolean;
};

/** Cinta infinita horizontal (duplica el contenido para loop continuo). */
export default function Marquee({
  items,
  className,
  speed = 38,
  reverse = false,
}: Props) {
  return (
    <div className={cn("marquee-mask relative overflow-hidden", className)}>
      <div
        className="flex w-max"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
            {items.map((item, i) => (
              <div key={i} className="flex items-center">
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
