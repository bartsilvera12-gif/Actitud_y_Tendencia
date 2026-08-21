import { Instagram, MapPin } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import {
  INSTAGRAM_URL,
  INSTAGRAM_USER,
  WHATSAPP_NUMBER,
  waGeneral,
} from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-salvia-900 text-crema/85">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "url(/brand/floral-pattern.png)",
          backgroundSize: "560px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img
              src="/brand/logo-cream.png"
              alt="Actitud & Tendencia"
              className="h-11 w-auto"
            />
            <p className="mt-5 max-w-xs font-display text-2xl leading-snug text-crema">
              Elegí con actitud. Vestí la tendencia a tu manera.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-salvia">
              Navegación
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li><a href="#coleccion" className="transition-colors hover:text-white">Colección</a></li>
              <li><a href="#nuevos" className="transition-colors hover:text-white">Nuevos ingresos</a></li>
              <li><a href="#manifiesto" className="transition-colors hover:text-white">Nosotras</a></li>
              <li><a href="#instagram" className="transition-colors hover:text-white">Instagram</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-salvia">
              Contacto
            </h4>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={waGeneral()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <WhatsAppIcon className="h-5 w-5 text-salvia" />
                  +595 983 460 912
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Instagram className="h-5 w-5 text-salvia" />
                  @{INSTAGRAM_USER}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-salvia" />
                San Lorenzo · Paraguay
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-crema/15 pt-7 text-xs text-crema/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Actitud & Tendencia · Boutique de moda femenina.</p>
          <p aria-hidden>Hecho con 🌷 en Paraguay</p>
          <p className="sr-only">WhatsApp {WHATSAPP_NUMBER}</p>
        </div>
      </div>
    </footer>
  );
}
