import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { useToast } from "@/admin/components/Toasts";
import {
  actualizarProducto,
  agregarImagen,
  crearProducto,
  eliminarImagen,
  generarSlug,
  guardarTalles,
  listarCategoriasAdmin,
  listarLineasAdmin,
  mensajeError,
  obtenerProductoPorSlug,
  reordenarImagenes,
  slugLibre,
  type DatosProducto,
} from "@/services/admin";
import { borrarImagen, subirImagen, validarImagen } from "@/services/storage";
import type { FilaCategoria, FilaImagen, FilaLinea } from "@/types/database";
import { cn } from "@/lib/utils";

type Form = DatosProducto & { talles: string[] };

const VACIO: Form = {
  nombre: "",
  slug: "",
  categoria_id: null,
  linea_id: null,
  color: "",
  precio: 0,
  descripcion: "",
  tipo_talle: "letra",
  nuevo: false,
  destacado: false,
  activo: true,
  mostrar_home: true,
  orden_home: 0,
  orden_catalogo: 0,
  seo_title: "",
  seo_description: "",
  talles: [],
};

export default function ProductoEditar() {
  const { slug } = useParams<{ slug: string }>();
  const esNuevo = !slug || slug === "nuevo";
  const navegar = useNavigate();
  const toast = useToast();
  const inputFile = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Form>(VACIO);
  const [productoId, setProductoId] = useState<string | null>(null);
  const [imagenes, setImagenes] = useState<FilaImagen[]>([]);
  const [categorias, setCategorias] = useState<FilaCategoria[]>([]);
  const [lineas, setLineas] = useState<FilaLinea[]>([]);
  const [cargando, setCargando] = useState(!esNuevo);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [nuevoTalle, setNuevoTalle] = useState("");
  // El slug solo se autogenera mientras el usuario no lo haya tocado.
  const [slugManual, setSlugManual] = useState(!esNuevo);

  useEffect(() => {
    (async () => {
      try {
        const [c, l] = await Promise.all([listarCategoriasAdmin(), listarLineasAdmin()]);
        setCategorias(c);
        setLineas(l);

        if (!esNuevo && slug) {
          const p = await obtenerProductoPorSlug(slug);
          if (!p) {
            setError("No se encontró el producto.");
            return;
          }
          setProductoId(p.id);
          setImagenes([...p.imagenes].sort((a, b) => a.orden - b.orden));
          setForm({
            nombre: p.nombre,
            slug: p.slug,
            categoria_id: p.categoria_id,
            linea_id: p.linea_id,
            color: p.color ?? "",
            precio: Number(p.precio),
            descripcion: p.descripcion ?? "",
            tipo_talle: p.tipo_talle,
            nuevo: p.nuevo,
            destacado: p.destacado,
            activo: p.activo,
            mostrar_home: p.mostrar_home,
            orden_home: p.orden_home,
            orden_catalogo: p.orden_catalogo,
            seo_title: p.seo_title ?? "",
            seo_description: p.seo_description ?? "",
            talles: [...p.producto_talles].sort((a, b) => a.orden - b.orden).map((t) => t.talle),
          });
        }
      } catch (e) {
        setError(mensajeError(e));
      } finally {
        setCargando(false);
      }
    })();
  }, [slug, esNuevo]);

  function set<K extends keyof Form>(campo: K, valor: Form[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function onNombre(v: string) {
    setForm((f) => ({
      ...f,
      nombre: v,
      slug: slugManual ? f.slug : generarSlug(v),
    }));
  }

  const problemas: string[] = [];
  if (!form.nombre.trim()) problemas.push("El nombre es obligatorio.");
  if (form.precio < 0) problemas.push("El precio no puede ser negativo.");
  if (!form.categoria_id) problemas.push("Elegí una categoría.");
  if (!form.linea_id) problemas.push("Elegí una línea.");

  async function guardar(seguirEditando: boolean) {
    if (problemas.length > 0) {
      toast.error(problemas[0]);
      return;
    }
    setGuardando(true);
    try {
      const slugFinal = await slugLibre(
        "productos",
        form.slug || form.nombre,
        productoId ?? undefined
      );
      const datos: DatosProducto = {
        nombre: form.nombre.trim(),
        slug: slugFinal,
        categoria_id: form.categoria_id,
        linea_id: form.linea_id,
        color: form.color?.trim() || null,
        precio: Math.max(0, Math.round(form.precio)),
        descripcion: form.descripcion?.trim() || null,
        tipo_talle: form.tipo_talle,
        nuevo: form.nuevo,
        destacado: form.destacado,
        activo: form.activo,
        mostrar_home: form.mostrar_home,
        orden_home: form.orden_home,
        orden_catalogo: form.orden_catalogo,
        seo_title: form.seo_title?.trim() || null,
        seo_description: form.seo_description?.trim() || null,
      };

      let id = productoId;
      if (id) {
        await actualizarProducto(id, datos);
      } else {
        id = await crearProducto(datos);
        setProductoId(id);
      }
      await guardarTalles(id, form.talles);

      toast.ok(productoId ? "Cambios guardados" : "Producto creado");
      if (seguirEditando) {
        setForm((f) => ({ ...f, slug: slugFinal }));
        if (slugFinal !== slug) navegar(`/admin/productos/${slugFinal}`, { replace: true });
      } else {
        navegar("/admin/productos");
      }
    } catch (e) {
      toast.error(mensajeError(e));
    } finally {
      setGuardando(false);
    }
  }

  async function onArchivos(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!productoId) {
      toast.error("Guardá el producto antes de subir fotos.");
      return;
    }
    const lista = Array.from(files);
    for (const f of lista) {
      const invalido = validarImagen(f);
      if (invalido) {
        toast.error(invalido);
        return;
      }
    }

    setSubiendo(lista.length);
    try {
      let orden = imagenes.length;
      for (const file of lista) {
        const { url, path } = await subirImagen(file, "productos", productoId);
        await agregarImagen(productoId, url, path, orden, orden === 0);
        orden++;
        setSubiendo((n) => n - 1);
      }
      const p = await obtenerProductoPorSlug(form.slug);
      if (p) setImagenes([...p.imagenes].sort((a, b) => a.orden - b.orden));
      toast.ok(lista.length === 1 ? "Foto subida" : `${lista.length} fotos subidas`);
    } catch (e) {
      toast.error(mensajeError(e));
    } finally {
      setSubiendo(0);
      if (inputFile.current) inputFile.current.value = "";
    }
  }

  async function quitarFoto(img: FilaImagen) {
    try {
      await eliminarImagen(img.id);
      await borrarImagen(img.storage_path);
      setImagenes((l) => l.filter((i) => i.id !== img.id));
      toast.ok("Foto eliminada");
    } catch (e) {
      toast.error(mensajeError(e));
    }
  }

  async function mover(id: string, delta: number) {
    const i = imagenes.findIndex((x) => x.id === id);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= imagenes.length) return;
    const copia = [...imagenes];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    setImagenes(copia);
    if (!productoId) return;
    try {
      await reordenarImagenes(
        productoId,
        copia.map((x) => x.id),
        copia.find((x) => x.principal)?.id ?? copia[0]?.id ?? null
      );
    } catch (e) {
      toast.error(mensajeError(e));
    }
  }

  async function marcarPortada(id: string) {
    if (!productoId) return;
    try {
      await reordenarImagenes(productoId, imagenes.map((x) => x.id), id);
      setImagenes((l) => l.map((x) => ({ ...x, principal: x.id === id })));
      toast.ok("Portada actualizada");
    } catch (e) {
      toast.error(mensajeError(e));
    }
  }

  if (cargando) {
    return <p className="py-16 text-center text-sm text-tinta-500">Cargando…</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={() => navegar("/admin/productos")}
        className="group -my-2 flex min-h-10 w-fit items-center gap-2 py-2 text-sm text-tinta-500 transition-colors hover:text-salvia-700"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Volver a productos
      </button>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl bg-amarillo/35 px-5 py-4 text-sm text-tinta">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Información */}
        <div className="flex flex-col gap-5">
          <Bloque titulo="Información">
            <Campo etiqueta="Nombre" requerido>
              <input
                value={form.nombre}
                onChange={(e) => onNombre(e.target.value)}
                className={INPUT}
                placeholder="Camisa Giverny Estampada"
              />
            </Campo>

            <Campo etiqueta="Slug" ayuda="Se genera solo desde el nombre. Podés editarlo.">
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  set("slug", generarSlug(e.target.value));
                }}
                className={INPUT}
                placeholder="camisa-giverny-estampada"
              />
            </Campo>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="Categoría" requerido>
                <select
                  value={form.categoria_id ?? ""}
                  onChange={(e) => set("categoria_id", e.target.value || null)}
                  className={INPUT}
                >
                  <option value="">Elegí una…</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </Campo>
              <Campo etiqueta="Línea" requerido>
                <select
                  value={form.linea_id ?? ""}
                  onChange={(e) => set("linea_id", e.target.value || null)}
                  className={INPUT}
                >
                  <option value="">Elegí una…</option>
                  {lineas.map((l) => (
                    <option key={l.id} value={l.id}>{l.nombre}</option>
                  ))}
                </select>
              </Campo>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="Color">
                <input
                  value={form.color ?? ""}
                  onChange={(e) => set("color", e.target.value)}
                  className={INPUT}
                  placeholder="Off-white"
                />
              </Campo>
              <Campo etiqueta="Precio (Gs.)" requerido>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={form.precio}
                  onChange={(e) => set("precio", Number(e.target.value))}
                  className={INPUT}
                />
              </Campo>
            </div>

            <Campo etiqueta="Descripción">
              <textarea
                value={form.descripcion ?? ""}
                onChange={(e) => set("descripcion", e.target.value)}
                rows={4}
                className={cn(INPUT, "min-h-28 py-3 leading-relaxed")}
              />
            </Campo>
          </Bloque>

          {/* Talles */}
          <Bloque titulo="Talles">
            <Campo etiqueta="Tipo">
              <select
                value={form.tipo_talle}
                onChange={(e) => set("tipo_talle", e.target.value as Form["tipo_talle"])}
                className={INPUT}
              >
                <option value="letra">Por letra (P, M, G)</option>
                <option value="numerico">Numérico (36, 38, 40)</option>
                <option value="unico">Talle único</option>
              </select>
            </Campo>

            <div className="mt-4 flex flex-wrap gap-2">
              {form.talles.map((t, i) => (
                <span
                  key={t}
                  className="flex min-h-10 items-center gap-1.5 rounded-full bg-salvia/25 pl-4 pr-1.5 text-sm text-tinta"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => set("talles", form.talles.filter((_, j) => j !== i))}
                    aria-label={`Quitar talle ${t}`}
                    className="rounded-full p-1.5 transition-colors hover:bg-rosa/40"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
              {form.talles.length === 0 && (
                <p className="text-sm text-tinta-500">Sin talles cargados.</p>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={nuevoTalle}
                onChange={(e) => setNuevoTalle(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = nuevoTalle.trim();
                    if (v && !form.talles.includes(v)) set("talles", [...form.talles, v]);
                    setNuevoTalle("");
                  }
                }}
                placeholder="Agregar talle y Enter"
                className={cn(INPUT, "min-w-0 flex-1")}
              />
              <button
                type="button"
                onClick={() => {
                  const v = nuevoTalle.trim();
                  if (v && !form.talles.includes(v)) set("talles", [...form.talles, v]);
                  setNuevoTalle("");
                }}
                className="min-h-11 shrink-0 rounded-full border border-salvia/40 px-5 text-sm text-tinta transition-colors hover:bg-salvia/15"
              >
                Agregar
              </button>
            </div>
          </Bloque>

          {/* Fotos */}
          <Bloque titulo="Fotografías">
            {!productoId && (
              <p className="rounded-2xl bg-menta/50 px-4 py-3 text-[13px] text-tinta">
                Guardá el producto y después subí las fotos: se agrupan por
                producto en el bucket.
              </p>
            )}

            {imagenes.length > 0 && (
              <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {imagenes.map((img, i) => (
                  <li key={img.id} className="group relative">
                    <img
                      src={img.url}
                      alt=""
                      loading="lazy"
                      className={cn(
                        "aspect-[2/3] w-full rounded-xl object-cover ring-2",
                        img.principal ? "ring-salvia-600" : "ring-transparent"
                      )}
                    />
                    {img.principal && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-salvia-600 px-2 py-0.5 text-[10px] font-medium text-crema">
                        Portada
                      </span>
                    )}
                    <div className="mt-1.5 flex items-center justify-center gap-0.5">
                      <MiniAccion onClick={() => void mover(img.id, -1)} etiqueta="Mover antes" deshabilitado={i === 0}>‹</MiniAccion>
                      <MiniAccion onClick={() => void marcarPortada(img.id)} etiqueta="Marcar como portada">
                        <Star className={cn("h-3.5 w-3.5", img.principal && "fill-dorado text-dorado")} />
                      </MiniAccion>
                      <MiniAccion onClick={() => void quitarFoto(img)} etiqueta="Eliminar foto" peligro>
                        <Trash2 className="h-3.5 w-3.5" />
                      </MiniAccion>
                      <MiniAccion onClick={() => void mover(img.id, 1)} etiqueta="Mover después" deshabilitado={i === imagenes.length - 1}>›</MiniAccion>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <input
              ref={inputFile}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => void onArchivos(e.target.files)}
              className="hidden"
            />
            <button
              type="button"
              disabled={!productoId || subiendo > 0}
              onClick={() => inputFile.current?.click()}
              className={cn(
                "mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-sm transition-colors",
                productoId && subiendo === 0
                  ? "border-salvia/40 text-tinta hover:border-salvia-600 hover:bg-salvia/10"
                  : "cursor-not-allowed border-salvia/20 text-tinta-500"
              )}
            >
              {subiendo > 0 ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subiendo… quedan {subiendo}
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4" />
                  Agregar fotos (JPG, PNG o WebP, hasta 5 MB)
                </>
              )}
            </button>
          </Bloque>
        </div>

        {/* Estado y orden */}
        <div className="flex flex-col gap-5">
          <Bloque titulo="Estado">
            <div className="flex flex-col gap-1">
              <Switch etiqueta="Activo" ayuda="Si está apagado no aparece en la web." valor={form.activo} onChange={(v) => set("activo", v)} />
              <Switch etiqueta="Nuevo ingreso" valor={form.nuevo} onChange={(v) => set("nuevo", v)} />
              <Switch etiqueta="Destacado" ayuda="Aparece en “Nuevos ingresos”." valor={form.destacado} onChange={(v) => set("destacado", v)} />
              <Switch etiqueta="Mostrar en el inicio" valor={form.mostrar_home} onChange={(v) => set("mostrar_home", v)} />
            </div>
          </Bloque>

          <Bloque titulo="Orden">
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="En el catálogo">
                <input type="number" value={form.orden_catalogo} onChange={(e) => set("orden_catalogo", Number(e.target.value))} className={INPUT} />
              </Campo>
              <Campo etiqueta="En el inicio">
                <input type="number" value={form.orden_home} onChange={(e) => set("orden_home", Number(e.target.value))} className={INPUT} />
              </Campo>
            </div>
          </Bloque>

          <Bloque titulo="SEO">
            <Campo etiqueta="Título">
              <input value={form.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value)} className={INPUT} />
            </Campo>
            <Campo etiqueta="Descripción">
              <textarea value={form.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value)} rows={3} className={cn(INPUT, "min-h-20 py-3")} />
            </Campo>
          </Bloque>

          {problemas.length > 0 && (
            <ul className="rounded-2xl bg-rosa/25 px-5 py-4 text-[13px] text-tinta">
              {problemas.map((p) => <li key={p}>· {p}</li>)}
            </ul>
          )}

          <div className="sticky bottom-4 flex flex-col gap-2 rounded-[1.4rem] border border-white/70 bg-crema/90 p-4 backdrop-blur">
            <button
              onClick={() => void guardar(false)}
              disabled={guardando}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-salvia-600 text-sm font-medium text-crema transition-colors hover:bg-salvia-700 disabled:opacity-60"
            >
              {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar
            </button>
            <button
              onClick={() => void guardar(true)}
              disabled={guardando}
              className="min-h-11 rounded-full border border-salvia/40 text-sm text-tinta transition-colors hover:bg-salvia/15 disabled:opacity-60"
            >
              Guardar y seguir editando
            </button>
            <button
              onClick={() => navegar("/admin/productos")}
              className="min-h-11 rounded-full text-sm text-tinta-500 transition-colors hover:text-tinta"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const INPUT =
  "min-h-11 w-full rounded-2xl border border-salvia/35 bg-white px-4 text-[15px] text-tinta outline-none transition-colors focus:border-salvia-600 focus:ring-2 focus:ring-salvia/25";

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.4rem] border border-white/70 bg-crema/70 p-5">
      <h2 className="font-display text-xl text-tinta">{titulo}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

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

function Switch({
  etiqueta,
  ayuda,
  valor,
  onChange,
}: {
  etiqueta: string;
  ayuda?: string;
  valor: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={valor}
      onClick={() => onChange(!valor)}
      className="flex min-h-12 items-center justify-between gap-3 rounded-xl px-1 text-left transition-colors hover:bg-salvia/10"
    >
      <span className="min-w-0">
        <span className="block text-sm text-tinta">{etiqueta}</span>
        {ayuda && <span className="block text-xs text-tinta-500">{ayuda}</span>}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300",
          valor ? "bg-salvia-600" : "bg-salvia/30"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300",
            valor ? "translate-x-[1.4rem]" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
}

function MiniAccion({
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
        "flex h-8 w-8 items-center justify-center rounded-full text-xs text-tinta transition-colors",
        deshabilitado ? "opacity-30" : peligro ? "hover:bg-rosa/35" : "hover:bg-salvia/25"
      )}
    >
      {children}
    </button>
  );
}
