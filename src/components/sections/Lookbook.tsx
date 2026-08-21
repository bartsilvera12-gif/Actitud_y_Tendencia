import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { products } from "@/data/products";
import SplitText from "@/components/reactbits/SplitText";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import FloralAccent from "@/components/ui/FloralAccent";

export default function Lookbook() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yA = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yB = useTransform(scrollYProgress, [0, 1], [-40, 80]);

  const [imgA, imgB] = [
    products.find((p) => p.id === "blusa-tricot-sinmanga-giverny-offwhite"),
    products.find((p) => p.id === "regata-canelada-lilas"),
  ];

  return (
    <section ref={ref} className="relative overflow-hidden bg-lila/10 py-20 md:py-28">
      <FloralAccent flor="lavanda" className="right-8 top-16 hidden w-14 md:block" rotate={12} float />
      <FloralAccent flor="tulipanRosa" className="bottom-24 right-1/4 hidden w-14 lg:block" rotate={-8} opacity={90} />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-2 md:px-8">
        {/* Collage con parallax */}
        <div className="relative h-[26rem] sm:h-[34rem]">
          <motion.div
            style={{ y: yA }}
            className="absolute left-0 top-6 w-[58%] overflow-hidden rounded-[1.6rem] shadow-2xl ring-1 ring-crema-200"
          >
            <img
              src={imgA?.fotos[2] ?? imgA?.fotos[0]}
              alt={imgA?.nombre}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
          </motion.div>
          <motion.div
            style={{ y: yB }}
            className="absolute right-0 top-24 w-[52%] overflow-hidden rounded-[1.6rem] shadow-2xl ring-1 ring-crema-200"
          >
            <img
              src={imgB?.fotos[1] ?? imgB?.fotos[0]}
              alt={imgB?.nombre}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
          </motion.div>
          <div
            className="pointer-events-none absolute -bottom-4 left-1/3 h-40 w-40 opacity-80"
            style={{
              backgroundImage: "url(/brand/floral-cluster.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
            aria-hidden
          />
        </div>

        {/* Texto */}
        <div>
          <h2 className="font-display text-4xl leading-[1.05] text-tinta sm:text-5xl md:text-6xl">
            <SplitText text="Tu estilo" by="word" />
            <span className="block italic text-salvia-700">
              <SplitText text="habla por vos." by="word" delay={0.15} />
            </span>
          </h2>
          <ScrollReveal delay={0.15}>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-tinta-500">
              Combiná estampados y básicos a tu manera. Piezas versátiles para el
              día, la oficina o una salida — siempre con esa cuota de frescura que
              te hace sentir vos.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.25}>
            <blockquote className="mt-8 border-l-2 border-salvia-600 pl-5 font-display text-2xl italic text-salvia-700">
              “Elegir con actitud. Vestir la tendencia a tu manera.”
            </blockquote>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
