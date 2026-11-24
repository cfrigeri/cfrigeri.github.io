import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { existeEnDist } from './helpers';

describe('feeds', () => {
  it('el RSS contiene el artículo publicado con su enlace absoluto', () => {
    const rss = readFileSync('dist/rss.xml', 'utf8');
    expect(rss).toContain('Lo que la banca ya sabía sobre gobernar agentes de IA');
    expect(rss).toContain('https://cfrigeri.github.io/articulos/gobernar-agentes-como-un-banco/');
  });
  it('existen sitemap y robots que lo referencian', () => {
    expect(existeEnDist('sitemap-index.xml')).toBe(true);
    expect(readFileSync('dist/robots.txt', 'utf8')).toContain('Sitemap: https://cfrigeri.github.io/sitemap-index.xml');
  });
});
