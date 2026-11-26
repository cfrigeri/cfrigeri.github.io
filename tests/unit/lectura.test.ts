import { describe, it, expect } from 'vitest';
import { minutosDeLectura, PALABRAS_POR_MINUTO } from '../../src/lib/lectura';

const palabras = (n: number) => Array.from({ length: n }, (_, i) => `palabra${i}`).join(' ');

describe('minutosDeLectura', () => {
  it('usa 200 palabras por minuto', () => {
    expect(PALABRAS_POR_MINUTO).toBe(200);
    expect(minutosDeLectura(palabras(1000))).toBe(5);
  });
  it('redondea hacia arriba', () => {
    expect(minutosDeLectura(palabras(201))).toBe(2);
  });
  it('nunca devuelve menos de 1 minuto, aunque el texto esté vacío', () => {
    expect(minutosDeLectura(palabras(10))).toBe(1);
    expect(minutosDeLectura('')).toBe(1);
  });
  it('no cuenta los bloques de código', () => {
    const codigo = '```ts\n' + palabras(600) + '\n```';
    expect(minutosDeLectura(`${palabras(200)}\n\n${codigo}`)).toBe(1);
  });
  it('no cuenta las marcas de Markdown ni las URLs de enlaces e imágenes', () => {
    const md = '## Título\n\n**hola** [mundo](https://ejemplo.com/una/ruta/larga) ![alt](./img.png) | a | b |';
    expect(minutosDeLectura(md)).toBe(1);
    expect(minutosDeLectura(`${palabras(199)} [enlace](https://a.com/${'x/'.repeat(50)})`)).toBe(1);
  });
});

describe('textoDeLectura', () => {
  it('formatea en español', async () => {
    const { textoDeLectura } = await import('../../src/lib/lectura');
    expect(textoDeLectura(1)).toBe('1 min de lectura');
    expect(textoDeLectura(7)).toBe('7 min de lectura');
  });
});
