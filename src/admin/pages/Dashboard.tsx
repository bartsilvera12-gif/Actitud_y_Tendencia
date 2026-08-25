import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Image,
  Layers,
  Plus,
  Shirt,
  Sparkles,
  Star,
  Tags,
  TriangleAlert,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn, formatGs } from "@/lib/utils";

type Metricas = {
  productos: number;
  activos: number;
  nuevos: number;
  destacados: number;
  categorias: number;
  lineas: number;
};

type Reciente = {
  slug: string;
  nombre: string;
  precio: number;
  activo: boolean;
  created_at: string;
};

/**
 * Cuenta filas sin traerlas.
 *
 * No se usa `head: true`: eso emite un HEAD, y una respuesta HEAD no trae
 * cuerpo, así que el JSON del error de PostgREST (por ejemplo PGRST106) se
 * pierde y llega `error: null` con `count: null`. Se pide una sola columna
 * con `limit(0)`: el conteo viene igual y el error se puede leer.
 */
async function contar(
  tabla: string,
  igual?: Record<string, unknown>
): Promise<number> {
  let q = supabase.from(tabla).select("id", { count: "exact" }).limit(0);
  for (const [columna, valor] of Object.entries(igual ?? {})) {
    q = q.eq(columna, valor);
  }
  const { count, error } = await q;
  if (error) throw error;
  if (count === null) throw new Error("No se pudo contar " + tabla);
  return count;
}

export default function Dashboard() {
  const [m, setM] = useState<Metricas | null>(null);
  const [recientes, setRecientes] = useState<Reciente[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Sin guard de "montado": en React 18 setState tras desmontar no avisa
    // nada, y el guard hacía que el error del segundo montaje de StrictMode
    // se descartara en silencio, dejando el panel cargando para siempre.
    (async () => {
      try {
        const [productos, activos, nuevos, destacados, categorias, lineas] =
          await Promise.all([
            contar("productos"),
            contar("productos", { activo: true }),
            contar("productos", { nuevo: true }),
            contar("productos", { destacado: true }),
            contar("categorias"),
            contar("lineas"),
          ]);

        const { data, error: err } = await supabase
          .from("productos")
          .select("slug, nombre, precio, activo, created_at")
          .order("created_at", { ascending: false })
          .limit(5);
        if (err) throw err;

        setM({ productos, activos, nuevos, destacados, categorias, lineas });
        setRecientes((data ?? []) as Reciente[]);
      } catch (e) {
        const msg =
          typeof e === "object" && e !== null && "message" in e
            ? String((e as { message: unknown }).message)
            : String(e);
        setError(
          /PGRST106|schema/i.test(msg)
            ? "El schema no está expuesto en PostgREST. Ver docs/SETUP_ADMIN.md"
            : msg
        );
      }
    })();
  }, []);

  const cards = [
    { label: "Productos", valor: m?.productos, Icon: Shirt, tono: "bg-menta" },
    { label: "Activos", valor: m?.activos, Icon: Sparkles, tono: "bg-salvia/50" },
    { label: "Nuevos ingresos", valor: m?.nuevos, Icon: Star, tono: "bg-rosa/55" },
    { label: "Destacados", valor: m?.destacados, Icon: Star, tono: "bg-amarillo/60" },
    { label: "Categorías", valor: m?.categorias, Icon: Tags, tono: "bg-lila/55" },
    { label: "Líneas", valor: m?.lineas, Icon: Layers, tono: "bg-dorado/35" },
  ];

  return (
    <div className="flex flex-col gap-7">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl bg-amarillo/35 px-5 py-4 text-sm text-tinta"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Métricas del catálogo. No hay métricas de ventas porque el pedido
          termina en WhatsApp y no queda registrado. */}
      <section>
        <h2 className="sr-only">Resumen</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {cards.map(({ label, valor, Icon, tono }) => (
            <div
              key={label}
              className="rounded-[1.4rem] border border-white/70 bg-crema/70 p-4"
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl text-salvia-900",
                  tono
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-3 font-display text-3xl text-tinta">
                {valor ?? (error ? "—" : "·")}
              </p>
              <p className="mt-0.5 text-xs text-tinta-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accesos rápidos */}
      <section>
        <h2 className="font-display text-xl text-tinta">Accesos rápidos</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Acceso to="/admin/productos/nuevo" Icon={Plus}>
            Nuevo producto
          </Acceso>
          <Acceso to="/admin/categorias" Icon={Tags}>
            Nueva categoría
          </Acceso>
          <Acceso to="/admin/hero" Icon={Image}>
            Editar Hero
          </Acceso>
        </div>
      </section>

      {/* Últimos productos */}
      <section>
        <h2 className="font-display text-xl text-tinta">
          Últimos productos agregados
        </h2>
        <div className="mt-3 overflow-hidden rounded-[1.4rem] border border-white/70 bg-crema/70">
          {recientes.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-tinta-500">
              {error ? "Sin datos disponibles." : "Todavía no hay productos."}
            </p>
          ) : (
            <ul className="divide-y divide-salvia/20">
              {recientes.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/admin/productos/${p.slug}`}
                    className="flex min-h-14 items-center gap-3 px-5 py-3 transition-colors hover:bg-salvia/10"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-tinta">
                        {p.nombre}
                      </span>
                      <span className="text-xs text-tinta-500">
                        {formatGs(Number(p.precio))}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium",
                        p.activo
                          ? "bg-menta text-salvia-900"
                          : "bg-tinta/10 text-tinta-500"
                      )}
                    >
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Acceso({
  to,
  Icon,
  children,
}: {
  to: string;
  Icon: typeof Plus;
  children: string;
}) {
  return (
    <Link
      to={to}
      className="flex min-h-11 items-center gap-2 rounded-full border border-salvia/40 bg-crema/60 px-5 text-sm font-medium text-tinta transition-all duration-300 hover:-translate-y-0.5 hover:border-salvia-600 hover:bg-salvia/15"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
