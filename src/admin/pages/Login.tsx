import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import FloralAccent from "@/components/ui/FloralAccent";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function Login() {
  const { entrar, estado, error: errorAuth, salir } = useAuth();
  const navegar = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Autenticó pero no es administrador: se cierra la sesión y se avisa.
  useEffect(() => {
    if (estado === "no-autorizado") {
      setError(
        "Tu usuario no tiene acceso al panel. Pedile a un administrador que te habilite."
      );
      void salir();
    }
  }, [estado, salir]);

  if (estado === "admin") return <Navigate to="/admin" replace />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;
    setError(null);
    setEnviando(true);
    const { error: err } = await entrar(email, password);
    setEnviando(false);
    if (err) setError(err);
    else navegar("/admin", { replace: true });
  }

  const mensaje = error ?? (estado === "error" ? errorAuth : null);

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-gradient-to-br from-menta/60 via-crema to-lila/40 px-5 py-12">
      {/* Mismas flores del sitio, para que el panel se sienta parte de la marca. */}
      <FloralAccent flor="cosmosRosa" className="left-6 top-10 w-20 md:left-20 md:w-28" rotate={-14} float />
      <FloralAccent flor="cosmosAmarillo" className="right-8 top-16 hidden w-20 md:block" rotate={16} float delay={0.6} />
      <FloralAccent flor="lavanda" className="bottom-12 left-12 hidden w-16 md:block" opacity={90} />
      <FloralAccent flor="tulipanLila" className="bottom-20 right-16 w-14 md:w-20" rotate={-8} float delay={0.3} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-[2rem] border border-white/70 bg-crema/85 p-8 shadow-[0_30px_70px_-35px_rgba(94,138,111,0.55)] backdrop-blur-xl sm:p-10">
          <img
            src="/brand/logo-gold.png"
            alt="Actitud & Tendencia"
            className="mx-auto h-10 w-auto"
          />

          <div className="mt-7 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-salvia-700">
              Panel privado
            </p>
            <h1 className="mt-2 font-display text-3xl text-tinta">
              Ingresá a tu <span className="italic text-salvia-700">panel</span>
            </h1>
          </div>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-tinta"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@actitudytendencia.com"
                className="mt-2 min-h-12 w-full rounded-2xl border border-salvia/35 bg-white px-4 text-[15px] text-tinta outline-none transition-colors placeholder:text-tinta-500/60 focus:border-salvia-600 focus:ring-2 focus:ring-salvia/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-tinta"
              >
                Contraseña
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={verPass ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-salvia/35 bg-white px-4 pr-12 text-[15px] text-tinta outline-none transition-colors focus:border-salvia-600 focus:ring-2 focus:ring-salvia/30"
                />
                <button
                  type="button"
                  onClick={() => setVerPass((v) => !v)}
                  aria-label={verPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2.5 text-tinta-500 transition-colors hover:bg-salvia/15 hover:text-tinta"
                >
                  {verPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mensaje && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="flex items-start gap-2 rounded-2xl bg-rosa/25 px-4 py-3 text-[13px] leading-relaxed text-tinta"
              >
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-tinta" />
                {mensaje}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={enviando || !email || !password}
              className={cn(
                "group mt-2 flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-all duration-300",
                enviando || !email || !password
                  ? "cursor-not-allowed bg-salvia/30 text-tinta-500"
                  : "bg-salvia-600 text-crema shadow-sm hover:-translate-y-0.5 hover:bg-salvia-700"
              )}
            >
              {enviando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ingresando…
                </>
              ) : (
                <>
                  Ingresar al panel
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-tinta-500">
            <a href="/" className="underline underline-offset-4 hover:text-salvia-700">
              Volver a la tienda
            </a>
          </p>
        </div>

        {/* Detalle dorado, el mismo guiño del CTA del sitio. */}
        <div className="mt-6 flex items-center justify-center gap-3" aria-hidden>
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-dorado/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-dorado" />
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-dorado/70" />
        </div>
      </motion.div>
    </div>
  );
}
