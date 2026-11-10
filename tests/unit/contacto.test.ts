import { describe, it, expect, vi } from 'vitest';
import { enviarContacto } from '../../src/lib/contacto';

const datos = (gotcha = '') => {
  const f = new FormData();
  f.set('nombre', 'Ana');
  f.set('email', 'ana@x.com');
  f.set('mensaje', 'Hola');
  f.set('_gotcha', gotcha);
  return f;
};
const URL_F = 'https://formspree.io/f/prueba123';

describe('enviarContacto', () => {
  it('devuelve ok y envía POST con Accept JSON', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: true });
    expect(await enviarContacto(datos(), URL_F, fetchFn)).toBe('ok');
    expect(fetchFn).toHaveBeenCalledWith(
      URL_F,
      expect.objectContaining({ method: 'POST', headers: { Accept: 'application/json' } }),
    );
  });
  it('devuelve error si la respuesta no es ok', async () => {
    expect(await enviarContacto(datos(), URL_F, vi.fn().mockResolvedValue({ ok: false }))).toBe('error');
  });
  it('devuelve error si no hay red', async () => {
    expect(await enviarContacto(datos(), URL_F, vi.fn().mockRejectedValue(new TypeError('red')))).toBe('error');
  });
  it('no envía si el honeypot está completo', async () => {
    const fetchFn = vi.fn();
    expect(await enviarContacto(datos('bot'), URL_F, fetchFn)).toBe('spam');
    expect(fetchFn).not.toHaveBeenCalled();
  });
});
