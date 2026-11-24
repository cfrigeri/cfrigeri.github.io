import { describe, it, expect } from 'vitest';
import { leerHtml } from './helpers';

const html = leerHtml('index.html');

describe('layout base', () => {
  it('tiene lang es y título por defecto', () => {
    expect(html.querySelector('html')?.getAttribute('lang')).toBe('es');
    expect(html.querySelector('title')?.text).toBe('Claudio Frigeri | IA, integraciones y arquitectura en sistemas reales');
  });
  it('og:image es absoluta y por defecto', () => {
    expect(html.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://cfrigeri.github.io/og-default.png',
    );
  });
  it('canonical apunta a la home', () => {
    expect(html.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://cfrigeri.github.io/');
  });
  it('incluye GoatCounter con el código de prueba en el build de producción', () => {
    expect(html.querySelector('script[data-goatcounter]')?.getAttribute('data-goatcounter')).toBe(
      'https://prueba.goatcounter.com/count',
    );
  });
  it('usa el tema claro', () => {
    expect(html.querySelector('html')?.getAttribute('data-bs-theme')).toBeUndefined();
  });
  it('el navbar tiene los 3 enlaces y el footer los de contacto', () => {
    const navs = html.querySelectorAll('header nav a.nav-link').map((a) => a.getAttribute('href'));
    expect(navs).toEqual(['/articulos', '/sobre-mi', '/contacto']);
    expect(html.querySelector('header nav a[href="/contacto"]')?.text.trim()).toBe('Escribime');
    const pie = html.querySelector('footer')!.innerHTML;
    for (const e of ['mailto:cfrigeri@gmail.com', 'https://www.linkedin.com/in/cfrigeri', 'https://github.com/cfrigeri', '/rss.xml']) {
      expect(pie).toContain(e);
    }
  });
});
