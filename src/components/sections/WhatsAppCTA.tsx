import ScrollReveal from "@/components/reactbits/ScrollReveal";
import SplitText from "@/components/reactbits/SplitText";
import Button from "@/components/ui/Button";
import FloralAccent from "@/components/ui/FloralAccent";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useDatos } from "@/lib/datos";
import { waGeneral } from "@/lib/whatsapp";

export default function WhatsAppCTA() {
  const { config, seccion } = useDatos();
  const s = seccion("whatsapp_cta");
  if (!s) return null;

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-salvia-600 px-6 py-16 text-center shadow-2xl ring-1 ring-inset ring-white/15 md:px-16 md:py-24">
          {/* marco dorado interior sutil */}
          <div
            className="pointer-events-none absolute inset-4 rounded-[1.9rem] border border-dorado/30 md:inset-6"
            aria-hidden
          />
          <FloralAccent flor="cosmosRosa" className="left-3 top-3 w-16 md:left-8 md:w-24" rotate={-16} />
          <FloralAccent flor="cosmosAmarillo" className="bottom-3 right-4 w-16 md:right-10 md:w-24" rotate={16} />
          <FloralAccent flor="cosmosLila" className="bottom-3 left-4 w-16 md:left-10 md:w-24" rotate={-16} />
          <FloralAccent flor="tulipanLila" className="right-8 top-6 hidden w-12 md:block" rotate={10} />

          <div className="relative">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-menta">
              {s.eyebrow ?? ""}
            </p>
            <h2 className="mx-auto max-w-3xl font-display text-[2.6rem] font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
              <SplitText text={s.titulo ?? ""} by="word" />
              <span className="mt-1 block italic text-[#f3e3b8]">
                <SplitText text={s.tituloDestacado ?? ""} by="word" delay={0.15} />
              </span>
            </h2>

            {/* ornamento dorado (guiño al ❤ del logo) */}
            <div className="mt-7 flex items-center justify-center gap-3" aria-hidden>
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-dorado/80 sm:w-20" />
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-dorado" fill="currentColor">
                <path d="M12 21s-6.7-4.35-9.33-8.02C.9 10.36 1.4 7.1 3.9 5.9c1.9-.9 4.02-.16 5.1 1.35L12 10.2l3-2.95c1.08-1.51 3.2-2.25 5.1-1.35 2.5 1.2 3 4.46 1.23 7.08C18.7 16.65 12 21 12 21Z" />
              </svg>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-dorado/80 sm:w-20" />
            </div>

            <ScrollReveal delay={0.12}>
              <p className="mx-auto mt-6 max-w-md text-center text-[15px] leading-relaxed text-white/90">
                {s.descripcion}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="mt-9 flex justify-center">
                <Button
                  href={waGeneral(config?.whatsappNumero, config?.whatsappMensajeGeneral)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="cream"
                  size="lg"
                >
                  <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                  Escribinos ahora
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
