const formato = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "3 de noviembre de 2026". Usa UTC porque las fechas del frontmatter son medianoche UTC. */
export function formatearFecha(fecha: Date): string {
  return formato.format(fecha);
}
