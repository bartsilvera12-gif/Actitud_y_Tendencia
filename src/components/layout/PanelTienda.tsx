import { AnimatePresence, motion } from "framer-motion";
import { Heart, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useDatos } from "@/lib/datos";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useTienda } from "@/lib/tienda";
import { waPedido } from "@/lib/whatsapp";
import { cn, formatGs, precioVigente } from "@/lib/utils";

/** Panel lateral único: muestra el carrito o los favoritos según el estado. */
export default function PanelTienda() {
  const {
    panel,
    cerrarPanel,
    lineas,
    total,
    cambiarCantidad,
    quitar,
    vaciar,
    favoritos,
    alternarFavorito,
    agregar,
    abrirPanel,
  } = useTienda();

  const { productos, config } = useDatos();
  const esCarrito = panel === "carrito";
  const favoritados = productos.filter((p) => favoritos.includes(p.id));

  return (
    <AnimatePresence>
      {panel && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-tinta/40 backdrop-blur-sm"
            onClick={cerrarPanel}
          />

          <motion.aside
            role="dialog"
            aria-label={esCarrito ? "Carrito" : "Favoritos"}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-crema shadow-2xl sm:w-[26rem]"
          >
            <header className="flex items-center justify-between border-b border-salvia/25 px-6 py-5">
              <h2 className="flex items-center gap-2.5 font-display text-2xl text-tinta">
                {esCarrito ? (
                  <ShoppingBag className="h-5 w-5 text-salvia-700" />
                ) : (
                  <Heart className="h-5 w-5 text-rosa" />
                )}
                {esCarrito ? "Tu carrito" : "Favoritos"}
              </h2>
              <button
                onClick={cerrarPanel}
                aria-label="Cerrar"
                className="rounded-full p-2.5 text-tinta transition-colors hover:bg-salvia/15"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
              {esCarrito ? (
                lineas.length === 0 ? (
                  <Vacio
                    icono={<ShoppingBag className="h-8 w-8 text-salvia-700" />}
                    titulo="Tu carrito está vacío"
                    texto="Agregá prendas desde el catálogo y las vas a ver acá."
                  />
                ) : (
                  <ul className="flex flex-col gap-4">
                    {lineas.map((l) => (
                      <li
                        key={l.id + l.talle}
                        className="flex gap-3 rounded-2xl bg-white/70 p-3 ring-1 ring-salvia/20"
                      >
                        <img
                          src={l.producto.fotos[0]}
                          alt={l.producto.nombre}
                          className="h-24 w-16 shrink-0 rounded-xl object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="truncate text-sm font-medium text-tinta">
                            {l.producto.nombre}
                          </p>
                          <p className="mt-0.5 text-xs text-tinta-500">
                            Talle {l.talle}
                          </p>
                          <p className="mt-1 text-sm font-medium text-salvia-700">
                            {formatGs(l.subtotal)}
                          </p>

                          <div className="mt-auto flex items-center gap-2 pt-2">
                            <Cantidad
                              valor={l.cantidad}
                              onCambio={(v) => cambiarCantidad(l.id, l.talle, v)}
                            />
                            <button
                              onClick={() => quitar(l.id, l.talle)}
                              aria-label={`Quitar ${l.producto.nombre}`}
                              className="ml-auto rounded-full p-2 text-tinta-500 transition-colors hover:bg-rosa/25 hover:text-tinta"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              ) : favoritados.length === 0 ? (
                <Vacio
                  icono={<Heart className="h-8 w-8 text-rosa" />}
                  titulo="Todavía no guardaste favoritos"
                  texto="Tocá el corazón de una prenda para guardarla acá."
                />
              ) : (
                <ul className="flex flex-col gap-4">
                  {favoritados.map((p) => (
                    <li
                      key={p.id}
                      className="flex gap-3 rounded-2xl bg-white/70 p-3 ring-1 ring-salvia/20"
                    >
                      <img
                        src={p.fotos[0]}
                        alt={p.nombre}
                        className="h-24 w-16 shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="truncate text-sm font-medium text-tinta">
                          {p.nombre}
                        </p>
                        <p className="mt-0.5 text-xs text-tinta-500">
                          {p.categoria}
                        </p>
                        <p className="mt-1 text-sm font-medium text-salvia-700">
                          {formatGs(precioVigente(p))}
                        </p>

                        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                          {/* Sin talle elegido se agrega el primero disponible. */}
                          <button
                            onClick={() => {
                              agregar(p.id, p.talles[0]);
                              abrirPanel("carrito");
                            }}
                            className="rounded-full bg-salvia-600 px-3.5 py-1.5 text-xs font-medium text-crema transition-colors hover:bg-salvia-700"
                          >
                            Agregar talle {p.talles[0]}
                          </button>
                          <button
                            onClick={() => alternarFavorito(p.id)}
                            aria-label={`Quitar ${p.nombre} de favoritos`}
                            className="ml-auto rounded-full p-2 text-rosa transition-colors hover:bg-rosa/20"
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {esCarrito && lineas.length > 0 && (
              <footer className="border-t border-salvia/25 bg-white/60 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-tinta-500">Total</span>
                  <span className="font-display text-2xl text-tinta">
                    {formatGs(total)}
                  </span>
                </div>

                <a
                  href={waPedido(
                    config?.whatsappNumero ?? null,
                    lineas.map((l) => ({
                      nombre: l.producto.nombre,
                      talle: l.talle,
                      cantidad: l.cantidad,
                      subtotal: l.subtotal,
                    })),
                    total
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-salvia-600 px-6 text-sm font-medium text-crema shadow-sm transition-colors hover:bg-salvia-700"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Enviar pedido por WhatsApp
                </a>

                <button
                  onClick={vaciar}
                  className="mt-3 w-full text-center text-xs text-tinta-500 underline underline-offset-4 transition-colors hover:text-tinta"
                >
                  Vaciar carrito
                </button>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Cantidad({
  valor,
  onCambio,
}: {
  valor: number;
  onCambio: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-salvia/15 p-1">
      <button
        onClick={() => onCambio(valor - 1)}
        aria-label="Quitar una unidad"
        className="rounded-full p-1.5 text-tinta transition-colors hover:bg-white"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-6 text-center text-sm font-medium text-tinta">
        {valor}
      </span>
      <button
        onClick={() => onCambio(valor + 1)}
        aria-label="Agregar una unidad"
        className="rounded-full p-1.5 text-tinta transition-colors hover:bg-white"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Vacio({
  icono,
  titulo,
  texto,
}: {
  icono: React.ReactNode;
  titulo: string;
  texto: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-4 py-16 text-center")}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-menta/60">
        {icono}
      </span>
      <p className="mt-5 font-display text-xl text-tinta">{titulo}</p>
      <p className="mt-2 text-sm text-tinta-500">{texto}</p>
    </div>
  );
}
