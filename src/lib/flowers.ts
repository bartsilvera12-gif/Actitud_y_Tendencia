/** Biblioteca floral de la marca (acuarela) — /public/brand/flores/*.png */
const base = "/brand/flores";

export const flores = {
  cosmosAmarillo: `${base}/cosmos-amarillo.png`,
  cosmosRosa: `${base}/cosmos-rosa.png`,
  cosmosLila: `${base}/cosmos-lila.png`,
  cosmosLilaTallo: `${base}/cosmos-lila-tallo.png`,
  peoniaRosa: `${base}/peonia-rosa.png`,
  peoniaRosaTallo: `${base}/peonia-rosa-tallo.png`,
  lavanda: `${base}/lavanda.png`,
  larkspurLila: `${base}/larkspur-lila.png`,
  ramilleteRosa: `${base}/ramillete-rosa.png`,
  ramilleteAmarillo: `${base}/ramillete-amarillo.png`,
  tulipanAmarillo: `${base}/tulipan-amarillo.png`,
  tulipanRosa: `${base}/tulipan-rosa.png`,
  tulipanLila: `${base}/tulipan-lila.png`,
  hojaRama: `${base}/hoja-rama.png`,
  helecho: `${base}/helecho.png`,
  ramaHorizontal: `${base}/rama-horizontal.png`,
  trazoMenta: `${base}/trazo-menta.png`,
} as const;

export type FlorKey = keyof typeof flores;
