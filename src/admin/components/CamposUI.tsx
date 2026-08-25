import { cn } from "@/lib/utils";

/** Piezas de formulario compartidas por los editores del panel. */

export const INPUT =
  "min-h-11 w-full rounded-2xl border border-salvia/35 bg-white px-4 text-[15px] text-tinta outline-none transition-colors focus:border-salvia-600 focus:ring-2 focus:ring-salvia/25";

export const AREA = cn(INPUT, "min-h-24 py-3 leading-relaxed");

export function Bloque({
  titulo,
  ayuda,
  children,
}: {
  titulo: string;
  ayuda?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.4rem] border border-white/70 bg-crema/70 p-5">
      <h2 className="font-display text-xl text-tinta">{titulo}</h2>
      {ayuda && <p className="mt-1 text-sm text-tinta-500">{ayuda}</p>}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

export function Campo({
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

export function Switch({
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

/** Pastel por clave. Las clases van completas: Tailwind purga lo que no ve. */
export const PILL_COLOR: Record<string, string> = {
  salvia: "bg-salvia",
  menta: "bg-menta",
  lila: "bg-lila",
  rosa: "bg-rosa",
  amarillo: "bg-amarillo",
  dorado: "bg-dorado",
};

export function BarraGuardar({
  guardando,
  onGuardar,
  onCancelar,
}: {
  guardando: boolean;
  onGuardar: () => void;
  onCancelar?: () => void;
}) {
  return (
    <div className="sticky bottom-4 z-10 flex flex-wrap gap-2 rounded-[1.4rem] border border-white/70 bg-crema/90 p-4 backdrop-blur">
      <button
        onClick={onGuardar}
        disabled={guardando}
        className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-salvia-600 px-6 text-sm font-medium text-crema transition-colors hover:bg-salvia-700 disabled:opacity-60"
      >
        {guardando ? "Guardando…" : "Guardar cambios"}
      </button>
      {onCancelar && (
        <button
          onClick={onCancelar}
          className="min-h-12 rounded-full border border-salvia/40 px-6 text-sm text-tinta transition-colors hover:bg-salvia/15"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}

export function Aviso({ mensaje }: { mensaje: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl bg-amarillo/35 px-5 py-4 text-sm leading-relaxed text-tinta"
    >
      {mensaje}
    </div>
  );
}
