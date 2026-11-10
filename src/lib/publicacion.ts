import { ETIQUETAS } from '../content/esquema';

export interface ArticuloBase {
  id: string;
  data: { fecha: Date; borrador: boolean; etiquetas: readonly string[] };
}

export type EstadoArticulo = 'publicado' | 'programado' | 'borrador';

/** Única regla de publicación del sitio: no es borrador y su fecha ya llegó. */
export function estadoArticulo(articulo: ArticuloBase, ahora: Date): EstadoArticulo {
  if (articulo.data.borrador) return 'borrador';
  return articulo.data.fecha.getTime() <= ahora.getTime() ? 'publicado' : 'programado';
}

/**
 * Devuelve una copia ordenada del más nuevo al más viejo (empate: por id) con los artículos publicados.
 * Con `vistaPrevia` (solo en `npm run dev`) incluye también borradores y programados.
 */
export function filtrarPublicados<T extends ArticuloBase>(
  articulos: readonly T[],
  ahora: Date,
  { vistaPrevia = false }: { vistaPrevia?: boolean } = {},
): T[] {
  return articulos
    .filter((a) => vistaPrevia || estadoArticulo(a, ahora) === 'publicado')
    .sort((x, y) => y.data.fecha.getTime() - x.data.fecha.getTime() || x.id.localeCompare(y.id));
}

/** Etiquetas que tienen al menos un artículo publicado, en el orden de ETIQUETAS. */
export function etiquetasConArticulos<T extends ArticuloBase>(publicados: readonly T[]): string[] {
  const usadas = new Set(publicados.flatMap((a) => a.data.etiquetas));
  return ETIQUETAS.filter((e) => usadas.has(e));
}
