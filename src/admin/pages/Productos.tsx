import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Copy,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import Confirmar from "@/admin/components/Confirmar";
import { useToast } from "@/admin/components/Toasts";
import {
  alternarActivoProducto,
  duplicarProducto,
  eliminarProducto,
  listarCategoriasAdmin,
  listarLineasAdmin,
  listarProductos,
  mensajeError,
  type ProductoAdmin,
} from "@/services/admin";
import type { FilaCategoria, FilaLinea } from "@/types/database";
import { cn, formatGs } from "@/lib/utils";

type Estado = "todos" | "activos" | "inactivos";

export default function Productos() {
  const toast = useToast();
  const navegar = useNavigate();

  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  const [categorias, setCategorias] = useState<FilaCategoria[]>([]);
  const [lineas, setLineas] = useState<FilaLinea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [catFiltro, setCatFiltro] = useState("");
  const [lineaFiltro, setLineaFiltro] = useState("");
  const [estado, setEstado] = useState<Estado>("todos");
  const [soloNuevos, setSoloNuevos] = useState(false);
  const [soloDestacados, setSoloDestacados] = useState(false);

  const [aEliminar, setAEliminar] = useState<ProductoAdmin | null>(null);
  const [procesando, setProcesando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const [p, c, l] = await Promise.all([
        listarProductos(),
        listarCategoriasAdmin(),
        listarLineasAdmin(),
      ]);
      setProductos(p);
      setCategorias(c);
      setLineas(l);
      setError(null);
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargar();
  }, []);

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return productos.filter(
      (p) =>
        (!q || p.nombre.toLowerCase().includes(q) || p.slug.includes(q)) &&
        (!catFiltro || p.categoria_id === catFiltro) &&
        (!lineaFiltro || p.linea_id === lineaFiltro) &&
        (estado === "todos" ||
          (estado === "activos" ? p.activo : !p.activo)) &&
        (!soloNuevos || p.nuevo) &&
        (!soloDestacados || p.destacado)
    );
  }, [productos, busqueda, catFiltro, lineaFiltro, estado, soloNuevos, soloDestacados]);

  async function accion(fn: () => Promise<unknown>, ok: string) {
    setProcesando(true);
    try {
      await fn();
      toast.ok(ok);
      await cargar();
    } catch (e) {
      toast.error(mensajeError(e));
    } finally {
      setProcesando(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl bg-amarillo/35 px-5 py-4 text-sm text-tinta">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-tinta-500" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o slug…"
            aria-label="Buscar productos"
            className="min-h-11 w-full rounded-full border border-salvia/35 bg-crema/70 pl-11 pr-4 text-sm text-tinta outline-none transition-colors focus:border-salvia-600"
          />
        </div>
        <Link
          to="/admin/productos/nuevo"
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-salvia-600 px-5 text-sm font-medium text-crema transition-colors hover:bg-salvia-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={catFiltro} onChange={setCatFiltro} etiqueta="Categoría">
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </Select>
        <Select value={lineaFiltro} onChange={setLineaFiltro} etiqueta="Línea">
          {lineas.map((l) => (
            <option key={l.id} value={l.id}>{l.nombre}</option>
          ))}
        </Select>

        <div className="flex gap-1 rounded-full bg-salvia/15 p-1">
          {(["todos", "activos", "inactivos"] as Estado[]).map((e) => (
            <button
              key={e}
              onClick={() => setEstado(e)}
              className={cn(
                "min-h-9 rounded-full px-3.5 text-[13px] capitalize transition-colors",
                estado === e ? "bg-salvia-600 font-medium text-crema" : "text-tinta"
              )}
            >
              {e}
            </button>
          ))}
        </div>

        <Chip activo={soloNuevos} onClick={() => setSoloNuevos((v) => !v)} color="bg-rosa">
          Nuevos
        </Chip>
        <Chip activo={soloDestacados} onClick={() => setSoloDestacados((v) => !v)} color="bg-amarillo">
          Destacados
        </Chip>

        <span className="ml-auto text-xs text-tinta-500">
          {visibles.length} de {productos.length}
        </span>
      </div>

      {/* Listado */}
      <div className="overflow-hidden rounded-[1.4rem] border border-white/70 bg-crema/70">
        {cargando ? (
          <p className="px-5 py-10 text-center text-sm text-tinta-500">Cargando…</p>
        ) : visibles.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-tinta-500">
            {error
              ? "No se pudo cargar el listado."
              : productos.length === 0
                ? "Todavía no hay productos. Creá el primero con “Nuevo producto”."
                : "Ningún producto coincide con los filtros."}
          </p>
        ) : (
          <ul className="divide-y divide-salvia/20">
            {visibles.map((p) => {
              const portada =
                p.producto_imagenes?.find((i) => i.principal)?.url ??
                p.producto_imagenes?.[0]?.url;
              return (
                <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                  {portada ? (
                    <img
                      src={portada}
                      alt=""
                      loading="lazy"
                      className="h-16 w-12 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-16 w-12 shrink-0 rounded-xl bg-salvia/20" />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-tinta">{p.nombre}</p>
                    <p className="truncate text-xs text-tinta-500">
                      {p.categoria?.nombre ?? "Sin categoría"}
                      {p.linea?.nombre ? ` · ${p.linea.nombre}` : ""}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-salvia-700">
                      {formatGs(Number(p.precio))}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {p.nuevo && <Etiqueta color="bg-rosa/60">Nuevo</Etiqueta>}
                    {p.destacado && <Etiqueta color="bg-amarillo/60">Destacado</Etiqueta>}
                    <Etiqueta color={p.activo ? "bg-menta" : "bg-tinta/10"}>
                      {p.activo ? "Activo" : "Inactivo"}
                    </Etiqueta>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Accion
                      onClick={() => navegar(`/admin/productos/${p.slug}`)}
                      etiqueta={`Editar ${p.nombre}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Accion>
                    <Accion
                      onClick={() =>
                        void accion(
                          async () => {
                            const s = await duplicarProducto(p.slug);
                            navegar(`/admin/productos/${s}`);
                          },
                          "Producto duplicado. Queda inactivo hasta que lo publiques."
                        )
                      }
                      etiqueta={`Duplicar ${p.nombre}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Accion>
                    <Accion
                      onClick={() =>
                        void accion(
                          () => alternarActivoProducto(p.id, !p.activo),
                          p.activo ? "Producto desactivado" : "Producto activado"
                        )
                      }
                      etiqueta={p.activo ? `Desactivar ${p.nombre}` : `Activar ${p.nombre}`}
                    >
                      {p.activo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Accion>
                    <Accion
                      onClick={() => setAEliminar(p)}
                      etiqueta={`Eliminar ${p.nombre}`}
                      peligro
                    >
                      <Trash2 className="h-4 w-4" />
                    </Accion>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Confirmar
        abierto={aEliminar !== null}
        tono="peligro"
        titulo={`¿Eliminar “${aEliminar?.nombre}”?`}
        mensaje="Se borran también sus talles y fotos. Esto no se puede deshacer. Si solo querés sacarlo de la web, desactivalo en vez de eliminarlo."
        confirmar="Eliminar definitivamente"
        procesando={procesando}
        onCancelar={() => setAEliminar(null)}
        onConfirmar={() =>
          void (async () => {
            if (!aEliminar) return;
            await accion(() => eliminarProducto(aEliminar.id), "Producto eliminado");
            setAEliminar(null);
          })()
        }
      />
    </div>
  );
}

function Select({
  value,
  onChange,
  etiqueta,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={etiqueta}
      className="min-h-9 rounded-full border border-salvia/35 bg-crema/70 px-3.5 text-[13px] text-tinta outline-none focus:border-salvia-600"
    >
      <option value="">{etiqueta}: todas</option>
      {children}
    </select>
  );
}

function Chip({
  activo,
  onClick,
  color,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  color: string;
  children: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activo}
      className={cn(
        "min-h-9 rounded-full px-3.5 text-[13px] transition-colors",
        activo ? cn(color, "font-medium text-tinta") : "border border-salvia/35 text-tinta"
      )}
    >
      {children}
    </button>
  );
}

function Etiqueta({ color, children }: { color: string; children: string }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium text-tinta", color)}>
      {children}
    </span>
  );
}

function Accion({
  onClick,
  etiqueta,
  peligro,
  children,
}: {
  onClick: () => void;
  etiqueta: string;
  peligro?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      title={etiqueta}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-tinta transition-colors",
        peligro ? "hover:bg-rosa/35" : "hover:bg-salvia/20"
      )}
    >
      {children}
    </button>
  );
}
