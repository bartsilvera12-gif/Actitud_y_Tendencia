import { cn } from "@/lib/utils";

/** Fondo de blobs pastel en movimiento suave (aurora on-brand). */
export default function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div
        className="absolute -left-24 -top-24 h-[42rem] w-[42rem] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, var(--color-menta), transparent 68%)",
          animation: "float 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-10rem] top-10 h-[36rem] w-[36rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, var(--color-lila), transparent 70%)",
          animation: "float 11s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute bottom-[-12rem] left-1/3 h-[34rem] w-[34rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-rosa), transparent 70%)",
          animation: "float 13s ease-in-out infinite",
        }}
      />
    </div>
  );
}
