import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, Plus, X } from "lucide-react";
import { useToast } from "@/admin/components/Toasts";
import { AREA, Aviso, Campo, INPUT, INPUT_BASE, PILL_COLOR } from "@/admin/components/CamposUI";
import { mensajeError } from "@/services/admin";
import {
  guardarSeccion,
  guardarValores,
  intercambiarOrden,
  listarSeccionesAdmin,
  listarValoresAdmin,
} from "@/services/contenidoAdmin";
import { TEMAS_DISPONIBLES } from "@/lib/categories";
import type { FilaSeccion, TemaColor } from "@/types/database";
import { cn } from "@/lib/utils";

const NOMBRES: Record<string, string> = {
  hero: "Portada (Hero)",
  categorias: "Categorías",
  productos: "Productos",
  nuevos_ingresos: "Nuevos ingresos",
  manifesto: "Nosotras (Manifiesto)",
  lookbook: "Lookbook",
  redes: "Redes sociales",
  whatsapp_cta: "Llamado a WhatsApp",
};

export default function Inicio() {
  const toast = useToast();
  const [secciones, setSecciones] = useState<FilaSeccion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<FilaSeccion | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Los valores del manifiesto se editan junto con esa sección.
  const [valores, setValores] = useState<{ texto: string; color: TemaColor }[]>([]);
  const [nuevoValor, setNuevoValor] = useState("");

  async function cargar() {
    setCargando(true);
    try {
      const [s, v] = await Promise.all([listarSeccionesAdmin(), listarValoresAdmin()]);
      setSecciones(s);
      setValores(v.map((x) => ({ texto: x.texto, color: x.color })));
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

  async function alternar(s: FilaSeccion) {
    try {
      await guardarSeccion(s.id, { activo: !s.activo });
      toast.ok(s.activo ? "Sección ocultada" : "Sección visible");
      await cargar();
    } catch (e) {
      toast.error(mensajeError(e));
    }
  }

  async function mover(s: FilaSeccion, delta: number) {
    const i = secciones.findIndex((x) => x.id === s.id);
    const j = i + delta;
    if (j < 0 || j >= secciones.length) return;
    try {
      await intercambiarOrden(secciones[i], secciones[j]);
      await cargar();
    } catch (e) {
      toast.error(mensajeError(e));
    }
  }

  async function guardar() {
    if (!editando) return;
    setGuardando(true);
    try {
      await guardarSeccion(editando.id, {
        eyebrow: editando.eyebrow?.trim() || null,
        titulo: editando.titulo?.trim() || null,
        titulo_destacado: editando.titulo_destacado?.trim() || null,
        descripcion: editando.descripcion?.trim() || null,
      });
      if (editando.clave === "manifesto") {
        await guardarValores(valores.filter((v) => v.texto.trim()));
      }
      toast.ok("Cambios guardados");
      setEditando(null);
      await cargar();
    } catch (e) {
      toast.error(mensajeError(e));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {error && <Aviso mensaje={error} />}

      <p className="text-sm text-tinta-500">
        El orden de esta lista es el orden real de la página. Lo que ocultes acá
        deja de aparecer en la web.
      </p>

      <div className="overflow-hidden rounded-[1.4rem] border border-white/70 bg-crema/70">
        {cargando ? (
          <p className="px-5 py-10 text-center text-sm text-tinta-500">Cargando…</p>
        ) : secciones.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-tinta-500">
            {error ? "No se pudo cargar el listado." : "No hay secciones configuradas."}
          </p>
        ) : (
          <ul className="divide-y divide-salvia/20">
            {secciones.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-salvia/20 text-xs font-medium text-tinta">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-tinta">
                    {NOMBRES[s.clave] ?? s.clave}
                  </p>
                  <p className="truncate text-xs text-tinta-500">
                    {s.titulo ?? "Sin título"}
                  </p>
                </div>
                {!s.activo && (
                  <span className="shrink-0 rounded-full bg-tinta/10 px-2.5 py-1 text-[11px] text-tinta-500">
                    Oculta
                  </span>
                )}
                <div className="flex shrink-0 items-center gap-1">
                  <Mini onClick={() => void mover(s, -1)} etiqueta="Mover arriba" deshabilitado={i === 0}>
                    <ChevronUp className="h-4 w-4" />
                  </Mini>
                  <Mini onClick={() => void mover(s, 1)} etiqueta="Mover abajo" deshabilitado={i === secciones.length - 1}>
                    <ChevronDown className="h-4 w-4" />
                  </Mini>
                  <Mini onClick={() => void alternar(s)} etiqueta={s.activo ? "Ocultar" : "Mostrar"}>
                    {s.activo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Mini>
                  <Mini onClick={() => setEditando(s)} etiqueta="Editar textos">
                    <Pencil className="h-4 w-4" />
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
                {NOMBRES[editando.clave] ?? editando.clave}
              </h2>
              <button onClick={() => setEditando(null)} aria-label="Cerrar" className="rounded-full p-2.5 text-tinta hover:bg-salvia/15">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <Campo etiqueta="Antetítulo" ayuda="El texto chico en mayúsculas.">
                <input
                  value={editando.eyebrow ?? ""}
                  onChange={(e) => setEditando({ ...editando, eyebrow: e.target.value })}
                  className={INPUT}
                />
              </Campo>
              <Campo etiqueta="Título">
                <input
                  value={editando.titulo ?? ""}
                  onChange={(e) => setEditando({ ...editando, titulo: e.target.value })}
                  className={INPUT}
                />
              </Campo>
              <Campo etiqueta="Título destacado" ayuda="Se muestra en itálica y en verde salvia.">
                <input
                  value={editando.titulo_destacado ?? ""}
                  onChange={(e) => setEditando({ ...editando, titulo_destacado: e.target.value })}
                  className={INPUT}
                />
              </Campo>
              <Campo etiqueta="Descripción">
                <textarea
                  value={editando.descripcion ?? ""}
                  onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })}
                  rows={4}
                  className={AREA}
                />
              </Campo>

              {editando.clave === "manifesto" && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-tinta">
                    Valores
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {valores.map((v, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          value={v.texto}
                          onChange={(e) => {
                            const c = [...valores];
                            c[i] = { ...c[i], texto: e.target.value };
                            setValores(c);
                          }}
                          className={cn(INPUT, "min-w-0 flex-1")}
                        />
                        <select
                          value={v.color}
                          onChange={(e) => {
                            const c = [...valores];
                            c[i] = { ...c[i], color: e.target.value as TemaColor };
                            setValores(c);
                          }}
                          aria-label={`Color de ${v.texto}`}
                          className={cn(INPUT_BASE, "w-32 shrink-0", PILL_COLOR[v.color])}
                        >
                          {TEMAS_DISPONIBLES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setValores(valores.filter((_, j) => j !== i))}
                          aria-label={`Quitar ${v.texto}`}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-tinta hover:bg-rosa/35"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={nuevoValor}
                      onChange={(e) => setNuevoValor(e.target.value)}
                      placeholder="Agregar valor…"
                      className={cn(INPUT, "min-w-0 flex-1")}
                    />
                    <button
                      onClick={() => {
                        const t = nuevoValor.trim();
                        if (!t) return;
                        setValores([...valores, { texto: t, color: "menta" }]);
                        setNuevoValor("");
                      }}
                      className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-salvia/40 px-4 text-sm text-tinta hover:bg-salvia/15"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button onClick={() => setEditando(null)} className="min-h-11 rounded-full border border-salvia/40 px-5 text-sm text-tinta hover:bg-salvia/15">
                Cancelar
              </button>
              <button
                onClick={() => void guardar()}
                disabled={guardando}
                className="min-h-11 rounded-full bg-salvia-600 px-5 text-sm font-medium text-crema hover:bg-salvia-700 disabled:opacity-60"
              >
                {guardando ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Mini({
  onClick,
  etiqueta,
  deshabilitado,
  children,
}: {
  onClick: () => void;
  etiqueta: string;
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
        deshabilitado ? "opacity-30" : "hover:bg-salvia/20"
      )}
    >
      {children}
    </button>
  );
}
