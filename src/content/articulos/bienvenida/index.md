---
titulo: "Bienvenida: IA, APIs & sistemas reales"
resumen: "Por qué abro este espacio y qué vas a encontrar cada semana: experiencias reales sobre integración de IA, APIs y arquitectura de software."
fecha: 2026-10-27
etiquetas: [ia, arquitectura]
imagen: ./portada.png
---

Soy Claudio Frigeri, consultor técnico independiente. Durante más de 13 años lideré la transformación digital de canales en un importante banco argentino con fuerte presencia tecnológica: modernicé la plataforma de homebanking, diseñé APIs que procesan millones de transacciones y las integré con importantes actores del ecosistema fintech.

Este sitio es el lugar donde voy a ordenar lo aprendido. Voy a escribir sobre integración de APIs, arquitectura y refactor de sistemas, y cómo llevar la inteligencia artificial a procesos reales de cualquier negocio, más allá de la demo.

La idea es publicar un artículo por semana, con ejemplos concretos. Por ejemplo, algo tan simple como validar un CBU antes de llamar a una API:

```ts
export function esCbuValido(cbu: string): boolean {
  if (!/^\d{22}$/.test(cbu)) return false;
  const digito = (num: string, pesos: number[]) =>
    (10 - (pesos.reduce((s, p, i) => s + p * Number(num[i]), 0) % 10)) % 10;
  return (
    digito(cbu.slice(0, 7), [7, 1, 3, 9, 7, 1, 3]) === Number(cbu[7]) &&
    digito(cbu.slice(8, 21), [3, 9, 7, 1, 3, 9, 7, 1, 3, 9, 7, 1, 3]) === Number(cbu[21])
  );
}
```

Si algún tema te interesa en particular, escribime desde la página de contacto.
