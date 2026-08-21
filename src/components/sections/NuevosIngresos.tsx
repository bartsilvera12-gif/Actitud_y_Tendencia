import { ArrowUpRight } from "lucide-react";
import { products } from "@/data/products";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import TiltedCard from "@/components/reactbits/TiltedCard";
import Button from "@/components/ui/Button";
import FloralAccent from "@/components/ui/FloralAccent";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { waProduct } from "@/lib/whatsapp";
import { cn, formatGs } from "@/lib/utils";

export default function NuevosIngresos() {
  const destacados = products.filter((p) => p.destacado).slice(0, 2);

  return (
    <section id="nuevos" className="relative overflow-hidden bg-menta/25 py-20 md:py-28">
      <FloralAccent flor="peoniaRosa" className="-left-4 top-24 hidden w-20 md:block" rotate={-10} float />
      <FloralAccent flor="cosmosAmarillo" className="right-6 top-16 hidden w-16 lg:block" rotate={14} opacity={85} />
      <FloralAccent flor="ramaHorizontal" className="bottom-10 right-0 hidden w-44 lg:block" opacity={40} flip />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center text-center">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-salvia-700">
              Nuevos ingresos
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="mt-3 font-display text-4xl text-tinta sm:text-5xl md:text-6xl">
              Lo último de la línea{" "}
              <span className="italic text-salvia-700">Giverny</span>
            </h2>
          </ScrollReveal>
        </div>

        <div className="mt-14 space-y-16 md:space-y-24">
          {destacados.map((p, i) => (
            <div
              key={p.id}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <ScrollReveal
                className={cn(i % 2 === 1 && "md:order-2")}
                y={40}
              >
                <TiltedCard max={7}>
                  <div className="overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-45px_rgba(94,138,111,0.6)] ring-1 ring-crema-200">
                    <img
                      src={p.fotos[0]}
                      alt={p.nombre}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </div>
                </TiltedCard>
              </ScrollReveal>

              <ScrollReveal delay={0.12} className={cn(i % 2 === 1 && "md:order-1")}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-salvia-700">
                  {p.categoria} · {p.color}
                </p>
                <h3 className="mt-3 font-display text-3xl text-tinta sm:text-4xl md:text-5xl">
                  {p.nombre}
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-tinta-500">
                  {p.descripcion}
                </p>
                <p className="mt-5 text-2xl font-light text-salvia-700">
                  {formatGs(p.precio)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.talles.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-salvia/40 px-3 py-1 text-xs font-medium text-tinta"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button
                    href={waProduct(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="whatsapp"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Consultar disponibilidad
                  </Button>
                  <Button href="#coleccion" variant="ghost">
                    Ver la colección
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
