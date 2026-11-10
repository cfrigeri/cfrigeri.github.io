import { describe, it, expect } from 'vitest';
import { filtrarPublicados, etiquetasConArticulos, estadoArticulo } from '../../src/lib/publicacion';

const a = (id: string, fecha: string, borrador = false, etiquetas = ['ia']) =>
  ({ id, data: { fecha: new Date(fecha), borrador, etiquetas } });
const ahora = new Date('2026-11-03T09:00:00Z');

describe('filtrarPublicados', () => {
  it('excluye borradores', () => {
    expect(filtrarPublicados([a('x', '2026-01-01', true)], ahora)).toEqual([]);
  });
  it('excluye fechas futuras', () => {
    expect(filtrarPublicados([a('x', '2026-11-04')], ahora)).toEqual([]);
  });
  it('incluye un artículo con fecha de hoy cuando el cron corre a las 09:00 UTC', () => {
    expect(filtrarPublicados([a('x', '2026-11-03')], ahora).map((x) => x.id)).toEqual(['x']);
  });
  it('ordena del más nuevo al más viejo y desempata por id', () => {
    const r = filtrarPublicados([a('b', '2026-10-01'), a('c', '2026-10-20'), a('a', '2026-10-01')], ahora);
    expect(r.map((x) => x.id)).toEqual(['c', 'a', 'b']);
  });
  it('no modifica el arreglo original', () => {
    const lista = [a('b', '2026-10-01'), a('c', '2026-10-20')];
    filtrarPublicados(lista, ahora);
    expect(lista.map((x) => x.id)).toEqual(['b', 'c']);
  });
});

describe('etiquetasConArticulos', () => {
  it('devuelve únicas y en el orden de ETIQUETAS', () => {
    const r = etiquetasConArticulos([a('x', '2026-01-01', false, ['ia', 'apis']), a('y', '2026-01-02', false, ['apis'])]);
    expect(r).toEqual(['apis', 'ia']);
  });
});

describe('vista previa (npm run dev)', () => {
  it('con vistaPrevia incluye borradores y programados, ordenados', () => {
    const r = filtrarPublicados([a('b', '2026-01-01', true), a('f', '2026-12-01'), a('p', '2026-10-01')], ahora, {
      vistaPrevia: true,
    });
    expect(r.map((x) => x.id)).toEqual(['f', 'p', 'b']);
  });
  it('estadoArticulo distingue publicado, programado y borrador', () => {
    expect(estadoArticulo(a('x', '2026-10-01'), ahora)).toBe('publicado');
    expect(estadoArticulo(a('x', '2026-12-01'), ahora)).toBe('programado');
    expect(estadoArticulo(a('x', '2026-10-01', true), ahora)).toBe('borrador');
  });
});
