import { it, expect } from 'vitest';
import { formatearFecha } from '../../src/lib/fechas';

it('formatea en es-AR sin correrse de día por la zona horaria', () => {
  expect(formatearFecha(new Date('2026-11-03'))).toBe('3 de noviembre de 2026');
});
