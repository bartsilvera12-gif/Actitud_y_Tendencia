import { motion } from "framer-motion";
import Reveal from "@/components/reactbits/Reveal";
import ShinyText from "@/components/reactbits/ShinyText";

export default function Hero() {
  return (
    // Padding simétrico: con `items-center`, un pt distinto al pb corre el bloque
    // del centro real. Los 112px de arriba ya despejan el navbar fijo.
    <section
      id="top"
      // `svh` y no `vh`: en el móvil la barra del navegador cambia de alto y con
      // `vh` la portada se pasaría de pantalla justo al inicio.
      className="relative flex min-h-svh items-center overflow-hidden py-20 md:py-24"
    >
      {/* Fondo: la foto trae su propio floral y su espacio limpio a la izquierda,
          así que acá no van ni la aurora ni los acentos sueltos. */}
      <img
        src="/brand/hero-fondo.png"
        alt=""
        aria-hidden
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Velo crema para que el texto se lea sin importar cómo recorte la foto. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-crema/90 via-crema/55 to-transparent lg:via-crema/25"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        {/* El bloque se centra dentro de la mitad izquierda —la zona crema
            limpia de la foto— en vez de pegarse al borde del contenedor. */}
        <div className="lg:w-[76%]">
          <div className="mx-auto max-w-xl text-center lg:text-left">
          <h1 className="font-display text-[3.1rem] leading-[0.98] tracking-tight text-tinta sm:text-6xl lg:text-[4.6rem]">
            <Reveal delay={0.1}>Vestí tu</Reveal>
            <Reveal delay={0.25} className="italic text-salvia-700">
              actitud.
            </Reveal>
            <Reveal delay={0.4}>
              Marcá{" "}
              <span className="italic">
                <ShinyText>tendencia.</ShinyText>
              </span>
            </Reveal>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-7 max-w-md text-[15px] leading-relaxed text-tinta-500 lg:mx-0"
          >
            Prendas elegidas para acompañar tu estilo y expresar quién sos.
            Presentación cuidada y atención que te acompaña hasta la compra.
          </motion.p>

          </div>
        </div>
      </div>
    </section>
  );
}
