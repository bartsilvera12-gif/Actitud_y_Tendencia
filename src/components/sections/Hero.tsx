import SplitText from "@/components/reactbits/SplitText";
import BlurText from "@/components/reactbits/BlurText";
import ShinyText from "@/components/reactbits/ShinyText";

export default function Hero() {
  return (
    // Padding simétrico: con `items-center`, un pt distinto al pb corre el bloque
    // del centro real. Los 112px de arriba ya despejan el navbar fijo.
    <section
      id="top"
      className="relative flex min-h-[660px] items-center overflow-hidden py-28 md:min-h-[780px] md:py-32"
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

          </div>
        </div>
      </div>
    </section>
  );
}
