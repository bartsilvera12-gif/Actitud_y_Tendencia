import { cn } from "@/lib/utils";

type Props = {
  children: string;
  className?: string;
};

/** Texto dorado con brillo que recorre (foil premium). */
export default function ShinyText({ children, className }: Props) {
  return <span className={cn("text-shiny-gold", className)}>{children}</span>;
}
