import { it, expect } from 'vitest';
import { variablesFaltantes } from '../../scripts/verificar-variables.mjs';

it('informa las variables obligatorias vacías o ausentes', () => {
  expect(variablesFaltantes({ PUBLIC_FORMSPREE_ID: '', PUBLIC_GOATCOUNTER_CODIGO: undefined })).toEqual([
    'PUBLIC_FORMSPREE_ID',
    'PUBLIC_GOATCOUNTER_CODIGO',
  ]);
});
it('trata los espacios en blanco como vacío', () => {
  expect(variablesFaltantes({ PUBLIC_FORMSPREE_ID: '  ', PUBLIC_GOATCOUNTER_CODIGO: 'cf' })).toEqual(['PUBLIC_FORMSPREE_ID']);
});
it('no exige la verificación de Google (es opcional)', () => {
  expect(variablesFaltantes({ PUBLIC_FORMSPREE_ID: 'abc', PUBLIC_GOATCOUNTER_CODIGO: 'cf' })).toEqual([]);
});
