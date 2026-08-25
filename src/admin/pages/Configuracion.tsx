import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { useToast } from "@/admin/components/Toasts";
import { AREA, Aviso, BarraGuardar, Bloque, Campo, INPUT } from "@/admin/components/CamposUI";
import { mensajeError } from "@/services/admin";
import {
  guardarConfig,
  normalizarWhatsapp,
  obtenerConfigAdmin,
} from "@/services/contenidoAdmin";
import { subirImagen, validarImagen } from "@/services/storage";
import type { FilaConfiguracion } from "@/types/database";
import { cn } from "@/lib/utils";

export default function Configuracion() {
  const toast = useToast();
  const inputLogo = useRef<HTMLInputElement>(null);
  const inputFavicon = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<FilaConfiguracion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState<"logo" | "favicon" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [ubicacion, setUbicacion] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [numero, setNumero] = useState("");
  const [display, setDisplay] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const c = await obtenerConfigAdmin();
        if (c) {
          setConfig(c);
          setNombre(c.nombre_marca ?? "");
          setLogoUrl(c.logo_url);
          setLogoPath(c.logo_storage_path);
          setFaviconUrl(c.favicon_url);
          setUbicacion(c.ubicacion ?? "");
          setSeoTitle(c.seo_title ?? "");
          setSeoDesc(c.seo_description ?? "");
          setSeoKeywords(c.seo_keywords ?? "");
          setNumero(c.whatsapp_numero ?? "");
          setDisplay(c.whatsapp_display ?? "");
          setMensaje(c.whatsapp_mensaje_general ?? "");
        }
      } catch (e) {
        setError(mensajeError(e));
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const numeroLimpio = normalizarWhatsapp(numero);
  const numeroValido = numeroLimpio.length >= 8 && numeroLimpio.length <= 15;

  async function subir(files: FileList | null, cual: "logo" | "favicon") {
    const file = files?.[0];
    if (!file) return;
    const invalido = validarImagen(file);
    if (invalido) {
      toast.error(invalido);
      return;
    }
    setSubiendo(cual);
    try {
      const { url, path } = await subirImagen(file, "brand");
      if (cual === "logo") {
        setLogoUrl(url);
        setLogoPath(path);
      } else {
        setFaviconUrl(url);
      }
      toast.ok("Imagen subida. Acordate de guardar.");
    } catch (e) {
      toast.error(mensajeError(e));
    } finally {
      setSubiendo(null);
    }
  }

  async function guardar() {
    if (!nombre.trim()) {
      toast.error("El nombre de la marca es obligatorio.");
      return;
    }
    if (!numeroValido) {
      toast.error("El número de WhatsApp debe tener entre 8 y 15 dígitos.");
      return;
    }
    setGuardando(true);
    try {
      await guardarConfig(config?.id ?? null, {
        nombre_marca: nombre.trim(),
        logo_url: logoUrl,
        logo_storage_path: logoPath,
        favicon_url: faviconUrl,
        ubicacion: ubicacion.trim() || null,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDesc.trim() || null,
        seo_keywords: seoKeywords.trim() || null,
        whatsapp_numero: numeroLimpio,
        whatsapp_display: display.trim() || null,
        whatsapp_mensaje_general: mensaje.trim() || null,
      });
      toast.ok("Configuración guardada");
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
    <div className="flex max-w-3xl flex-col gap-5">
      {error && <Aviso mensaje={error} />}

      <Bloque titulo="Marca">
        <Campo etiqueta="Nombre" requerido>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={INPUT} />
        </Campo>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-tinta">Logo</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-white/60 p-3">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 w-auto max-w-32 object-contain" />
              ) : (
                <span className="text-sm text-tinta-500">Sin logo</span>
              )}
              <input ref={inputLogo} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => void subir(e.target.files, "logo")} className="hidden" />
              <button
                onClick={() => inputLogo.current?.click()}
                disabled={subiendo === "logo"}
                className="ml-auto flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-salvia/40 px-4 text-[13px] text-tinta hover:bg-salvia/15 disabled:opacity-60"
              >
                {subiendo === "logo" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                Cambiar
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-tinta">Favicon</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-white/60 p-3">
              {faviconUrl ? (
                <img src={faviconUrl} alt="Favicon" className="h-8 w-8 object-contain" />
              ) : (
                <span className="text-sm text-tinta-500">Sin favicon</span>
              )}
              <input ref={inputFavicon} type="file" accept="image/png,image/webp" onChange={(e) => void subir(e.target.files, "favicon")} className="hidden" />
              <button
                onClick={() => inputFavicon.current?.click()}
                disabled={subiendo === "favicon"}
                className="ml-auto flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-salvia/40 px-4 text-[13px] text-tinta hover:bg-salvia/15 disabled:opacity-60"
              >
                {subiendo === "favicon" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                Cambiar
              </button>
            </div>
          </div>
        </div>

        <Campo etiqueta="Ubicación">
          <input value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} className={INPUT} />
        </Campo>
      </Bloque>

      <Bloque titulo="SEO" ayuda="Cómo aparece el sitio en Google y al compartirlo.">
        <Campo etiqueta="Título">
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={INPUT} />
        </Campo>
        <Campo etiqueta="Meta descripción" ayuda="Idealmente entre 120 y 160 caracteres.">
          <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={3} className={AREA} />
          <span className={cn("mt-1 block text-xs", seoDesc.length > 160 ? "text-rosa" : "text-tinta-500")}>
            {seoDesc.length} caracteres
          </span>
        </Campo>
        <Campo etiqueta="Palabras clave" ayuda="Separadas por comas.">
          <input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} className={INPUT} />
        </Campo>
      </Bloque>

      <Bloque titulo="WhatsApp">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            etiqueta="Número"
            requerido
            ayuda={
              numero && !numeroValido
                ? "Debe tener entre 8 y 15 dígitos."
                : `Se guarda como ${numeroLimpio || "…"}`
            }
          >
            <input
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className={cn(INPUT, numero && !numeroValido && "border-rosa")}
            />
          </Campo>
          <Campo etiqueta="Número visible">
            <input value={display} onChange={(e) => setDisplay(e.target.value)} className={INPUT} />
          </Campo>
        </div>
        <Campo etiqueta="Mensaje predeterminado">
          <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={3} className={AREA} />
        </Campo>
      </Bloque>

      <BarraGuardar guardando={guardando} onGuardar={() => void guardar()} />
    </div>
  );
}
