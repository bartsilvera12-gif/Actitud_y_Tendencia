import { Instagram } from "lucide-react";
import { products } from "@/data/products";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import Button from "@/components/ui/Button";
import FloralAccent from "@/components/ui/FloralAccent";
import { INSTAGRAM_URL, INSTAGRAM_USER } from "@/lib/whatsapp";

// Arma una grilla tipo feed tomando fotos variadas de cada producto.
const feed = products.flatMap((p) => p.fotos.slice(0, 2)).slice(0, 8);

export default function InstagramFeed() {
  return (
    <section id="instagram" className="relative overflow-hidden bg-menta/20 py-20 md:py-28">
      <FloralAccent flor="cosmosLila" className="left-4 top-10 hidden w-16 md:block" rotate={-14} float />
      <FloralAccent flor="cosmosRosa" className="right-6 top-14 hidden w-16 md:block" rotate={12} float delay={0.5} />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-salvia/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-salvia-700">
              <Instagram className="h-4 w-4" />
              Comunidad
            </span>
          </ScrollReveal>
          <h2 className="mt-4 font-display text-4xl text-tinta sm:text-5xl md:text-6xl">
            Seguinos en{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="italic text-salvia-700 underline decoration-salvia/40 underline-offset-4 transition-colors hover:text-salvia-900"
            >
              @{INSTAGRAM_USER}
            </a>
          </h2>
          <ScrollReveal delay={0.12}>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-tinta-500">
              Nuevos ingresos, looks y detrás de escena. Etiquetanos y sé parte de
              la comunidad Actitud & Tendencia.
            </p>
          </ScrollReveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {feed.map((src, i) => (
            <ScrollReveal key={i} delay={(i % 4) * 0.06}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-2xl ring-1 ring-crema-200"
              >
                <img
                  src={src}
                  alt="Look Actitud & Tendencia"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-salvia-900/0 opacity-0 transition-all duration-300 group-hover:bg-salvia-900/40 group-hover:opacity-100">
                  <Instagram className="h-7 w-7 text-crema" />
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="gold"
            size="lg"
          >
            <Instagram className="h-4 w-4" />
            Seguir en Instagram
          </Button>
        </div>
      </div>
    </section>
  );
}
