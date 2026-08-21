import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import AuroraBackground from "@/components/reactbits/AuroraBackground";
import SplitText from "@/components/reactbits/SplitText";
import BlurText from "@/components/reactbits/BlurText";
import ShinyText from "@/components/reactbits/ShinyText";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { products } from "@/data/products";
import { waGeneral } from "@/lib/whatsapp";
import { formatGs } from "@/lib/utils";

export default function Hero() {
  const hero = products[0];

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <AuroraBackground />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "url(/brand/floral-pattern.png)", backgroundSize: "620px" }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Texto */}
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-salvia/40 bg-crema/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-salvia-700 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Nueva colección · Verano
          </motion.span>

          <h1 className="mt-6 font-display text-[3.3rem] leading-[0.98] tracking-tight text-tinta sm:text-7xl lg:text-[5.2rem]">
            <SplitText text="Vestí tu" by="word" />
            <span className="block italic text-salvia-700">
              <SplitText text="actitud." by="word" delay={0.15} />
            </span>
            <span className="block">
              <SplitText text="Marcá" by="word" delay={0.35} />{" "}
              <span className="italic">
                <ShinyText>tendencia.</ShinyText>
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-md text-[15px] leading-relaxed text-tinta-500 lg:mx-0">
            <BlurText
              text="Prendas elegidas para acompañar tu estilo y expresar quién sos. Presentación cuidada y atención que te acompaña hasta la compra."
              delay={0.3}
            />
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Button href="#coleccion" variant="salvia" size="lg">
              Descubrir colección
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              href={waGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="lg"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              Comprar por WhatsApp
            </Button>
          </motion.div>
        </div>

        {/* Imagen destacada */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div
            className="absolute -right-6 -top-8 h-40 w-40 opacity-90"
            style={{
              backgroundImage: "url(/brand/floral-cluster.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              animation: "float 8s ease-in-out infinite",
            }}
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(94,138,111,0.55)] ring-1 ring-crema-200">
            <img
              src={hero.fotos[0]}
              alt={hero.nombre}
              className="aspect-[3/4] w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-tinta/25 to-transparent" />
          </div>

          {/* Tarjeta flotante de producto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-crema-200 bg-crema/90 px-4 py-3 shadow-xl backdrop-blur sm:-left-6"
          >
            <div className="h-9 w-9 rounded-full bg-menta" />
            <div>
              <p className="text-xs font-semibold text-tinta">{hero.nombre}</p>
              <p className="text-[11px] text-salvia-700">{formatGs(hero.precio)}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
