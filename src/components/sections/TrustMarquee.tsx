import Marquee from "@/components/reactbits/Marquee";

const items = [
  "Nuevos ingresos cada semana",
  "Atención personalizada por WhatsApp",
  "Envíos a todo el país",
  "Prendas seleccionadas",
  "Cambios sin vueltas",
  "Estilo que te acompaña",
];

export default function TrustMarquee() {
  return (
    <section className="border-y border-salvia/20 bg-menta/40 py-4">
      <Marquee
        speed={34}
        items={items.map((t) => (
          <span className="mx-8 flex items-center gap-8 text-sm font-medium uppercase tracking-[0.16em] text-salvia-700">
            {t}
            <span className="text-dorado">✦</span>
          </span>
        ))}
      />
    </section>
  );
}
