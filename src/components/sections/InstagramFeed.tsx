import { Instagram } from "lucide-react";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import FloralAccent from "@/components/ui/FloralAccent";
import { FacebookIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { FACEBOOK_URL, INSTAGRAM_URL, TIKTOK_URL } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// Un pastel de la paleta de marca por red, igual que los valores del manifiesto.
const redes = [
  { label: "Instagram", url: INSTAGRAM_URL, Icon: Instagram, pill: "bg-rosa hover:bg-rosa/80" },
  { label: "Facebook", url: FACEBOOK_URL, Icon: FacebookIcon, pill: "bg-lila hover:bg-lila/80" },
  { label: "TikTok", url: TIKTOK_URL, Icon: TikTokIcon, pill: "bg-amarillo hover:bg-amarillo/80" },
];

export default function InstagramFeed() {
  return (
    <section id="instagram" className="relative overflow-hidden bg-menta/20 py-20 md:py-28">
      <FloralAccent flor="cosmosLila" className="left-4 top-10 hidden w-16 md:block" rotate={-14} float />
      <FloralAccent flor="cosmosRosa" className="right-6 top-14 hidden w-16 md:block" rotate={12} float delay={0.5} />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-display text-4xl text-tinta sm:text-5xl md:text-6xl">
            Seguinos en{" "}
            <span className="italic text-salvia-700">nuestras redes</span>
          </h2>
          <ScrollReveal delay={0.12}>
            <ul className="mt-7 flex items-start justify-center gap-7 sm:gap-9">
              {redes.map((red) => (
                <li key={red.label}>
                  <a
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2.5 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full text-salvia-900 shadow-sm transition-shadow duration-300 group-hover:shadow-md",
                        red.pill
                      )}
                    >
                      <red.Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[13px] font-medium tracking-wide text-tinta transition-colors duration-300 group-hover:text-salvia-700">
                      {red.label}
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
