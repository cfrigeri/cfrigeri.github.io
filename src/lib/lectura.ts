/** Ritmo de lectura habitual en español para texto técnico. */
export const PALABRAS_POR_MINUTO = 200;

/**
 * Minutos aproximados de lectura de un texto en Markdown.
 * No cuenta bloques de código, URLs de enlaces e imágenes ni marcas de formato. Mínimo 1.
 */
export function minutosDeLectura(markdown: string): number {
  const texto = markdown
    .replace(/```[\s\S]*?```/g, ' ') // bloques de código
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // imágenes: solo el texto alternativo
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // enlaces: solo el texto
    .replace(/<[^>]+>/g, ' ') // HTML
    .replace(/[#*_`>|~-]+/g, ' '); // marcas de formato
  const palabras = texto.split(/\s+/).filter((p) => /[\p{L}\p{N}]/u.test(p)).length;
  return Math.max(1, Math.ceil(palabras / PALABRAS_POR_MINUTO));
}

export function textoDeLectura(minutos: number): string {
  return `${minutos} min de lectura`;
}

/** Texto de lectura para un artículo de la colección ("6 min de lectura"). */
export function lecturaDeArticulo(articulo: { body?: string }): string {
  return textoDeLectura(minutosDeLectura(articulo.body ?? ''));
}
