import { z } from 'astro/zod';

/** Etiquetas permitidas. Agregar una nueva acá antes de usarla en un artículo. */
export const ETIQUETAS = [
  'apis',
  'open-banking',
  'ia',
  'arquitectura',
  'banca-digital',
  'liderazgo',
  'desarrollo',
] as const;

export type Etiqueta = (typeof ETIQUETAS)[number];

/**
 * Fecha de publicación: una fecha YAML sin comillas (2026-11-03) o el texto "2026-11-03".
 * Se interpreta como medianoche UTC. Cualquier otro formato (03/11/2026, 2026-11-3) falla el build.
 */
const fechaArticulo = z.union([
  z.date(),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato AAAA-MM-DD, por ejemplo 2026-11-03')
    .refine((texto) => {
      const d = new Date(`${texto}T00:00:00Z`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === texto;
    }, 'Fecha inexistente')
    .transform((texto) => new Date(`${texto}T00:00:00Z`)),
]).refine((d) => !Number.isNaN(d.getTime()), 'Fecha inválida')
  .refine((d) => d.getUTCHours() === 0 && d.getUTCMinutes() === 0, 'La fecha no debe incluir hora');

/** Esquema del frontmatter. `imagen` se inyecta para poder probarlo fuera de Astro. */
export function crearEsquemaArticulo<T extends z.ZodType>(imagen: T) {
  return z.object({
    titulo: z.string().min(1),
    resumen: z.string().min(1).max(200),
    fecha: fechaArticulo,
    etiquetas: z.array(z.enum(ETIQUETAS)).min(1),
    borrador: z.boolean().default(false),
    imagen: imagen.optional(),
  });
}
