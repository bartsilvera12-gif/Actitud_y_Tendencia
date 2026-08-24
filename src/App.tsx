import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Categorias from "@/components/sections/Categorias";
import Catalogo from "@/components/sections/Catalogo";
import Products from "@/components/sections/Products";
import NuevosIngresos from "@/components/sections/NuevosIngresos";
import Manifesto from "@/components/sections/Manifesto";
import Lookbook from "@/components/sections/Lookbook";
import InstagramFeed from "@/components/sections/InstagramFeed";
import WhatsAppCTA from "@/components/sections/WhatsAppCTA";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { CatalogoProvider, useCatalogo } from "@/lib/catalogo";
import { cn } from "@/lib/utils";
import { waGeneral } from "@/lib/whatsapp";

export default function App() {
  return (
    <CatalogoProvider>
      <Contenido />
    </CatalogoProvider>
  );
}

function Contenido() {
  const { abierto, menuAbierto } = useCatalogo();

  return (
    <div className="relative min-h-screen">
      {/* Fondo de página: base pastel + la foto floral en `multiply`. Como la
          foto es casi blanca, el multiply deja pasar el pastel y solo dibuja
          las flores. Va fija, así no se repite en una página de 8000px. */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-menta/50 via-crema-200/60 to-lila/30" />
        <img
          src="/brand/fondo-floral.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-multiply"
        />
      </div>

      <Navbar />
      {abierto ? (
        <main>
          <Catalogo />
        </main>
      ) : (
        <main>
          <Hero />
          <Categorias />
          <Products />
          <NuevosIngresos />
          <Manifesto />
          <Lookbook />
          <InstagramFeed />
          <WhatsAppCTA />
        </main>
      )}
      <Footer />

      {/* Botón flotante de WhatsApp. Se esconde con el menú abierto: ahí se
          superponía al "Escribinos por WhatsApp" del propio menú. */}
      <a
        href={waGeneral()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        aria-hidden={menuAbierto}
        tabIndex={menuAbierto ? -1 : 0}
        className={cn(
          "fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-salvia-600 text-crema shadow-[0_12px_30px_-6px_rgba(94,138,111,0.7)] transition-all duration-300 hover:scale-105 active:scale-95",
          menuAbierto
            ? "pointer-events-none scale-50 opacity-0"
            : "scale-100 opacity-100"
        )}
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-salvia-600 opacity-30" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </a>
    </div>
  );
}
