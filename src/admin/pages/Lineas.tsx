import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Pencil, Plus, Trash2, TriangleAlert, X } from "lucide-react";
import Confirmar from "@/admin/components/Confirmar";
import { useToast } from "@/admin/components/Toasts";
import {
  eliminarLinea,
  generarSlug,
  guardarLinea,
  listarLineasAdmin,
  mensajeError,
  slugLibre,
} from "@/services/admin";
import type { FilaLinea } from "@/types/database";
import { cn } from "@/lib/utils";

type Borrador = {
  id: string | null;
  nombre: string;
  slug: string;
  descripcion: string;
  orden: number;
  activo: boolean;
};

const VACIA: Borrador = {
  id: null,
  nombre: "",
  slug: "",
  descripcion: "",
  orden: 0,
  activo: true,
};

export default function Lineas() {
  const toast = useToast();
  const [items, setItems] = useState<FilaLinea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<Borrador | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [aEliminar, setAEliminar] = useState<FilaLinea | null>(null);

  async function cargar() {
    setCargando(true);
    try {
      setItems(await listarLineasAdmin());
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

  async function guardar() {
    if (!editando) return;
    if (!editando.nombre.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    setGuardando(true);
    try {
      const slug = await slugLibre(
        "lineas",
        editando.slug || editando.nombre,
        editando.id ?? undefined
      );
      await guardarLinea(editando.id, {
        nombre: editando.nombre.trim(),
        slug,
        descripcion: editando.descripcion.trim() || null,
        orden: editando.orden,
        activo: editando.activo,
      });
      toast.ok(editando.id ? "Línea actualizada" : "Línea creada");
      setEditando(null);
      await cargar();
    } catch (e) {
      toast.error(mensajeError(e));
    } finally {
      setGuardando(false);
    }
  }

  async function mover(l: FilaLinea, delta: number) {
    const i = items.findIndex((x) => x.id === l.id);
    const j = i + delta;
    if (j < 0 || j >= items.length) return;
    try {
      await Promise.all([
        guardarLinea(items[i].id, { orden: items[j].orden }),
        guardarLinea(items[j].id, { orden: items[i].orden }),
      ]);
      await cargar();
    } catch (e) {
      toast.error(mensajeError(e));
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

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-tinta-500">
          Las colecciones de la marca: Giverny, Básicos, Denim…
        </p>
        <button
          onClick={() => setEditando({ ...VACIA, orden: items.length })}
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-salvia-600 px-5 text-sm font-medium text-crema transition-colors hover:bg-salvia-700"
        >
          <Plus className="h-4 w-4" />
          Nueva línea
        </button>
      </div>

      <div className="overflow-hidden rounded-[1.4rem] border border-white/70 bg-crema/70">
        {cargando ? (
          <p className="px-5 py-10 text-center text-sm text-tinta-500">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-tinta-500">{error ? "No se pudo cargar el listado." : "Todavía no hay líneas."}</p>
        ) : (
          <ul className="divide-y divide-salvia/20">
            {items.map((l, i) => (
              <li key={l.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-tinta">{l.nombre}</p>
                  <p className="truncate text-xs text-tinta-500">/{l.slug}</p>
                </div>
                {!l.activo && (
                  <span className="rounded-full bg-tinta/10 px-2.5 py-1 text-[11px] text-tinta-500">Oculta</span>
                )}
                <div className="flex shrink-0 items-center gap-1">
                  <Mini onClick={() => void mover(l, -1)} etiqueta="Subir" deshabilitado={i === 0}>
                    <ChevronUp className="h-4 w-4" />
                  </Mini>
                  <Mini onClick={() => void mover(l, 1)} etiqueta="Bajar" deshabilitado={i === items.length - 1}>
                    <ChevronDown className="h-4 w-4" />
                  </Mini>
                  <Mini
                    onClick={() =>
                      setEditando({
                        id: l.id,
                        nombre: l.nombre,
                        slug: l.slug,
                        descripcion: l.descripcion ?? "",
                        orden: l.orden,
                        activo: l.activo,
                      })
                    }
                    etiqueta={`Editar ${l.nombre}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Mini>
                  <Mini onClick={() => setAEliminar(l)} etiqueta={`Eliminar ${l.nombre}`} peligro>
                    <Trash2 className="h-4 w-4" />
                  </Mini>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editando && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-tinta/45 backdrop-blur-sm" onClick={() => setEditando(null)} />
          <div className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] bg-crema p-6 shadow-2xl sm:rounded-[1.75rem]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-tinta">
                {editando.id ? "Editar línea" : "Nueva línea"}
              </h2>
              <button onClick={() => setEditando(null)} aria-label="Cerrar" className="rounded-full p-2.5 text-tinta hover:bg-salvia/15">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-tinta">
                  Nombre <span className="text-rosa">*</span>
                </span>
                <input
                  value={editando.nombre}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      nombre: e.target.value,
                      slug: editando.id ? editando.slug : generarSlug(e.target.value),
                    })
                  }
                  className={cn(INPUT, "mt-2")}
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-tinta">Slug</span>
                <input
                  value={editando.slug}
                  onChange={(e) => setEditando({ ...editando, slug: generarSlug(e.target.value) })}
                  className={cn(INPUT, "mt-2")}
                />
              </label>
              {/* El campo "Descripción" se saca del formulario: la web no lo muestra en
                  ningún lado. La columna sigue en la base y lo que ya estuviera cargado
                  se conserva al guardar. */}
              <label className="flex min-h-12 items-center justify-between gap-3">
                <span className="text-sm text-tinta">Visible en la web</span>
                <input
                  type="checkbox"
                  checked={editando.activo}
                  onChange={(e) => setEditando({ ...editando, activo: e.target.checked })}
                  className="h-5 w-5 accent-salvia-600"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button onClick={() => setEditando(null)} className="min-h-11 rounded-full border border-salvia/40 px-5 text-sm text-tinta hover:bg-salvia/15">
                Cancelar
              </button>
              <button
                onClick={() => void guardar()}
                disabled={guardando}
                className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-salvia-600 px-5 text-sm font-medium text-crema hover:bg-salvia-700 disabled:opacity-60"
              >
                {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <Confirmar
        abierto={aEliminar !== null}
        tono="peligro"
        titulo={`¿Eliminar “${aEliminar?.nombre}”?`}
        mensaje="Si hay productos en esta línea, la base va a rechazar el borrado. En ese caso ocultala en vez de eliminarla."
        confirmar="Eliminar"
        onCancelar={() => setAEliminar(null)}
        onConfirmar={() =>
          void (async () => {
            if (!aEliminar) return;
            try {
              await eliminarLinea(aEliminar.id);
              toast.ok("Línea eliminada");
              await cargar();
            } catch (e) {
              toast.error(mensajeError(e));
            } finally {
              setAEliminar(null);
            }
          })()
        }
      />
    </div>
  );
}

const INPUT =
  "min-h-11 w-full rounded-2xl border border-salvia/35 bg-white px-4 text-[15px] text-tinta outline-none transition-colors focus:border-salvia-600 focus:ring-2 focus:ring-salvia/25";

function Mini({
  onClick,
  etiqueta,
  peligro,
  deshabilitado,
  children,
}: {
  onClick: () => void;
  etiqueta: string;
  peligro?: boolean;
  deshabilitado?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deshabilitado}
      aria-label={etiqueta}
      title={etiqueta}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-tinta transition-colors",
        deshabilitado ? "opacity-30" : peligro ? "hover:bg-rosa/35" : "hover:bg-salvia/20"
      )}
    >
      {children}
    </button>
  );
}
