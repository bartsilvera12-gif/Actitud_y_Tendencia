import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
};

/** Texto que aparece con desenfoque -> nítido, palabra por palabra. */
export default function BlurText({
  text,
  className,
  delay = 0,
  stagger = 0.09,
}: Props) {
  const words = text.split(" ");
  return (
    <span className={cn("inline", className)} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, filter: "blur(10px)", y: 12 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.7,
            delay: delay + i * stagger,
            ease: "easeOut",
          }}
          aria-hidden
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}
