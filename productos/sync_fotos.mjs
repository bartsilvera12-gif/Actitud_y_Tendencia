// Copia los sets de fotos desde Descargas a productos/fotos/<id>/.
// Regla de mapeo (confirmada): el producto en la posición i (0-based) usa los
// archivos "n.webp" (i=0) o "n (i).webp" (i>=1), con n = 1..4.
import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.argv[2] || ".");
const DOWNLOADS = process.argv[3] || "C:/Users/duart/Downloads";
const jsonPath = path.join(ROOT, "productos.json");
const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

let copied = 0, missing = [];
data.productos.forEach((p, i) => {
  const suffix = i === 0 ? "" : ` (${i})`;
  const destDir = path.join(ROOT, "fotos", p.id);
  fs.mkdirSync(destDir, { recursive: true });
  const fotos = [];
  for (let n = 1; n <= 4; n++) {
    const src = path.join(DOWNLOADS, `${n}${suffix}.webp`);
    const destName = `0${n}.webp`;
    const dest = path.join(destDir, destName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      fotos.push(`fotos/${p.id}/${destName}`);
      copied++;
    } else {
      missing.push(`${p.id} -> ${path.basename(src)}`);
    }
  }
  p.fotos = fotos;
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n");
console.log(`Copiadas ${copied} fotos para ${data.productos.length} productos.`);
if (missing.length) console.log("FALTANTES:\n" + missing.join("\n"));
data.productos.forEach((p, i) => console.log(` [${i}] ${p.nombre}: ${p.fotos.length} fotos`));
