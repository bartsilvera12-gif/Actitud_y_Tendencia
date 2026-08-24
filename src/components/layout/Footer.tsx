import { Instagram, MapPin } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { FacebookIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import {
  FACEBOOK_NAME,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  INSTAGRAM_USER,
  TIKTOK_URL,
  TIKTOK_USER,
  WHATSAPP_DISPLAY,
  waGeneral,
} from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// Un pastel de la paleta por link, para que la navegación no sea una lista gris.
const navegacion = [
  { label: "Colección", href: "#coleccion", pill: "bg-salvia/45 hover:bg-salvia/70", dot: "bg-salvia-700" },
  { label: "Nuevos ingresos", href: "#nuevos", pill: "bg-rosa/45 hover:bg-rosa/70", dot: "bg-rosa" },
  { label: "Nosotras", href: "#manifiesto", pill: "bg-lila/45 hover:bg-lila/70", dot: "bg-lila" },
  { label: "Instagram", href: "#instagram", pill: "bg-amarillo/45 hover:bg-amarillo/70", dot: "bg-dorado" },
];

const contacto = [
  { Icon: WhatsAppIcon, texto: WHATSAPP_DISPLAY, href: waGeneral(), chip: "bg-salvia/55" },
  { Icon: Instagram, texto: `@${INSTAGRAM_USER}`, href: INSTAGRAM_URL, chip: "bg-rosa/55" },
  { Icon: FacebookIcon, texto: FACEBOOK_NAME, href: FACEBOOK_URL, chip: "bg-lila/55" },
  { Icon: TikTokIcon, texto: `@${TIKTOK_USER}`, href: TIKTOK_URL, chip: "bg-amarillo/55" },
];

const valores = [
  { label: "Fresca", pill: "bg-menta" },
  { label: "Elegante", pill: "bg-rosa/70" },
  { label: "Cercana", pill: "bg-amarillo/70" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-menta/75 via-crema-200/60 to-lila/45 text-tinta">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: "url(/brand/floral-pattern.png)",
          backgroundSize: "560px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
          {/* Marca */}
          <div>
            <img
              src="/brand/logo-gold.png"
              alt="Actitud & Tendencia"
              className="h-11 w-auto"
            />
            <p className="mt-5 max-w-xs font-display text-2xl leading-snug text-tinta">
              Elegí con <span className="italic text-salvia-700">actitud</span>.
              Vestí la <span className="italic text-dorado-700">tendencia</span> a
              tu manera.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {valores.map((v) => (
                <span
                  key={v.label}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium text-salvia-900",
                    v.pill
                  )}
                >
                  {v.label}
                </span>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div>
            <Titulo color="bg-salvia-600">Navegación</Titulo>
            <ul className="mt-5 flex flex-col gap-2">
              {navegacion.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={cn(
                      "flex min-h-10 items-center gap-2.5 rounded-full px-4 py-2 text-sm text-tinta transition-all duration-300 hover:translate-x-1",
                      l.pill
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", l.dot)} />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <Titulo color="bg-rosa">Contacto</Titulo>
            <ul className="mt-5 flex flex-col gap-2">
              {contacto.map((c) => (
                <li key={c.texto}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-10 items-center gap-3 rounded-2xl px-2 py-1.5 text-sm text-tinta transition-colors duration-300 hover:bg-white/45"
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-salvia-900",
                        c.chip
                      )}
                    >
                      <c.Icon className="h-4 w-4" />
                    </span>
                    {c.texto}
                  </a>
                </li>
              ))}
              <li className="flex min-h-10 items-center gap-3 px-2 py-1.5 text-sm text-tinta">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-menta text-salvia-900">
                  <MapPin className="h-4 w-4" />
                </span>
                San Lorenzo · Paraguay
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-salvia/30 pt-7 text-xs text-tinta/80 sm:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-salvia-700">
              Actitud &amp; Tendencia
            </span>{" "}
            · Boutique de moda femenina.
          </p>
          <p aria-hidden>Hecho con 🌷 en Paraguay</p>
          <p className="sr-only">WhatsApp {WHATSAPP_DISPLAY}</p>
        </div>
      </div>
    </footer>
  );
}

/** Título de columna con su punto de color. */
function Titulo({ children, color }: { children: string; color: string }) {
  return (
    <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-salvia-900">
      <span className={cn("h-2 w-2 rounded-full", color)} />
      {children}
    </h4>
  );
}
