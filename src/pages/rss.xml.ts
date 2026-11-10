import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITIO } from '../config/sitio';
import { obtenerPublicados } from '../lib/articulos';

export async function GET(context: APIContext) {
  const publicados = await obtenerPublicados();
  return rss({
    title: SITIO.titulo,
    description: SITIO.descripcion,
    site: context.site ?? SITIO.url,
    customData: '<language>es-AR</language>',
    items: publicados.map((a) => ({
      title: a.data.titulo,
      description: a.data.resumen,
      pubDate: a.data.fecha,
      link: `/articulos/${a.id}/`,
      categories: [...a.data.etiquetas],
    })),
  });
}
