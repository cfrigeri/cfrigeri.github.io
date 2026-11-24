import { describe, it, expect } from 'vitest';
import { leerHtml } from './helpers';

const h = leerHtml('contacto/index.html');

describe('página de contacto', () => {
  it('el formulario apunta a Formspree con el ID de prueba', () => {
    expect(h.querySelector('form')?.getAttribute('action')).toBe('https://formspree.io/f/prueba123');
  });
  it('tiene los campos requeridos y el honeypot oculto', () => {
    for (const n of ['nombre', 'email', 'mensaje']) {
      expect(h.querySelector(`[name="${n}"]`)?.hasAttribute('required')).toBe(true);
    }
    expect(h.querySelector('[name="_gotcha"]')?.getAttribute('tabindex')).toBe('-1');
  });
  it('el texto de error ofrece el email como alternativa', () => {
    expect(h.innerHTML).toContain('mailto:cfrigeri@gmail.com');
  });
});
