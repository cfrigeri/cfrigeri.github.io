import type { ResultadoEnvio } from './contacto';

declare global {
  interface Window {
    goatcounter?: { count: (vars: { path: string; title: string; event: boolean }) => void };
  }
}

type Enviar = (datos: FormData, endpoint: string) => Promise<ResultadoEnvio>;

/**
 * Conecta el comportamiento del formulario de contacto dentro de `contenedor`:
 * validación, bloqueo de doble envío, avisos de éxito/error y evento de analítica.
 */
export function conectarFormulario(contenedor: HTMLElement, enviar: Enviar): void {
  const form = contenedor.querySelector('form')!;
  const boton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const exito = contenedor.querySelector<HTMLElement>('[data-exito]')!;
  const error = contenedor.querySelector<HTMLElement>('[data-error]')!;
  let enviando = false;

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (enviando) return;
    error.classList.add('d-none');
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    enviando = true;
    boton.disabled = true;
    boton.textContent = 'Enviando…';

    const resultado = await enviar(new FormData(form), form.action);

    if (resultado === 'error') {
      error.classList.remove('d-none');
      boton.disabled = false;
      boton.textContent = 'Enviar';
      enviando = false;
      return;
    }
    form.classList.add('d-none');
    exito.classList.remove('d-none');
    if (resultado === 'ok') {
      window.goatcounter?.count({ path: 'contacto-enviado', title: 'Contacto enviado', event: true });
    }
  });
}
