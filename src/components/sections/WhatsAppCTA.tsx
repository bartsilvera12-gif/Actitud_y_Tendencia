import ScrollReveal from "@/components/reactbits/ScrollReveal";
import SplitText from "@/components/reactbits/SplitText";
import Button from "@/components/ui/Button";
import FloralAccent from "@/components/ui/FloralAccent";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { WHATSAPP_DISPLAY, waGeneral } from "@/lib/whatsapp";

export default function WhatsAppCTA() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-salvia-600 via-salvia to-menta px-6 py-16 text-center shadow-2xl md:px-16 md:py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{ backgroundImage: "url(/brand/floral-pattern.png)", backgroundSize: "440px" }}
            aria-hidden
          />
          <FloralAccent flor="cosmosRosa" className="left-3 top-3 w-16 md:left-8 md:w-24" rotate={-16} />
          <FloralAccent flor="cosmosAmarillo" className="bottom-3 right-4 w-16 md:right-10 md:w-24" rotate={16} />
          <FloralAccent flor="tulipanLila" className="right-8 top-6 hidden w-12 md:block" rotate={10} />
          <div className="relative">
            <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
              <SplitText text="¿Viste algo que" by="word" />
              <span className="block italic">
                <SplitText text="te guste?" by="word" delay={0.15} />
              </span>
            </h2>
            <ScrollReveal delay={0.12}>
              <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-white/90">
                Escribinos por WhatsApp y te ayudamos a elegir tu talle, ver
                disponibilidad y coordinar el envío. Atención cercana y sin vueltas.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  href={waGeneral()}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="lg"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Escribinos ahora
                </Button>
                <span className="text-sm font-medium text-white/90">
                  {WHATSAPP_DISPLAY}
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
