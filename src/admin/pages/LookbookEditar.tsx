import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import Confirmar from "@/admin/components/Confirmar";
import { useToast } from "@/admin/components/Toasts";
import { Aviso, Bloque, INPUT } from "@/admin/components/CamposUI";
import { listarProductos, mensajeError, type ProductoAdmin } from "@/services/admin";
import {
  agregarLookbookItem,
  eliminarLookbookItem,
  guardarLookbookItem,
  listarLookbookAdmin,
} from "@/services/contenidoAdmin";
import { borrarImagen, subirImagen, validarImagen } from "@/services/storage";
import type { FilaLookbookItem } from "@/types/database";
import { cn } from "@/lib/utils";

export default function LookbookEditar() {
  const toast = useToast();
  const inputFile = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<FilaLookbookItem[]>([]);
  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [productoElegido, setProductoElegido] = useState("");
  const [aEliminar, setAEliminar] = useState<FilaLookbookItem | null>(null);

  async function cargar() {
    setCargando(true);
    try {
      const [l, p] = await Promise.all([listarLookbookAdmin(), listarProductos()]);
      setItems(l);
      setProductos(p);
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

  /** Foto del item: la propia, o la del producto elegido. */
  function fotoDe(item: FilaLookbookItem): string | undefined {
    if (item.imagen_url) return item.imagen_url;
    const p = productos.find((x) => x.id === item.producto_id);
    return (
      p?.producto_imagenes?.find((i) => i.principal)?.url ??
      p?.producto_imagenes?.[0]?.url
    );
  }

  async function agregarProducto() {
    if (!productoElegido) return;
    try {
      await agregarLookbookItem({ producto_id: productoElegido, orden: items.length });
      toast.ok("Producto agregado al lookbook");
      setProductoElegido("");
      await cargar();
    } catch (e) {
      toast.error(mensajeError(e));
    }
  }

  async function subirFoto(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const invalido = validarImagen(file);
    if (invalido) {
      toast.error(invalido);
      return;
    }
    setSubiendo(true);
    try {
      const { url, path } = await subirImagen(file, "lookbook");
      await agregarLookbookItem({
        imagen_url: url,
        imagen_storage_path: path,
        orden: items.length,
      });
      toast.ok("Imagen agregada");
      await cargar();
    } catch (e) {
      toast.error(mensajeError(e));
    } finally {
      setSubiendo(false);
      if (inputFile.current) inputFile.current.value = "";
    }
  }

  async function mover(item: FilaLookbookItem, delta: number) {
    const i = items.findIndex((x) => x.id === item.id);
    const j = i + delta;
    if (j < 0 || j >= items.length) return;
    try {
      await Promise.all([
        guardarLookbookItem(items[i].id, { orden: items[j].orden }),
        guardarLookbookItem(items[j].id, { orden: items[i].orden }),
      ]);
      await cargar();
    } catch (e) {
      toast.error(mensajeError(e));
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {error && <Aviso mensaje={error} />}

      <Bloque
        titulo="Agregar al lookbook"
        ayuda="Podés usar la foto de un producto del catálogo o subir una imagen propia."
      >
        <div className="flex flex-wrap gap-2">
          <select
            value={productoElegido}
            onChange={(e) => setProductoElegido(e.target.value)}
            aria-label="Elegir producto"
            className={cn(INPUT, "min-w-0 flex-1")}
          >
            <option value="">Elegí un producto…</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          <button
            onClick={() => void agregarProducto()}
            disabled={!productoElegido}
            className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-salvia-600 px-5 text-sm font-medium text-crema transition-colors hover:bg-salvia-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>

        <input
          ref={inputFile}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => void subirFoto(e.target.files)}
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
              Subir una imagen propia
            </>
          )}
        </button>
      </Bloque>

      <Bloque titulo="Imágenes del lookbook">
        {cargando ? (
          <p className="py-6 text-center text-sm text-tinta-500">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-sm text-tinta-500">
            {error ? "No se pudo cargar el listado." : "Todavía no hay imágenes."}
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item, i) => {
              const foto = fotoDe(item);
              const prod = productos.find((p) => p.id === item.producto_id);
              return (
                <li key={item.id} className="rounded-xl bg-white/60 p-2">
                  {foto ? (
                    <img src={foto} alt="" loading="lazy" className="aspect-[2/3] w-full rounded-lg object-cover" />
                  ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-salvia/20 text-xs text-tinta-500">
                      Sin foto
                    </div>
                  )}
                  <p className="mt-2 truncate px-1 text-xs text-tinta-500">
                    {prod?.nombre ?? "Imagen propia"}
                  </p>
                  <div className="mt-1 flex items-center justify-center gap-0.5">
                    <Mini onClick={() => void mover(item, -1)} etiqueta="Mover antes" deshabilitado={i === 0}>
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Mini>
                    <Mini onClick={() => void mover(item, 1)} etiqueta="Mover después" deshabilitado={i === items.length - 1}>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Mini>
                    <Mini onClick={() => setAEliminar(item)} etiqueta="Quitar del lookbook" peligro>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Mini>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Bloque>

      <Confirmar
        abierto={aEliminar !== null}
        tono="peligro"
        titulo="¿Quitar del lookbook?"
        mensaje="Si era una imagen propia también se borra del almacenamiento. Los productos del catálogo no se tocan."
        confirmar="Quitar"
        onCancelar={() => setAEliminar(null)}
        onConfirmar={() =>
          void (async () => {
            if (!aEliminar) return;
            try {
              await eliminarLookbookItem(aEliminar.id);
              await borrarImagen(aEliminar.imagen_storage_path);
              toast.ok("Quitado del lookbook");
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
        "flex h-9 w-9 items-center justify-center rounded-full text-tinta transition-colors",
        deshabilitado ? "opacity-30" : peligro ? "hover:bg-rosa/35" : "hover:bg-salvia/25"
      )}
    >
      {children}
    </button>
  );
}
