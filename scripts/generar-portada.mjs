// Genera la portada (1200x630) de un artículo con la identidad del sitio.
// Uso: node scripts/generar-portada.mjs <carpeta-del-articulo> "Serie o etiqueta" "Línea 1" "Línea 2" ["Línea 3"]
import sharp from 'sharp';
import { join } from 'node:path';

const [carpeta, etiqueta, ...lineas] = process.argv.slice(2);
if (!carpeta || lineas.length === 0) {
  console.error('Uso: node scripts/generar-portada.mjs <carpeta> "Etiqueta" "Línea 1" ["Línea 2"]');
  process.exit(1);
}
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const inicio = 330 - (lineas.length - 1) * 42;
const textos = lineas
  .map((l, i) => `<text x="90" y="${inicio + i * 84}" font-family="DejaVu Sans, Arial, sans-serif" font-size="68" font-weight="700" fill="#F6F4EE">${esc(l)}</text>`)
  .join('');
const ancho = Math.min(80 + etiqueta.length * 19, 1000);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#163A4A"/>
  <rect x="86" y="70" width="${ancho}" height="54" fill="#D4AE5E"/>
  <text x="104" y="107" font-family="DejaVu Sans, Arial, sans-serif" font-size="30" font-weight="700" fill="#0F1E26">${esc(etiqueta)}</text>
  ${textos}
  <text x="90" y="570" font-family="DejaVu Sans, Arial, sans-serif" font-size="28" fill="#C9D3D8">Claudio Frigeri</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile(join('src/content/articulos', carpeta, 'portada.png'));
console.log(`Portada generada en src/content/articulos/${carpeta}/portada.png`);
