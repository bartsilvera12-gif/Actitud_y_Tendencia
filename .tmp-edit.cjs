const fs = require("fs");
const p = "src/admin/pages/Redes.tsx";
let s = fs.readFileSync(p, "utf8");
const N = "\r\n";

const bloque = `      <label className="min-w-32 flex-1">
        <span className="text-[11px] uppercase tracking-wider text-tinta-500">Nombre</span>
        <input value={b.nombre} onChange={(e) => setB({ ...b, nombre: e.target.value })} className={cn(INPUT, "mt-1")} />
      </label>
      <label className="min-w-32 flex-1">
        <span className="text-[11px] uppercase tracking-wider text-tinta-500">Usuario</span>
        <input
          value={b.usuario}
          onChange={(e) => setB({ ...b, usuario: e.target.value })}
          placeholder="sin @"
          className={cn(INPUT, "mt-1")}
        />
      </label>
`.replace(/\n/g, N);

if (!s.includes(bloque)) throw new Error("no encuentro los campos Nombre/Usuario");

s = s.replace(bloque,
`      {/* Los campos "Nombre" y "Usuario" se ocultaron a pedido. No se borran:` + N +
`          \`b\` arrastra los valores que ya tiene la fila, así que guardar desde` + N +
`          acá los conserva y el footer sigue mostrando el @usuario de siempre. */}` + N);

fs.writeFileSync(p, s);
console.log("ok");
