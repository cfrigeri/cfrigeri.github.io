import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { existeEnDist, articulosPublicados } from './helpers';

describe('feeds', () => {
  it('el RSS tiene un ítem por cada artículo publicado, con su enlace absoluto', () => {
    const rss = readFileSync('dist/rss.xml', 'utf8');
    const publicados = articulosPublicados();
    expect((rss.match(/<item>/g) ?? []).length).toBe(publicados.length);
    for (const slug of publicados) {
      expect(rss).toContain(`https://cfrigeri.github.io/articulos/${slug}/`);
    }
  });
  it('existen sitemap y robots que lo referencian', () => {
    expect(existeEnDist('sitemap-index.xml')).toBe(true);
    expect(readFileSync('dist/robots.txt', 'utf8')).toContain('Sitemap: https://cfrigeri.github.io/sitemap-index.xml');
  });
});
