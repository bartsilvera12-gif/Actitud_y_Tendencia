import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
};

/** Texto con relleno en degradado de marca. */
export default function GradientText({
  children,
  className,
  from = "var(--color-salvia-700)",
  via = "var(--color-salvia-600)",
  to = "var(--color-dorado)",
}: Props) {
  return (
    <span
      className={cn("bg-clip-text text-transparent", className)}
      style={{ backgroundImage: `linear-gradient(100deg, ${from}, ${via}, ${to})` }}
    >
      {children}
    </span>
  );
}
