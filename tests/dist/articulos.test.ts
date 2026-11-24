import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { leerHtml, existeEnDist, DIST } from './helpers';
import { ETIQUETAS } from '../../src/content/esquema';

// Estas pruebas usan solo el primer artículo de la serie, que ya está publicado.
// Los artículos programados no se mencionan, para que las pruebas no dependan de la fecha del build.
const SLUG = 'gobernar-agentes-como-un-banco';
const TITULO = 'Lo que la banca ya sabía sobre gobernar agentes de IA';
const articulo = leerHtml(`articulos/${SLUG}/index.html`);

describe('página de artículo', () => {
  it('usa el título del artículo en <title> y en Open Graph, con acentos intactos', () => {
    expect(articulo.querySelector('title')?.text).toBe(`${TITULO} | Claudio Frigeri`);
    expect(articulo.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(TITULO);
  });
  it('muestra la portada en el encabezado y la usa como og:image absoluta', () => {
    const img = articulo.querySelector('article header img');
    expect(img?.getAttribute('src')).toMatch(/^\/_astro\/portada\..+\.webp$/);
    const og = articulo.querySelector('meta[property="og:image"]')?.getAttribute('content');
    expect(og).toMatch(/^https:\/\/cfrigeri\.github\.io\/_astro\/portada\..+\.png$/);
    expect(articulo.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('article');
  });
  it('muestra la fecha formateada y la bio con enlace a contacto', () => {
    expect(articulo.querySelector('time')?.text).toBe('12 de noviembre de 2026');
    expect(articulo.querySelector('aside.bio a[href="/contacto"]')).not.toBeNull();
  });
  it('renderiza las tablas de Markdown', () => {
    expect(articulo.querySelectorAll('.contenido table tr').length).toBeGreaterThan(1);
  });
});

describe('listado y etiquetas', () => {
  it('el listado enlaza al artículo', () => {
    expect(leerHtml('articulos/index.html').querySelector(`a[href="/articulos/${SLUG}"]`)).not.toBeNull();
  });
  it('genera las páginas de las etiquetas del artículo publicado', () => {
    expect(existeEnDist('articulos/tag/ia/index.html')).toBe(true);
    expect(existeEnDist('articulos/tag/arquitectura/index.html')).toBe(true);
  });
  it('toda página de etiqueta generada es una etiqueta válida y lista al menos un artículo', () => {
    const generadas = readdirSync(join(DIST, 'articulos/tag'));
    for (const tag of generadas) {
      expect(ETIQUETAS as readonly string[]).toContain(tag);
      expect(leerHtml(`articulos/tag/${tag}/index.html`).querySelectorAll('article.tarjeta').length).toBeGreaterThan(0);
    }
  });
  it('no genera página para una etiqueta que ningún artículo usa', () => {
    expect(existeEnDist('articulos/tag/desarrollo/index.html')).toBe(false);
  });
});
