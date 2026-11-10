export type ResultadoEnvio = 'ok' | 'error' | 'spam';

/**
 * Envía el formulario a Formspree. Nunca lanza: devuelve el resultado para que la UI decida.
 * Si el honeypot `_gotcha` viene completo, es un bot: no se envía nada.
 */
export async function enviarContacto(
  datos: FormData,
  endpoint: string,
  fetchFn: typeof fetch = fetch,
): Promise<ResultadoEnvio> {
  const gotcha = datos.get('_gotcha');
  if (typeof gotcha === 'string' && gotcha.trim() !== '') return 'spam';
  try {
    const res = await fetchFn(endpoint, { method: 'POST', body: datos, headers: { Accept: 'application/json' } });
    return res.ok ? 'ok' : 'error';
  } catch {
    return 'error';
  }
}
