import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import FloralAccent from "@/components/ui/FloralAccent";
import { useDatos } from "@/lib/datos";

/**
 * Política de privacidad.
 *
 * No está enlazada desde ninguna parte del sitio: se llega solo escribiendo
 * /politicadeprivacidad, como se pidió.
 *
 * El contenido describe lo que la web hace de verdad —carrito en el navegador,
 * pedidos por WhatsApp, sin pasarela de pago ni cuentas de cliente— en vez de
 * copiar una plantilla con cláusulas que no aplican.
 */
export default function PoliticaPrivacidad() {
  const { config } = useDatos();

  const marca = config?.nombreMarca ?? "Actitud & Tendencia";
  const whatsapp = config?.whatsappDisplay ?? "+595 985 960 203";
  const ubicacion = config?.ubicacion ?? "San Lorenzo · Paraguay";

  useEffect(() => {
    const anterior = document.title;
    document.title = `Política de privacidad | ${marca}`;
    // No conviene que esta página aparezca en buscadores.
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.title = anterior;
      meta.remove();
    };
  }, [marca]);

  return (
    <div className="relative min-h-svh overflow-hidden bg-gradient-to-br from-menta/40 via-crema to-lila/25">
      <FloralAccent flor="cosmosLila" className="left-4 top-10 hidden w-16 md:block" rotate={-14} float />
      <FloralAccent flor="cosmosRosa" className="right-6 top-16 hidden w-16 md:block" rotate={12} float delay={0.5} />
      <FloralAccent flor="lavanda" className="bottom-16 left-10 hidden w-14 lg:block" opacity={85} />

      <div className="relative mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <Link
          to="/"
          className="group -my-2 flex min-h-10 w-fit items-center gap-2 py-2 text-sm text-tinta-500 transition-colors hover:text-salvia-700"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver a la tienda
        </Link>

        <img
          src={config?.logoUrl ?? "/brand/logo-gold.png"}
          alt={marca}
          className="mt-8 h-10 w-auto"
        />

        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.25em] text-salvia-700">
          Legales
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-tinta sm:text-5xl">
          Política de <span className="italic text-salvia-700">privacidad</span>
        </h1>
        <p className="mt-4 text-sm text-tinta-500">
          Última actualización: agosto de 2026
        </p>

        <div className="mt-10 flex flex-col gap-8">
          <Seccion titulo="Quiénes somos">
            <p>
              {marca} es una boutique de moda femenina con base en {ubicacion}.
              Esta política explica qué datos maneja nuestro sitio web y qué
              hacemos con ellos.
            </p>
          </Seccion>

          <Seccion titulo="Qué datos guardamos">
            <p>
              <strong className="text-tinta">No pedimos que crees una cuenta</strong> ni
              recolectamos tu nombre, correo o teléfono para navegar la tienda.
              No usamos formularios de registro.
            </p>
            <p>
              Tu <strong className="text-tinta">carrito y tus favoritos</strong> se
              guardan únicamente en el almacenamiento local de tu navegador
              (<em>localStorage</em>). Esa información no viaja a nuestros
              servidores: queda en tu dispositivo y podés borrarla vaciando los
              datos del sitio desde tu navegador.
            </p>
          </Seccion>

          <Seccion titulo="Cuándo compartís datos con nosotros">
            <p>
              El pedido se cierra por WhatsApp. Al tocar “Enviar pedido”, se abre
              una conversación con el número {whatsapp} y el mensaje viene
              precargado con las prendas, los talles, las cantidades y el total.
            </p>
            <p>
              A partir de ese momento, la conversación se rige por la{" "}
              <a
                href="https://www.whatsapp.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-salvia/50 underline-offset-4 transition-colors hover:text-salvia-700"
              >
                política de privacidad de WhatsApp
              </a>
              . Los datos que nos compartas ahí —tu número, tu nombre, una
              dirección de entrega— los usamos solo para coordinar esa compra.
            </p>
          </Seccion>

          <Seccion titulo="Pagos">
            <p>
              Este sitio <strong className="text-tinta">no procesa pagos</strong> y no
              tiene pasarela de cobro conectada. Nunca vas a ingresar datos de
              tarjeta ni credenciales bancarias acá, y nosotros no los pedimos ni
              los almacenamos. La forma de pago se acuerda por WhatsApp.
            </p>
          </Seccion>

          <Seccion titulo="Cookies y seguimiento">
            <p>
              No usamos cookies publicitarias ni herramientas de seguimiento de
              terceros. Lo único que el sitio escribe en tu navegador es el
              carrito y los favoritos que ya mencionamos.
            </p>
          </Seccion>

          <Seccion titulo="Servicios que usamos">
            <p>
              El sitio está alojado en Vercel y el catálogo se guarda en
              Supabase. Estos proveedores pueden registrar datos técnicos de la
              conexión —como la dirección IP— con fines de funcionamiento y
              seguridad, tal como hace cualquier servidor web.
            </p>
          </Seccion>

          <Seccion titulo="Tus derechos">
            <p>
              Podés pedirnos que borremos la información que nos hayas compartido
              por WhatsApp, o consultarnos qué guardamos de vos. Escribinos al{" "}
              <strong className="text-tinta">{whatsapp}</strong> y lo resolvemos.
            </p>
            <p>
              El carrito y los favoritos los borrás vos mismo desde tu navegador,
              sin pedirnos nada.
            </p>
          </Seccion>

          <Seccion titulo="Menores de edad">
            <p>
              La tienda está pensada para mayores de edad. No recolectamos datos
              de forma consciente de menores.
            </p>
          </Seccion>

          <Seccion titulo="Cambios">
            <p>
              Si cambiamos esta política vamos a actualizar la fecha del
              encabezado. Los cambios rigen desde su publicación.
            </p>
          </Seccion>

          <Seccion titulo="Contacto">
            <p>
              Por cualquier consulta sobre privacidad, escribinos por WhatsApp al{" "}
              <strong className="text-tinta">{whatsapp}</strong>.
            </p>
          </Seccion>
        </div>

        <div className="mt-14 border-t border-salvia/30 pt-7">
          <p className="text-xs text-tinta/70">
            © {new Date().getFullYear()} {marca}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl text-tinta">{titulo}</h2>
      <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-tinta-500">
        {children}
      </div>
    </section>
  );
}
