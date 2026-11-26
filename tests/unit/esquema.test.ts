import { describe, it, expect } from 'vitest';
import { z } from 'astro/zod';
import { crearEsquemaArticulo, ETIQUETAS } from '../../src/content/esquema';

const esquema = crearEsquemaArticulo(z.string());
const valido = { titulo: 'T', resumen: 'R', fecha: '2026-11-03', etiquetas: ['ia'] };

describe('esquema de artículo', () => {
  it('acepta un artículo válido y pone borrador=false por defecto', () => {
    const r = esquema.parse(valido);
    expect(r.borrador).toBe(false);
    expect(r.fecha).toBeInstanceOf(Date);
  });
  it('rechaza una etiqueta fuera de la lista', () => {
    expect(esquema.safeParse({ ...valido, etiquetas: ['IA'] }).success).toBe(false);
  });
  it('rechaza un artículo sin etiquetas', () => {
    expect(esquema.safeParse({ ...valido, etiquetas: [] }).success).toBe(false);
  });
  it('rechaza un resumen de más de 200 caracteres', () => {
    expect(esquema.safeParse({ ...valido, resumen: 'x'.repeat(201) }).success).toBe(false);
  });
  it('rechaza un artículo sin fecha', () => {
    const { fecha: _fecha, ...sinFecha } = valido;
    expect(esquema.safeParse(sinFecha).success).toBe(false);
  });
  it('ETIQUETAS coincide con la spec', () => {
    expect(ETIQUETAS).toEqual(['apis', 'open-banking', 'ia', 'arquitectura', 'banca-digital', 'liderazgo', 'desarrollo', 'gobernanza', 'automatizacion']);
  });
});

describe('fecha del artículo', () => {
  it('acepta YYYY-MM-DD como medianoche UTC', () => {
    expect(esquema.parse({ ...valido, fecha: '2026-11-03' }).fecha.toISOString()).toBe('2026-11-03T00:00:00.000Z');
  });
  it('acepta una fecha YAML (Date)', () => {
    expect(esquema.parse({ ...valido, fecha: new Date('2026-11-03') }).fecha.toISOString()).toBe('2026-11-03T00:00:00.000Z');
  });
  it('rechaza el formato dd/mm/aaaa', () => {
    expect(esquema.safeParse({ ...valido, fecha: '03/11/2026' }).success).toBe(false);
  });
  it('rechaza un día de un solo dígito', () => {
    expect(esquema.safeParse({ ...valido, fecha: '2026-11-3' }).success).toBe(false);
  });
  it('rechaza una fecha inexistente', () => {
    expect(esquema.safeParse({ ...valido, fecha: '2026-02-30' }).success).toBe(false);
  });
});
