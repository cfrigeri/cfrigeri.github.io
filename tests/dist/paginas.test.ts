import { describe, it, expect } from 'vitest';
import { leerHtml } from './helpers';

describe('páginas fijas', () => {
  it('inicio lista el artículo y tiene el CTA a contacto', () => {
    const h = leerHtml('index.html');
    expect(h.querySelector('a[href="/articulos/gobernar-agentes-como-un-banco"]')).not.toBeNull();
    expect(h.querySelector('a[href="/contacto"].btn')).not.toBeNull();
  });
  it('la portada abre con el titular, la foto y el artículo como acción principal', () => {
    const h = leerHtml('index.html');
    expect(h.querySelector('.hero h1')?.text.replace(/\s+/g, ' ').trim()).toBe(
      'Ideas y experiencias para llevar la IA a sistemas reales.',
    );
    expect(h.querySelector('.hero img')?.getAttribute('alt')).toContain('Claudio Frigeri');
    expect(h.querySelector('.hero a.btn')?.getAttribute('href')).toBe('/articulos');
  });
  it('la portada no tiene sección de casos y los artículos aparecen antes que el diagrama', () => {
    const h = leerHtml('index.html');
    expect(h.querySelector('#casos')).toBeNull();
    const html = h.toString();
    expect(html.indexOf('id="escritos"')).toBeGreaterThan(-1);
    expect(html.indexOf('id="escritos"')).toBeLessThan(html.indexOf('id="como-pienso"'));
  });
  it('la portada explica cómo pienso la IA con el diagrama y tres ideas', () => {
    const s = leerHtml('index.html').querySelector('#como-pienso')!;
    expect(s.querySelector('svg[role="img"]')).not.toBeNull();
    expect(s.querySelectorAll('ul.ideas li').length).toBe(3);
  });
  it('la portada no se presenta como oferta de servicios', () => {
    const t = leerHtml('index.html').text;
    expect(t).not.toContain('Servicios');
    expect(t).not.toContain('Contame tu proyecto');
  });
  it('sobre mí incluye trayectoria y las 4 certificaciones', () => {
    const t = leerHtml('sobre-mi/index.html').text;
    for (const c of [
      'importante banco argentino con fuerte presencia tecnológica',
      'AI Fluency Framework & Foundations',
      'Introduction to Model Context Protocol',
      'Optimize Agent Behavior',
      'Claude Code in Action',
    ]) {
      expect(t).toContain(c);
    }
  });
  it('existe la 404 con enlace a artículos', () => {
    expect(leerHtml('404.html').querySelector('a[href="/articulos"]')).not.toBeNull();
  });
});
