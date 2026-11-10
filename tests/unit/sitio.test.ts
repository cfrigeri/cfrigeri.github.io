import { describe, it, expect } from 'vitest';
import { SITIO } from '../../src/config/sitio';

describe('SITIO', () => {
  it('tiene la URL y los enlaces de la spec', () => {
    expect(SITIO.url).toBe('https://cfrigeri.github.io');
    expect(SITIO.enlaces).toEqual({
      email: 'cfrigeri@gmail.com',
      linkedin: 'https://www.linkedin.com/in/cfrigeri',
      github: 'https://github.com/cfrigeri',
    });
  });
  it('lee los IDs externos de variables de entorno y usa vacío si no están', () => {
    expect(typeof SITIO.formspreeId).toBe('string');
    expect(typeof SITIO.goatcounterCodigo).toBe('string');
  });
});
