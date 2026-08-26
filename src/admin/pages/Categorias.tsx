import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Pencil, Plus, Trash2, TriangleAlert, X } from "lucide-react";
import Confirmar from "@/admin/components/Confirmar";
import { useToast } from "@/admin/components/Toasts";
import {
  eliminarCategoria,
  generarSlug,
  guardarCategoria,
  listarCategoriasAdmin,
  mensajeError,
  slugLibre,
} from "@/services/admin";
import { TEMAS_DISPONIBLES, temaPorClave } from "@/lib/categories";
import { flores, type FlorKey } from "@/lib/flowers";
import type { FilaCategoria, TemaColor } from "@/types/database";
import { borrarImagen, subirImagen, validarImagen } from "@/services/storage";
import { cn } from "@/lib/utils";

const FLORES = Object.keys(flores) as FlorKey[];

type Borrador = {
  id: string | null;
  nombre: string;
  slug: string;
  descripcion: string;
  tema_color: TemaColor;
  flor_key: string;
  imagen_url: string | null;
  imagen_storage_path: string | null;
  orden: number;
  activo: boolean;
};

const VACIA: Borrador = {
  id: null,
  nombre: "",
  slug: "",
  descripcion: "",
  tema_color: "salvia",
  flor_key: "tulipanLila",
  imagen_url: null,
  imagen_storage_path: null,
  orden: 0,
  activo: true,
};

export default function Categorias() {
  const toast = useToast();
  const [items, setItems] = useState<FilaCategoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<Borrador | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [aEliminar, setAEliminar] = useState<FilaCategoria | null>(null);
  const inputFile = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);

  /**
   * La foto se sube apenas se elige, no al guardar: así se ve la miniatura
   * antes de confirmar. Si después se cancela el formulario queda un archivo
   * suelto en el bucket, que es preferible a perder la subida.
   */
  async function subirFoto(files: FileList | null) {
    const file = files?.[0];
    if (!file || !editando) return;
    const invalido = validarImagen(file);
    if (invalido) {
      toast.error(invalido);
      return;
    }
    setSubiendo(true);
    try {
      const anterior = editando.imagen_storage_path;
      const { url, path } = await subirImagen(file, "categorias");
      setEditando({ ...editando, imagen_url: url, imagen_storage_path: path });
      if (anterior) await borrarImagen(anterior);
      toast.ok("Imagen subida");
    } catch (e) {
      toast.error(mensajeError(e));
    } finally {
      setSubiendo(false);
      if (inputFile.current) inputFile.current.value = "";
    }
  }

  async function quitarFoto() {
    if (!editando) return;
    const path = editando.imagen_storage_path;
    setEditando({ ...editando, imagen_url: null, imagen_storage_path: null });
    if (path) await borrarImagen(path).catch(() => {});
  }

  async function cargar() {
    setCargando(true);
    try {
      setItems(await listarCategoriasAdmin());
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
        "categorias",
        editando.slug || editando.nombre,
        editando.id ?? undefined
      );
      await guardarCategoria(editando.id, {
        nombre: editando.nombre.trim(),
        slug,
        descripcion: editando.descripcion.trim() || null,
        tema_color: editando.tema_color,
        flor_key: editando.flor_key,
        imagen_url: editando.imagen_url,
        imagen_storage_path: editando.imagen_storage_path,
        orden: editando.orden,
        activo: editando.activo,
      });
      toast.ok(editando.id ? "Categoría actualizada" : "Categoría creada");
      setEditando(null);
      await cargar();
    } catch (e) {
      toast.error(mensajeError(e));
    } finally {
      setGuardando(false);
    }
  }

  async function mover(cat: FilaCategoria, delta: number) {
    const i = items.findIndex((x) => x.id === cat.id);
    const j = i + delta;
    if (j < 0 || j >= items.length) return;
    try {
      await Promise.all([
        guardarCategoria(items[i].id, { orden: items[j].orden }),
        guardarCategoria(items[j].id, { orden: items[i].orden }),
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
          El color y la flor definen cómo se ve la categoría en la web.
        </p>
        <button
          onClick={() => setEditando({ ...VACIA, orden: items.length })}
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-salvia-600 px-5 text-sm font-medium text-crema transition-colors hover:bg-salvia-700"
        >
          <Plus className="h-4 w-4" />
          Nueva categoría
        </button>
      </div>

      <div className="overflow-hidden rounded-[1.4rem] border border-white/70 bg-crema/70">
        {cargando ? (
          <p className="px-5 py-10 text-center text-sm text-tinta-500">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-tinta-500">
            {error ? "No se pudo cargar el listado." : "Todavía no hay categorías."}
          </p>
        ) : (
          <ul className="divide-y divide-salvia/20">
            {items.map((c, i) => {
              const t = temaPorClave(c.tema_color, c.flor_key);
              return (
                <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                  <span className={cn("h-9 w-9 shrink-0 rounded-xl", t.tint)} />
                  <img src={flores[c.flor_key as FlorKey] ?? flores.tulipanLila} alt="" className="h-9 w-9 shrink-0 object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-tinta">{c.nombre}</p>
                    <p className="truncate text-xs text-tinta-500">/{c.slug} · {c.tema_color}</p>
                  </div>
                  {!c.activo && (
                    <span className="rounded-full bg-tinta/10 px-2.5 py-1 text-[11px] text-tinta-500">Oculta</span>
                  )}
                  <div className="flex shrink-0 items-center gap-1">
                    <Mini onClick={() => void mover(c, -1)} etiqueta="Subir" deshabilitado={i === 0}>
                      <ChevronUp className="h-4 w-4" />
                    </Mini>
                    <Mini onClick={() => void mover(c, 1)} etiqueta="Bajar" deshabilitado={i === items.length - 1}>
                      <ChevronDown className="h-4 w-4" />
                    </Mini>
                    <Mini
                      onClick={() =>
                        setEditando({
                          id: c.id,
                          nombre: c.nombre,
                          slug: c.slug,
                          descripcion: c.descripcion ?? "",
                          tema_color: c.tema_color,
                          flor_key: c.flor_key,
                          imagen_url: c.imagen_url,
                          imagen_storage_path: c.imagen_storage_path,
                          orden: c.orden,
                          activo: c.activo,
                        })
                      }
                      etiqueta={`Editar ${c.nombre}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Mini>
                    <Mini onClick={() => setAEliminar(c)} etiqueta={`Eliminar ${c.nombre}`} peligro>
                      <Trash2 className="h-4 w-4" />
                    </Mini>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Formulario */}
      {editando && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-tinta/45 backdrop-blur-sm" onClick={() => setEditando(null)} />
          <div className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] bg-crema p-6 shadow-2xl sm:rounded-[1.75rem]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-tinta">
                {editando.id ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button onClick={() => setEditando(null)} aria-label="Cerrar" className="rounded-full p-2.5 text-tinta hover:bg-salvia/15">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <Campo etiqueta="Nombre" requerido>
                <input
                  value={editando.nombre}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      nombre: e.target.value,
                      slug: editando.id ? editando.slug : generarSlug(e.target.value),
                    })
                  }
                  className={INPUT}
                />
              </Campo>
              <Campo etiqueta="Slug">
                <input
                  value={editando.slug}
                  onChange={(e) => setEditando({ ...editando, slug: generarSlug(e.target.value) })}
                  className={INPUT}
                />
              </Campo>
              {/* El campo "Descripción" se saca del formulario: la web no lo muestra en
                  ningún lado. La columna sigue en la base y lo que ya estuviera cargado
                  se conserva al guardar. */}

              <Campo
                etiqueta="Imagen"
                ayuda="Opcional. Si no cargás ninguna, la web usa la foto del primer producto de la categoría."
              >
                <div className="flex items-center gap-3">
                  {editando.imagen_url ? (
                    <img
                      src={editando.imagen_url}
                      alt=""
                      className="h-20 w-16 shrink-0 rounded-xl object-cover ring-1 ring-salvia/30"
                    />
                  ) : null}
                  <input
                    ref={inputFile}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => void subirFoto(e.target.files)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => inputFile.current?.click()}
                    disabled={subiendo}
                    className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-salvia/40 px-4 text-sm text-tinta transition-colors hover:border-salvia-600 hover:bg-salvia/10 disabled:opacity-60"
                  >
                    {subiendo ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Subiendo…
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        {editando.imagen_url ? "Cambiar imagen" : "Subir una imagen"}
                      </>
                    )}
                  </button>
                  {editando.imagen_url ? (
                    <button
                      type="button"
                      onClick={() => void quitarFoto()}
                      aria-label="Quitar imagen"
                      className="rounded-full p-2.5 text-tinta hover:bg-rosa/25"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </Campo>

              <Campo etiqueta="Color" ayuda="Define el tono de los chips y las cards.">
                <div className="flex flex-wrap gap-2">
                  {TEMAS_DISPONIBLES.map((tc) => {
                    const t = temaPorClave(tc, editando.flor_key);
                    return (
                      <button
                        key={tc}
                        type="button"
                        onClick={() => setEditando({ ...editando, tema_color: tc })}
                        aria-pressed={editando.tema_color === tc}
                        className={cn(
                          "min-h-10 rounded-full px-4 text-[13px] capitalize ring-2 transition-all",
                          t.tint,
                          editando.tema_color === tc ? "ring-salvia-700" : "ring-transparent"
                        )}
                      >
                        {tc}
                      </button>
                    );
                  })}
                </div>
              </Campo>

              <Campo etiqueta="Flor decorativa">
                <div className="flex flex-wrap gap-1.5">
                  {FLORES.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setEditando({ ...editando, flor_key: f })}
                      aria-pressed={editando.flor_key === f}
                      title={f}
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl ring-2 transition-all",
                        editando.flor_key === f ? "bg-salvia/20 ring-salvia-700" : "ring-transparent hover:bg-salvia/10"
                      )}
                    >
                      <img src={flores[f]} alt="" className="h-8 w-8 object-contain" />
                    </button>
                  ))}
                </div>
              </Campo>

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
        mensaje="Si hay productos en esta categoría, la base va a rechazar el borrado. En ese caso ocultala en vez de eliminarla."
        confirmar="Eliminar"
        onCancelar={() => setAEliminar(null)}
        onConfirmar={() =>
          void (async () => {
            if (!aEliminar) return;
            try {
              await eliminarCategoria(aEliminar.id);
              toast.ok("Categoría eliminada");
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

function Campo({
  etiqueta,
  ayuda,
  requerido,
  children,
}: {
  etiqueta: string;
  ayuda?: string;
  requerido?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-tinta">
        {etiqueta}
        {requerido && <span className="ml-1 text-rosa">*</span>}
      </span>
      <div className="mt-2">{children}</div>
      {ayuda && <span className="mt-1.5 block text-xs text-tinta-500">{ayuda}</span>}
    </label>
  );
}

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
