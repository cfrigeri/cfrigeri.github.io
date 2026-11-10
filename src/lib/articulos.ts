import { getCollection, type CollectionEntry } from 'astro:content';
import { filtrarPublicados } from './publicacion';

export type Articulo = CollectionEntry<'articulos'>;

/**
 * Artículos publicados al momento del build, del más nuevo al más viejo.
 * En `npm run dev` incluye borradores y programados para poder revisarlos antes de publicar.
 */
export async function obtenerPublicados(): Promise<Articulo[]> {
  return filtrarPublicados(await getCollection('articulos'), new Date(), { vistaPrevia: import.meta.env.DEV });
}
