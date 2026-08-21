import Marquee from "@/components/reactbits/Marquee";
import { flores } from "@/lib/flowers";

const items = [
  { t: "Nuevos ingresos cada semana", f: flores.cosmosRosa },
  { t: "Atención personalizada por WhatsApp", f: flores.cosmosLila },
  { t: "Envíos a todo el país", f: flores.cosmosAmarillo },
  { t: "Prendas seleccionadas", f: flores.tulipanRosa },
  { t: "Cambios sin vueltas", f: flores.lavanda },
  { t: "Estilo que te acompaña", f: flores.tulipanLila },
];

export default function TrustMarquee() {
  return (
    <section className="border-y border-salvia/20 bg-menta/40 py-4">
      <Marquee
        speed={36}
        items={items.map(({ t, f }) => (
          <span className="mx-7 flex items-center gap-7 text-sm font-medium uppercase tracking-[0.16em] text-salvia-700">
            {t}
            <img src={f} alt="" aria-hidden className="h-6 w-6 object-contain" />
          </span>
        ))}
      />
    </section>
  );
}
