import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Divide por "word" (default) o "char". */
  by?: "word" | "char";
  y?: number;
};

/** Anima cada palabra/letra entrando con un rise + fade, en secuencia. */
export default function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.055,
  by = "word",
  y = 32,
}: Props) {
  const parts = by === "word" ? text.split(" ") : Array.from(text);

  return (
    <span className={cn("inline-block", className)} aria-label={text}>
      {parts.map((part, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-baseline"
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={{ y, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {part}
            {by === "word" && i < parts.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
