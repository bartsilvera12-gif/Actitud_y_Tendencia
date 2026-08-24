import type React from "react";
import { Instagram } from "lucide-react";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import FloralAccent from "@/components/ui/FloralAccent";
import { FacebookIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { useDatos } from "@/lib/datos";
import { cn } from "@/lib/utils";

// Icono y pastel por tipo de red. Las clases van completas por el purge.
/** Acepta tanto los iconos de lucide (forwardRef) como los SVG propios. */
type IconoSvg = React.ComponentType<{ className?: string }>;

const POR_TIPO: Record<string, { Icon: IconoSvg; pill: string }> = {
  instagram: { Icon: Instagram, pill: "bg-rosa hover:bg-rosa/80" },
  facebook: { Icon: FacebookIcon, pill: "bg-lila hover:bg-lila/80" },
  tiktok: { Icon: TikTokIcon, pill: "bg-amarillo hover:bg-amarillo/80" },
};

export default function InstagramFeed() {
  const { redes, seccion } = useDatos();
  const s = seccion("redes");
  const visibles = redes.filter((r) => POR_TIPO[r.tipo]);
  if (!s || visibles.length === 0) return null;

  return (
    <section id="instagram" className="relative overflow-hidden bg-menta/20 py-20 md:py-28">
      <FloralAccent flor="cosmosLila" className="left-4 top-10 hidden w-16 md:block" rotate={-14} float />
      <FloralAccent flor="cosmosRosa" className="right-6 top-14 hidden w-16 md:block" rotate={12} float delay={0.5} />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-display text-4xl text-tinta sm:text-5xl md:text-6xl">
            {s.titulo ?? "Seguinos en"}{" "}
            {s.tituloDestacado && (
              <span className="italic text-salvia-700">{s.tituloDestacado}</span>
            )}
          </h2>
          <ScrollReveal delay={0.12}>
            <ul className="mt-7 flex items-start justify-center gap-7 sm:gap-9">
              {visibles.map((red) => (
                <li key={red.id}>
                  <a
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2.5 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full text-salvia-900 shadow-sm transition-shadow duration-300 group-hover:shadow-md",
                        POR_TIPO[red.tipo].pill
                      )}
                    >
                      {(() => { const I = POR_TIPO[red.tipo].Icon; return <I className="h-5 w-5" />; })()}
                    </span>
                    <span className="text-[13px] font-medium tracking-wide text-tinta transition-colors duration-300 group-hover:text-salvia-700">
                      {red.nombre ?? red.tipo}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
