import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { parse, type HTMLElement } from 'node-html-parser';

export const DIST = join(process.cwd(), 'dist');

/** Parsea dist/<ruta>. */
export function leerHtml(ruta: string): HTMLElement {
  return parse(readFileSync(join(DIST, ruta), 'utf8'));
}

export function existeEnDist(ruta: string): boolean {
  return existsSync(join(DIST, ruta));
}

/** Todos los .html de dist/, como rutas relativas. */
function paginasHtml(dir = DIST, base = ''): string[] {
  return readdirSync(join(dir), { withFileTypes: true }).flatMap((e) => {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) return paginasHtml(join(dir, e.name), rel);
    return e.name.endsWith('.html') ? [rel] : [];
  });
}

/** Enlaces internos (href="/...") que no apuntan a un archivo existente en dist/. */
export function enlacesRotos(): string[] {
  const rotos: string[] = [];
  for (const pagina of paginasHtml()) {
    for (const a of leerHtml(pagina).querySelectorAll('[href]')) {
      const href = a.getAttribute('href') ?? '';
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const ruta = decodeURI(href.split(/[?#]/)[0]).replace(/^\/+/, '').replace(/\/$/, '');
      const destino = ruta === '' ? 'index.html' : extname(ruta) ? ruta : `${ruta}/index.html`;
      if (!existeEnDist(destino)) rotos.push(`${pagina} -> ${href}`);
    }
  }
  return rotos;
}

/** Slugs de los artículos publicados en este build (carpetas de dist/articulos, sin las etiquetas). */
export function articulosPublicados(): string[] {
  const dir = join(DIST, 'articulos');
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'tag')
    .map((e) => e.name)
    .sort();
}
