import { describe, it, expect } from 'vitest';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { leerHtml, articulosPublicados, DIST } from './helpers';
import { ETIQUETAS } from '../../src/content/esquema';

// Estas pruebas no nombran artículos concretos: recorren los que este build publicó.
// Así no dependen de qué artículo está en borrador ni de la fecha del build.
const publicados = articulosPublicados();

describe('páginas de artículo', () => {
  it.each(publicados)('%s: título, Open Graph, fecha y bio', (slug) => {
    const h = leerHtml(`articulos/${slug}/index.html`);
    const og = h.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '';
    expect(og.length).toBeGreaterThan(0);
    expect(h.querySelector('title')?.text).toBe(`${og} | Claudio Frigeri`);
    expect(h.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('article');
    expect(h.querySelector('article header time')?.text).toMatch(/^\d{1,2} de [a-záéíóú]+ de \d{4}$/);
    expect(h.querySelector('aside.bio a[href="/contacto"]')).not.toBeNull();
  });

  it.each(publicados)('%s: la imagen para compartir es absoluta y coincide con la portada', (slug) => {
    const h = leerHtml(`articulos/${slug}/index.html`);
    const og = h.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '';
    if (h.querySelector('article header img')) {
      expect(og).toMatch(/^https:\/\/cfrigeri\.github\.io\/_astro\/.+\.png$/);
    } else {
      expect(og).toBe('https://cfrigeri.github.io/og-default.png');
    }
  });
});

describe('listado y etiquetas', () => {
  it('el listado enlaza a cada artículo publicado', () => {
    const listado = leerHtml('articulos/index.html');
    for (const slug of publicados) {
      expect(listado.querySelector(`a[href="/articulos/${slug}"]`), slug).not.toBeNull();
    }
  });

  it('hay una página por cada etiqueta usada en artículos publicados, y ninguna más', () => {
    const usadas = new Set(
      publicados.flatMap((slug) =>
        leerHtml(`articulos/${slug}/index.html`)
          .querySelectorAll('a.etiqueta')
          .map((a) => (a.getAttribute('href') ?? '').split('/').pop() ?? ''),
      ),
    );
    const dirTags = join(DIST, 'articulos/tag');
    const generadas = existsSync(dirTags) ? readdirSync(dirTags) : [];
    expect(new Set(generadas)).toEqual(usadas);
    for (const tag of generadas) {
      expect(ETIQUETAS as readonly string[]).toContain(tag);
      expect(leerHtml(`articulos/tag/${tag}/index.html`).querySelectorAll('article.tarjeta').length).toBeGreaterThan(0);
    }
  });
});
