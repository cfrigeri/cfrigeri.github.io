// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { conectarFormulario } from '../../src/lib/form-contacto';
import type { ResultadoEnvio } from '../../src/lib/contacto';

function montar() {
  document.body.innerHTML = `
    <div class="form-contacto">
      <form action="https://formspree.io/f/prueba123" novalidate>
        <input name="nombre" required />
        <input name="email" type="email" required />
        <textarea name="mensaje" required></textarea>
        <input name="_gotcha" />
        <button type="submit">Enviar</button>
      </form>
      <div class="d-none" data-exito></div>
      <div class="d-none" data-error></div>
    </div>`;
  const contenedor = document.querySelector<HTMLElement>('.form-contacto')!;
  const form = contenedor.querySelector('form')!;
  const boton = form.querySelector('button')!;
  return { contenedor, form, boton };
}

function completar(form: HTMLFormElement) {
  (form.elements.namedItem('nombre') as HTMLInputElement).value = 'Ana';
  (form.elements.namedItem('email') as HTMLInputElement).value = 'ana@x.com';
  (form.elements.namedItem('mensaje') as HTMLTextAreaElement).value = 'Hola';
}

const enviarEvento = (form: HTMLFormElement) => form.dispatchEvent(new Event('submit', { cancelable: true }));
const esperar = () => new Promise((r) => setTimeout(r, 0));

describe('conectarFormulario', () => {
  beforeEach(() => {
    window.goatcounter = undefined;
  });

  it('con campos vacíos marca was-validated y no envía', async () => {
    const { contenedor, form } = montar();
    const enviar = vi.fn();
    conectarFormulario(contenedor, enviar);
    enviarEvento(form);
    await esperar();
    expect(form.classList.contains('was-validated')).toBe(true);
    expect(enviar).not.toHaveBeenCalled();
  });

  it('un doble envío rápido manda un solo mensaje y deshabilita el botón', async () => {
    const { contenedor, form, boton } = montar();
    completar(form);
    let resolver!: (r: ResultadoEnvio) => void;
    const enviar = vi.fn(() => new Promise<ResultadoEnvio>((r) => (resolver = r)));
    conectarFormulario(contenedor, enviar);
    enviarEvento(form);
    enviarEvento(form);
    expect(enviar).toHaveBeenCalledTimes(1);
    expect(boton.disabled).toBe(true);
    expect(boton.textContent).toBe('Enviando…');
    resolver('ok');
    await esperar();
  });

  it('con error conserva el texto, muestra el aviso y rehabilita el botón', async () => {
    const { contenedor, form, boton } = montar();
    completar(form);
    conectarFormulario(contenedor, vi.fn().mockResolvedValue('error'));
    enviarEvento(form);
    await esperar();
    expect(contenedor.querySelector('[data-error]')!.classList.contains('d-none')).toBe(false);
    expect((form.elements.namedItem('mensaje') as HTMLTextAreaElement).value).toBe('Hola');
    expect(boton.disabled).toBe(false);
    expect(boton.textContent).toBe('Enviar');
  });

  it('con éxito oculta el formulario, muestra el agradecimiento y registra el evento', async () => {
    const { contenedor, form } = montar();
    completar(form);
    const count = vi.fn();
    window.goatcounter = { count };
    conectarFormulario(contenedor, vi.fn().mockResolvedValue('ok'));
    enviarEvento(form);
    await esperar();
    expect(form.classList.contains('d-none')).toBe(true);
    expect(contenedor.querySelector('[data-exito]')!.classList.contains('d-none')).toBe(false);
    expect(count).toHaveBeenCalledWith({ path: 'contacto-enviado', title: 'Contacto enviado', event: true });
  });

  it('si es spam muestra éxito pero no registra el evento', async () => {
    const { contenedor, form } = montar();
    completar(form);
    const count = vi.fn();
    window.goatcounter = { count };
    conectarFormulario(contenedor, vi.fn().mockResolvedValue('spam'));
    enviarEvento(form);
    await esperar();
    expect(contenedor.querySelector('[data-exito]')!.classList.contains('d-none')).toBe(false);
    expect(count).not.toHaveBeenCalled();
  });
});
