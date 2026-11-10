// Genera public/og-default.png (1200x630) con la identidad del sitio. Ejecutar: node scripts/generar-og.mjs
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#F6F4EE"/>
  <rect x="40" y="40" width="1120" height="550" fill="#FFFFFF" stroke="#0F1E26" stroke-width="4"/>
  <text x="100" y="230" font-family="DejaVu Sans, Arial, sans-serif" font-size="66" font-weight="700" fill="#0F1E26">Pongo la IA a trabajar</text>
  <text x="100" y="310" font-family="DejaVu Sans, Arial, sans-serif" font-size="66" font-weight="700" fill="#0F1E26">en sistemas reales.</text>
  <rect x="96" y="352" width="560" height="34" fill="#D4AE5E"/>
  <text x="100" y="380" font-family="DejaVu Sans, Arial, sans-serif" font-size="44" font-weight="700" fill="#0F1E26">Y te cuento cómo.</text>
  <text x="100" y="510" font-family="DejaVu Sans, Arial, sans-serif" font-size="30" fill="#55636B">Claudio Frigeri</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(new URL('../public/og-default.png', import.meta.url).pathname);
console.log('public/og-default.png generado');
