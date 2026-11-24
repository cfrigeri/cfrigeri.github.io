import { it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DIST } from './helpers';

// El sitio no nombra empleadores, clientes, socios ni instituciones: se describen por industria.
// La lista va en base64 para que los nombres no aparezcan en texto plano en el repositorio público.
// Para agregar uno: Buffer.from('Nombre').toString('base64').
const MARCAS = [
  'QklORA==',
  'QmFuY28gSW5kdXN0cmlhbA==',
  'VWFsw6E=',
  'VWFsYQ==',
  'TWVyY2FkbyBMaWJyZQ==',
  'TWVyY2Fkb0xpYnJl',
  'UGVyc29uYWwgUGF5',
  'SW5kcmE=',
  'Q2VpY29t',
  'SW50ZWNo',
  'Q2FycmVmb3Vy',
  'VGhhbGVz',
  'TW92aXN0YXI=',
  'QWVyb3B1ZXJ0b3MgQXJnZW50aW5h',
  'R2VtbW8=',
  'T1JUIEFyZ2VudGluYQ==',
].map((m) => Buffer.from(m, 'base64').toString('utf8'));

function archivos(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? archivos(join(dir, e.name)) : /\.(html|xml)$/.test(e.name) ? [join(dir, e.name)] : [],
  );
}

it('ninguna página ni feed menciona marcas de empleadores, clientes o instituciones', () => {
  const hallazgos = archivos(DIST).flatMap((f) => {
    const texto = readFileSync(f, 'utf8');
    return MARCAS.filter((m) => texto.includes(m)).map((m) => `${f.replace(DIST, '')}: ${m}`);
  });
  expect(hallazgos).toEqual([]);
});
