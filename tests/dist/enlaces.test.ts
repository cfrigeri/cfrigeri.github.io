import { it, expect } from 'vitest';
import { enlacesRotos } from './helpers';

it('no hay enlaces internos rotos', () => {
  expect(enlacesRotos()).toEqual([]);
});
