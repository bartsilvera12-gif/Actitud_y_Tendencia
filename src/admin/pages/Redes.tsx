import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Confirmar from "@/admin/components/Confirmar";
import { useToast } from "@/admin/components/Toasts";
import { Aviso, Bloque, INPUT } from "@/admin/components/CamposUI";
import { mensajeError } from "@/services/admin";
import {
  eliminarRed,
  guardarRed,
  listarRedesAdmin,
} from "@/services/contenidoAdmin";
import type { FilaRedSocial, TipoRed } from "@/types/database";
import { cn } from "@/lib/utils";

const TIPOS: TipoRed[] = ["instagram", "facebook", "tiktok", "whatsapp", "otro"];

type Borrador = {
  id: string | null;
  tipo: TipoRed;
  nombre: string;
  usuario: string;
  url: string;
};

export default function Redes() {
  const toast = useToast();
  const [redes, setRedes] = useState<FilaRedSocial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aEliminar, setAEliminar] = useState<FilaRedSocial | null>(null);
  const [nueva, setNueva] = useState<Borrador | null>(null);


  async function cargar() {
    setCargando(true);
    try {
      setRedes(await listarRedesAdmin());
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

  async function guardarUnaRed(b: Borrador) {
    if (!b.url.trim()) {
      toast.error("La URL es obligatoria.");
      return;
    }
    try {
      await guardarRed(b.id, {
        tipo: b.tipo,
        nombre: b.nombre.trim() || null,
        usuario: b.usuario.trim().replace(/^@/, "") || null,
        url: b.url.trim(),
        orden: b.id ? undefined : redes.length,
      });
      toast.ok(b.id ? "Red actualizada" : "Red agregada");
      setNueva(null);
      await cargar();
    } catch (e) {
      toast.error(mensajeError(e));
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {error && <Aviso mensaje={error} />}

      {/* El bloque "WhatsApp y ubicación" se saca de acá: los mismos campos
          ya están en Configuración y tener dos formularios sobre la misma fila
          invita a que uno pise lo que guardó el otro. */}
      <Bloque titulo="Redes sociales">
        {cargando ? (
          <p className="py-6 text-center text-sm text-tinta-500">Cargando…</p>
        ) : redes.length === 0 && !nueva ? (
          <p className="py-6 text-center text-sm text-tinta-500">
            {error ? "No se pudo cargar el listado." : "Todavía no hay redes cargadas."}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {redes.map((r) => (
              <li key={r.id} className="rounded-2xl bg-white/60 p-3">
                <FormRed
                  valor={{
                    id: r.id,
                    tipo: r.tipo,
                    nombre: r.nombre ?? "",
                    usuario: r.usuario ?? "",
                    url: r.url,
                  }}
                  onGuardar={guardarUnaRed}
                  onEliminar={() => setAEliminar(r)}
                />
              </li>
            ))}
          </ul>
        )}

        {nueva ? (
          <div className="rounded-2xl bg-menta/40 p-3">
            <FormRed valor={nueva} onGuardar={guardarUnaRed} onEliminar={() => setNueva(null)} esNueva />
          </div>
        ) : (
          <button
            onClick={() =>
              setNueva({ id: null, tipo: "instagram", nombre: "", usuario: "", url: "" })
            }
            className="flex min-h-11 items-center gap-1.5 self-start rounded-full border border-salvia/40 px-5 text-sm text-tinta transition-colors hover:bg-salvia/15"
          >
            <Plus className="h-4 w-4" />
            Agregar red
          </button>
        )}
      </Bloque>

      <Confirmar
        abierto={aEliminar !== null}
        tono="peligro"
        titulo="¿Eliminar esta red?"
        mensaje="Va a dejar de aparecer en el sitio y en el footer."
        confirmar="Eliminar"
        onCancelar={() => setAEliminar(null)}
        onConfirmar={() =>
          void (async () => {
            if (!aEliminar) return;
            try {
              await eliminarRed(aEliminar.id);
              toast.ok("Red eliminada");
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

function FormRed({
  valor,
  onGuardar,
  onEliminar,
  esNueva,
}: {
  valor: Borrador;
  onGuardar: (b: Borrador) => void;
  onEliminar: () => void;
  esNueva?: boolean;
}) {
  const [b, setB] = useState(valor);
  useEffect(() => setB(valor), [valor]);

  return (
    <div className="flex flex-wrap items-end gap-2">
      <label className="min-w-28">
        <span className="text-[11px] uppercase tracking-wider text-tinta-500">Tipo</span>
        <select
          value={b.tipo}
          onChange={(e) => setB({ ...b, tipo: e.target.value as TipoRed })}
          className={cn(INPUT, "mt-1 capitalize")}
        >
          {TIPOS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      {/* Los campos "Nombre" y "Usuario" se ocultaron a pedido. No se borran:
          `b` arrastra los valores que ya tiene la fila, asi que guardar desde
          aca los conserva y el footer sigue mostrando el @usuario de siempre. */}
      <label className="min-w-48 flex-[2]">
        <span className="text-[11px] uppercase tracking-wider text-tinta-500">URL</span>
        <input value={b.url} onChange={(e) => setB({ ...b, url: e.target.value })} className={cn(INPUT, "mt-1")} />
      </label>
      <button
        onClick={() => onGuardar(b)}
        className="min-h-11 shrink-0 rounded-full bg-salvia-600 px-5 text-sm font-medium text-crema hover:bg-salvia-700"
      >
        {esNueva ? "Agregar" : "Guardar"}
      </button>
      <button
        onClick={onEliminar}
        aria-label={esNueva ? "Cancelar" : "Eliminar red"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-tinta transition-colors hover:bg-rosa/35"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
