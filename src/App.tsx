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
import PanelTienda from "@/components/layout/PanelTienda";
import { ErrorCarga } from "@/components/ui/Skeleton";
import { CatalogoProvider, useCatalogo } from "@/lib/catalogo";
import { DatosProvider, useDatos } from "@/lib/datos";
import { TiendaProvider } from "@/lib/tienda";
import { waGeneral } from "@/lib/whatsapp";

export default function App() {
  return (
    // DatosProvider va arriba: TiendaProvider resuelve el carrito contra el
    // catálogo, y las secciones leen sus textos de la base.
    <DatosProvider>
      <CatalogoProvider>
        <TiendaProvider>
          <Contenido />
        </TiendaProvider>
      </CatalogoProvider>
    </DatosProvider>
  );
}

// Cada clave de sección con su componente. El orden y la visibilidad los
// decide `secciones_home`, no este archivo.
// Orden por defecto: si la base no responde, el sitio igual se arma en vez
// de quedar sin secciones.
const ORDEN_POR_DEFECTO = [
  "hero", "categorias", "productos", "nuevos_ingresos",
  "manifesto", "lookbook", "redes", "whatsapp_cta",
] as const;

const SECCIONES: Record<string, () => JSX.Element | null> = {
  hero: Hero,
  categorias: Categorias,
  productos: Products,
  nuevos_ingresos: NuevosIngresos,
  manifesto: Manifesto,
  lookbook: Lookbook,
  redes: InstagramFeed,
  whatsapp_cta: WhatsAppCTA,
};

function Contenido() {
  const { abierto, menuAbierto } = useCatalogo();
  const { secciones, config, error } = useDatos();

  const claves =
    secciones.length > 0
      ? secciones
          .filter((s) => SECCIONES[s.clave])
          .sort((a, b) => a.orden - b.orden)
          .map((s) => s.clave)
      : ORDEN_POR_DEFECTO;

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
          {error && (
            <div className="px-5 pt-28 md:px-8">
              <ErrorCarga mensaje={error} />
            </div>
          )}
          {claves.map((clave) => {
            const Seccion = SECCIONES[clave];
            return <Seccion key={clave} />;
          })}
        </main>
      )}
      <Footer />

      <PanelTienda />

      {/* Botón flotante de WhatsApp. Con el menú abierto no se renderiza: ahí
          se superponía al "Escribinos por WhatsApp" del propio menú. Se
          desmonta en vez de atenuarse para que no dependa de una transición. */}
      {!menuAbierto && (
        <a
          href={waGeneral(config?.whatsappNumero, config?.whatsappMensajeGeneral)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribinos por WhatsApp"
          className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-salvia-600 text-crema shadow-[0_12px_30px_-6px_rgba(94,138,111,0.7)] transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-salvia-600 opacity-30" />
          <WhatsAppIcon className="relative h-7 w-7" />
        </a>
      )}
    </div>
  );
}
