import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { crearEsquemaArticulo } from './content/esquema';

const articulos = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/articulos' }),
  schema: ({ image }) => crearEsquemaArticulo(image()),
});

export const collections = { articulos };
