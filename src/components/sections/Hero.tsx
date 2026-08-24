import { motion } from "framer-motion";
import Reveal from "@/components/reactbits/Reveal";
import ShinyText from "@/components/reactbits/ShinyText";
import FloralAccent from "@/components/ui/FloralAccent";
import { useDatos } from "@/lib/datos";

// Pastel por clave: Tailwind purga lo que no encuentre escrito.
const PILL: Record<string, string> = {
  rosa: "bg-rosa/55",
  menta: "bg-menta",
  amarillo: "bg-amarillo/55",
  lila: "bg-lila/55",
  salvia: "bg-salvia/55",
  dorado: "bg-dorado/40",
};

export default function Hero() {
  const { hero, seccion } = useDatos();
  const s = seccion("hero");
  if (!s || !hero) return null;

  return (
    // Padding simétrico: con `items-center`, un pt distinto al pb corre el bloque
    // del centro real. `svh` y no `vh` por la barra del navegador en móvil.
    <section
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden py-20 md:py-24"
    >
      {/* Fondo con un Ken Burns muy lento: da movimiento continuo sin distraer. */}
      <motion.img
        src={hero.imagenUrl ?? "/brand/hero-fondo.png"}
        alt=""
        aria-hidden
        loading="eager"
        initial={{ scale: 1.06 }}
        animate={{ scale: [1.06, 1.14, 1.06] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-crema/90 via-crema/55 to-transparent lg:via-crema/25"
        aria-hidden
      />

      {/* Flores flotando del lado del texto, para que no compitan con la prenda. */}
      <FloralAccent flor="lavanda" className="bottom-24 left-4 hidden w-14 md:block lg:w-16" rotate={6} float />
      <FloralAccent flor="cosmosLila" className="left-8 top-28 hidden w-12 lg:block" rotate={-14} float delay={0.8} opacity={85} />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        {/* El bloque se centra dentro de la zona crema limpia de la foto. */}
        <div className="lg:w-[76%]">
          <div className="mx-auto max-w-xl text-center lg:text-left">
            <h1 className="font-display text-[3.1rem] leading-[0.98] tracking-tight text-tinta sm:text-6xl lg:text-[4.6rem]">
              <Reveal delay={0.1}>{hero.tituloLinea1}</Reveal>
              <Reveal delay={0.25} className="italic text-salvia-700">
                {hero.tituloDestacado1}
              </Reveal>
              <Reveal delay={0.4}>
                {hero.tituloLinea2}{" "}
                <span className="relative inline-block italic">
                  <ShinyText>{hero.tituloDestacado2 ?? ""}</ShinyText>
                  {/* Subrayado que se dibuja solo, al terminar el reveal. */}
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-dorado via-rosa to-lila"
                  />
                </span>
              </Reveal>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-7 max-w-md text-[15px] leading-relaxed text-tinta-500 lg:mx-0"
            >
              {hero.descripcion}
            </motion.p>

            {/* En pantallas bajas (netbooks de 600px) los chips harían que la
                portada pase de una pantalla, así que ahí no se muestran. */}
            <ul className="mt-7 flex flex-wrap justify-center gap-2 [@media(max-height:720px)]:hidden lg:justify-start">
              {hero.chips.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.15 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-medium text-salvia-900 ${PILL[c.color] ?? PILL.menta}`}
                >
                  {c.texto}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Indicador de scroll: la portada ocupa justo una pantalla, así que
          conviene señalar que la página sigue abajo. */}
      <motion.a
        href="#categorias"
        aria-label="Bajar a las categorías"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.7 }}
        className="absolute inset-x-0 bottom-7 mx-auto flex w-fit flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-salvia-700 [@media(max-height:640px)]:hidden"
      >
        Descubrí más
        <span className="relative h-9 w-px overflow-hidden bg-salvia/40">
          <motion.span
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 h-4 bg-salvia-700"
          />
        </span>
      </motion.a>
    </section>
  );
}
