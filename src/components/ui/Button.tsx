import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "salvia" | "gold" | "outline" | "whatsapp" | "ghost" | "cream";
type Size = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  className?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  "aria-label"?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 will-change-transform active:scale-[0.98] disabled:opacity-50";

const variants: Record<Variant, string> = {
  salvia:
    "bg-salvia-600 text-crema hover:bg-salvia-700 shadow-[0_10px_30px_-12px_rgba(94,138,111,0.7)] hover:shadow-[0_16px_40px_-14px_rgba(94,138,111,0.8)] hover:-translate-y-0.5",
  gold:
    "bg-gradient-to-r from-dorado-700 via-dorado to-dorado-700 bg-[length:200%_auto] text-white hover:bg-right shadow-[0_10px_30px_-12px_rgba(201,164,74,0.75)] hover:-translate-y-0.5",
  outline:
    "border border-salvia-600/50 text-tinta hover:border-salvia-600 hover:bg-salvia/15 hover:-translate-y-0.5",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#1eb955] shadow-[0_10px_30px_-12px_rgba(37,211,102,0.8)] hover:-translate-y-0.5",
  ghost: "text-tinta hover:text-salvia-700",
  cream:
    "bg-crema text-tinta hover:bg-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

export default function Button({
  children,
  variant = "salvia",
  size = "md",
  href,
  onClick,
  className,
  target,
  rel,
  type = "button",
  ...aria
}: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        target={target}
        rel={rel}
        className={cls}
        aria-label={aria["aria-label"]}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={cls}
      aria-label={aria["aria-label"]}
    >
      {children}
    </button>
  );
}
