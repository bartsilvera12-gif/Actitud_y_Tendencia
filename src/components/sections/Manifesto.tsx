import ScrollReveal from "@/components/reactbits/ScrollReveal";
import SplitText from "@/components/reactbits/SplitText";
import CountUp from "@/components/reactbits/CountUp";
import { products, categorias } from "@/data/products";

const valores = ["Fresca", "Elegante", "Cercana", "Actual", "Detallista"];

const stats = [
  { to: products.length, label: "Prendas nuevas" },
  { to: categorias.length, label: "Categorías" },
  { to: 100, suffix: "%", label: "Seleccionado a mano" },
];

export default function Manifesto() {
  return (
    <section
      id="manifiesto"
      className="relative overflow-hidden bg-salvia-900 py-24 text-crema md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "url(/brand/floral-pattern.png)", backgroundSize: "520px" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-10 h-72 w-72 opacity-30"
        style={{
          backgroundImage: "url(/brand/floral-cluster.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          animation: "float 10s ease-in-out infinite",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
        <ScrollReveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-salvia">
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

        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-crema/15 pt-10">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl text-menta md:text-5xl">
                <CountUp to={s.to} suffix={s.suffix ?? ""} />
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-crema/60">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
