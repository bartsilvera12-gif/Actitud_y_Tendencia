import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { useToast } from "@/admin/components/Toasts";
import {
  AREA,
  Aviso,
  BarraGuardar,
  Bloque,
  Campo,
  INPUT,
} from "@/admin/components/CamposUI";
import { mensajeError } from "@/services/admin";
import { guardarChips, guardarHero, obtenerHeroAdmin } from "@/services/contenidoAdmin";
import { subirImagen, validarImagen } from "@/services/storage";
import type { TemaColor } from "@/types/database";

type Chip = { texto: string; color: TemaColor };

export default function HeroEditar() {
  const toast = useToast();
  const inputFile = useRef<HTMLInputElement>(null);

  const [id, setId] = useState<string | null>(null);
  const [etiqueta, setEtiqueta] = useState("");
  const [l1, setL1] = useState("");
  const [d1, setD1] = useState("");
  const [l2, setL2] = useState("");
  const [d2, setD2] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [imagenPath, setImagenPath] = useState<string | null>(null);

  const [chips, setChips] = useState<Chip[]>([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const h = await obtenerHeroAdmin();
        if (h) {
          setId(h.id);
          setEtiqueta(h.etiqueta ?? "");
          setL1(h.titulo_linea_1 ?? "");
          setD1(h.titulo_destacado_1 ?? "");
          setL2(h.titulo_linea_2 ?? "");
          setD2(h.titulo_destacado_2 ?? "");
          setDescripcion(h.descripcion ?? "");
          setImagenUrl(h.imagen_url);
          setImagenPath(h.imagen_storage_path);
          setChips(
            (h.hero_chips ?? [])
              .filter((c) => c.activo)
              .sort((a, b) => a.orden - b.orden)
              .map((c) => ({ texto: c.texto, color: c.color }))
          );
        }
      } catch (e) {
        setError(mensajeError(e));
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  async function onArchivo(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const invalido = validarImagen(file);
    if (invalido) {
      toast.error(invalido);
      return;
    }
    setSubiendo(true);
    try {
      const { url, path } = await subirImagen(file, "hero");
      setImagenUrl(url);
      setImagenPath(path);
      toast.ok("Imagen subida. Acordate de guardar.");
    } catch (e) {
      toast.error(mensajeError(e));
    } finally {
      setSubiendo(false);
      if (inputFile.current) inputFile.current.value = "";
    }
  }

  async function guardar() {
    setGuardando(true);
    try {
      const heroId = await guardarHero(id, {
        etiqueta: etiqueta.trim() || null,
        titulo_linea_1: l1.trim() || null,
        titulo_destacado_1: d1.trim() || null,
        titulo_linea_2: l2.trim() || null,
        titulo_destacado_2: d2.trim() || null,
        descripcion: descripcion.trim() || null,
        imagen_url: imagenUrl,
        imagen_storage_path: imagenPath,
        activo: true,
        orden: 0,
      });
      setId(heroId);
      await guardarChips(heroId, chips.filter((c) => c.texto.trim()));
      toast.ok("Portada actualizada");
    } catch (e) {
      toast.error(mensajeError(e));
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <p className="py-16 text-center text-sm text-tinta-500">Cargando…</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {error && <Aviso mensaje={error} />}

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-5">
          <Bloque
            titulo="Textos"
            ayuda="El título se arma en dos líneas; las destacadas van en itálica."
          >
            {/* El campo "Etiqueta" se saca: Hero.tsx no lo dibuja en ningún lado,
                así que llenarlo no tenía ningún efecto. La columna sigue en la
                base y su valor se conserva al guardar. */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="Primera línea">
                <input value={l1} onChange={(e) => setL1(e.target.value)} className={INPUT} placeholder="Vestí tu" />
              </Campo>
              <Campo etiqueta="Destacado 1">
                <input value={d1} onChange={(e) => setD1(e.target.value)} className={INPUT} placeholder="actitud." />
              </Campo>
              <Campo etiqueta="Segunda línea">
                <input value={l2} onChange={(e) => setL2(e.target.value)} className={INPUT} placeholder="Marcá" />
              </Campo>
              <Campo etiqueta="Destacado 2" ayuda="Lleva el brillo dorado.">
                <input value={d2} onChange={(e) => setD2(e.target.value)} className={INPUT} placeholder="tendencia." />
              </Campo>
            </div>
            <Campo etiqueta="Descripción">
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className={AREA} />
            </Campo>
          </Bloque>

          {/* El bloque "Chips" se saca del panel a pedido. Los chips que ya
              estén cargados se siguen mostrando en la portada (en pantallas de
              más de 720px de alto) y se conservan al guardar; lo que se quita
              es la posibilidad de editarlos desde acá. */}
        </div>

        <div className="flex flex-col gap-5">
          <Bloque titulo="Imagen de fondo">
            {imagenUrl ? (
              <img
                src={imagenUrl}
                alt="Fondo de la portada"
                className="aspect-video w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-salvia/15 text-sm text-tinta-500">
                Sin imagen
              </div>
            )}
            <input
              ref={inputFile}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => void onArchivo(e.target.files)}
              className="hidden"
            />
            <button
              onClick={() => inputFile.current?.click()}
              disabled={subiendo}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-salvia/40 text-sm text-tinta transition-colors hover:border-salvia-600 hover:bg-salvia/10 disabled:opacity-60"
            >
              {subiendo ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subiendo…
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4" />
                  Cambiar imagen
                </>
              )}
            </button>
          </Bloque>

          <Bloque titulo="Vista previa">
            <div className="rounded-xl bg-crema p-4">
              <p className="font-display text-2xl leading-tight text-tinta">
                {l1}
                <span className="block italic text-salvia-700">{d1}</span>
                <span className="block">
                  {l2} <span className="italic text-dorado-700">{d2}</span>
                </span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-tinta-500">{descripcion}</p>
            </div>
          </Bloque>

          {/* El interruptor "Portada activa" se sacó a pedido: la portada se
              muestra siempre. Se sigue guardando `activo: true` para que una
              fila vieja apagada quede encendida al primer guardado. */}

          <BarraGuardar guardando={guardando} onGuardar={() => void guardar()} />
        </div>
      </div>
    </div>
  );
}
