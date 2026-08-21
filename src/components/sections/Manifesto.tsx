import ScrollReveal from "@/components/reactbits/ScrollReveal";
import SplitText from "@/components/reactbits/SplitText";
import FloralAccent from "@/components/ui/FloralAccent";

const valores = ["Fresca", "Elegante", "Cercana", "Actual", "Detallista"];

export default function Manifesto() {
  return (
    <section
      id="manifiesto"
      className="relative overflow-hidden bg-salvia-900 py-24 text-crema md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url(/brand/floral-pattern.png)", backgroundSize: "520px" }}
        aria-hidden
      />
      {/* Flores de colores que resaltan sobre el verde profundo */}
      <FloralAccent flor="cosmosRosa" className="left-6 top-16 w-16 md:left-16 md:w-24" rotate={-12} float />
      <FloralAccent flor="cosmosAmarillo" className="right-8 top-24 hidden w-20 md:block" rotate={16} float delay={0.6} />
      <FloralAccent flor="lavanda" className="bottom-16 left-10 hidden w-14 md:block" opacity={90} />
      <FloralAccent flor="tulipanRosa" className="bottom-20 right-16 w-14 md:w-20" rotate={-8} />
      <FloralAccent flor="helecho" className="left-1/2 top-8 hidden w-24 md:block" opacity={60} />

      <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
        <ScrollReveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-menta">
            Nuestra esencia
          </p>
        </ScrollReveal>
        <h2 className="mt-5 font-display text-4xl leading-[1.05] text-crema sm:text-5xl md:text-6xl">
          <SplitText text="No seguimos tendencias." by="word" />
          <span className="mt-1 block italic text-menta">
            <SplitText text="Las hacemos parte de tu historia." by="word" delay={0.2} />
          </span>
        </h2>
        <ScrollReveal delay={0.15}>
          <p className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-crema/75">
            Elegí con actitud y vestí la tendencia a tu manera. Cada pieza está
            pensada para que el producto se vea mejor, se entienda rápido y te
            acompañe con una atención cercana.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="mt-9 flex flex-wrap justify-center gap-2.5">
            {valores.map((v) => (
              <span
                key={v}
                className="rounded-full border border-crema/25 px-4 py-1.5 text-sm text-crema/90"
              >
                {v}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
