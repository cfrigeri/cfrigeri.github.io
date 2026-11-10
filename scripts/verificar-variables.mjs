// Falla el build de publicación si faltan las variables del repositorio.
// Sin ellas el sitio compila igual, pero sin formulario de contacto ni analítica.
// Uso: node scripts/verificar-variables.mjs
import { pathToFileURL } from 'node:url';

export const OBLIGATORIAS = ['PUBLIC_FORMSPREE_ID', 'PUBLIC_GOATCOUNTER_CODIGO'];

/** @param {Record<string, string | undefined>} env */
export function variablesFaltantes(env) {
  return OBLIGATORIAS.filter((nombre) => !env[nombre]?.trim());
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const faltan = variablesFaltantes(process.env);
  if (faltan.length > 0) {
    console.error(
      `Faltan variables del repositorio: ${faltan.join(', ')}.\n` +
        'Cargalas en Settings → Secrets and variables → Actions → Variables (ver README).',
    );
    process.exit(1);
  }
  console.log('Variables del repositorio: OK');
}
