/** Datos y configuración del sitio. Lo que cambia se edita acá. */
const env = import.meta.env ?? {};

export const SITIO = {
  url: 'https://cfrigeri.github.io',
  titulo: 'Claudio Frigeri',
  lema: 'IA, integraciones y arquitectura en sistemas reales',
  descripcion:
    'Claudio Frigeri, consultor técnico independiente. Integro la IA en sistemas de software de forma estructurada, evaluable y confiable.',
  autor: {
    nombre: 'Claudio Frigeri',
    rol: 'Consultor técnico independiente',
    bioCorta:
      'Consultor técnico independiente con 13 años de experiencia en banca digital. Ayudo a empresas de cualquier industria a integrar la IA en sus sistemas de forma estructurada, evaluable y confiable.',
  },
  enlaces: {
    email: 'cfrigeri@gmail.com',
    linkedin: 'https://www.linkedin.com/in/cfrigeri',
    github: 'https://github.com/cfrigeri',
  },
  formspreeId: (env.PUBLIC_FORMSPREE_ID as string | undefined) ?? '',
  goatcounterCodigo: (env.PUBLIC_GOATCOUNTER_CODIGO as string | undefined) ?? '',
  googleVerificacion: (env.PUBLIC_GOOGLE_VERIFICACION as string | undefined) ?? '',
} as const;
