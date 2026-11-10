# Sitio web personal — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el sitio personal estático de Claudio Frigeri (artículos en Markdown, Sobre mí y Contacto) y publicarlo en GitHub Pages.

**Architecture:** Astro genera HTML estático a partir de una content collection de artículos validada con Zod. La regla de "qué está publicado" y el envío del formulario viven en funciones puras de `src/lib/` probadas con Vitest. El HTML compilado se verifica con pruebas sobre `dist/`. Una GitHub Action valida, compila y publica en cada push y una vez por día.

**Tech Stack:** Astro (última versión estable, TypeScript strict), Bootstrap 5 vía npm + SCSS (`sass`), `@fontsource-variable/inter`, `@astrojs/rss`, `@astrojs/sitemap`, Vitest, `node-html-parser`, `cross-env`, Formspree, GoatCounter, GitHub Actions + GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-27-sitio-web-personal-design.md`

## Global Constraints

- Todo el texto visible del sitio está en español (`<html lang="es">`).
- URL del sitio: `https://cfrigeri.github.io`; el repositorio se llama `cfrigeri.github.io`. **Confirmar el usuario de GitHub con Claudio antes de la Tarea 9**: si es otro, se cambia solo en `src/config/sitio.ts`.
- Etiquetas permitidas, exactas y en este orden: `apis`, `open-banking`, `ia`, `arquitectura`, `banca-digital`, `liderazgo`, `desarrollo`.
- `resumen`: obligatorio, máximo 200 caracteres.
- Un artículo está publicado si `borrador === false` y `fecha <= momento del build`.
- Color primario: `$primary: #1F4E79`, definido una sola vez en `src/styles/main.scss`.
- Enlaces: email `cfrigeri@gmail.com`, LinkedIn `https://www.linkedin.com/in/cfrigeri`, GitHub `https://github.com/cfrigeri`.
- Los IDs externos se leen de variables de entorno públicas: `PUBLIC_FORMSPREE_ID` y `PUBLIC_GOATCOUNTER_CODIGO`. Ningún ID va escrito en el código.
- El script de GoatCounter se incluye solo si `import.meta.env.PROD` y el código no está vacío.
- Endpoint de Formspree: `https://formspree.io/f/${formspreeId}`; el campo honeypot se llama `_gotcha`.
- Evento de analítica del formulario: path `contacto-enviado`.
- Las fechas se muestran en formato `es-AR` largo ("3 de noviembre de 2026") con `timeZone: 'UTC'`.
- Cron de publicación diaria: `0 9 * * *` (06:00 en Buenos Aires).
- Los scripts de npm usan `cross-env` para que funcionen en Windows, macOS y Linux.
- Mensajes de commit en español con prefijo convencional (`feat:`, `test:`, `chore:`, `docs:`, `ci:`).

## Review Focus

1. **Fecha y zona horaria:** un artículo con `fecha: 2026-11-03` debe mostrarse como "3 de noviembre de 2026" y no como el día 2 (YAML lo interpreta como medianoche UTC y Buenos Aires está en UTC−3). → Prueba en la Tarea 3.
2. **Artículo sin `imagen`:** `og:image` debe apuntar a `/og-default.png` y nunca quedar vacío. → Prueba en la Tarea 5.
3. **Caracteres especiales en título o resumen** (`&`, comillas, `ñ`, `:`): deben aparecer escapados correctamente en `<title>`, en las meta y en el RSS. → El primer artículo usa `&` y `:` a propósito; pruebas en las Tareas 5 y 8.
4. **Etiqueta permitida sin artículos publicados:** no debe generar una página vacía en `/articulos/tag/<etiqueta>`. → Prueba en la Tarea 5.
5. **Doble clic en "Enviar":** no debe mandar dos mensajes; el botón queda deshabilitado mientras se envía. → Prueba en la Tarea 7.

---

## Estructura de archivos

```
astro.config.mjs              site, integraciones, Shiki
vitest.config.ts              entorno node; incluye tests/
src/config/sitio.ts           SITIO (datos, enlaces, IDs desde env)
src/content/esquema.ts        ETIQUETAS, Etiqueta, crearEsquemaArticulo()
src/content.config.ts         colección "articulos" (glob loader)
src/content/articulos/bienvenida/index.md
src/lib/publicacion.ts        funciones puras: filtrarPublicados, etiquetasConArticulos
src/lib/fechas.ts             formatearFecha
src/lib/articulos.ts          obtenerPublicados() (getCollection + publicacion)
src/lib/contacto.ts           enviarContacto()
src/layouts/Base.astro
src/layouts/Articulo.astro
src/components/{Header,Footer,TarjetaArticulo,Etiquetas,BioAutor,FormContacto}.astro
src/pages/{index,sobre-mi,contacto,404}.astro
src/pages/articulos/{index,[slug]}.astro
src/pages/articulos/tag/[tag].astro
src/pages/rss.xml.ts
src/styles/main.scss
public/{favicon.svg,og-default.png,robots.txt}
scripts/generar-og.mjs        genera og-default.png (una vez)
tests/unit/*.test.ts          pruebas de lib/ y esquema
tests/dist/*.test.ts          pruebas sobre el HTML compilado
tests/dist/helpers.ts         leerHtml(), existeEnDist()
.github/workflows/deploy.yml
README.md
```

Scripts de `package.json` (definidos en la Tarea 1):

| Script | Comando |
|--------|---------|
| `dev` | `astro dev` |
| `check` | `astro check` |
| `build` | `astro build` |
| `build:test` | `cross-env PUBLIC_FORMSPREE_ID=prueba123 PUBLIC_GOATCOUNTER_CODIGO=prueba astro build` |
| `test` | `vitest run tests/unit` |
| `test:dist` | `npm run build:test && vitest run tests/dist` |

---

### Task 1: Andamiaje del proyecto y configuración del sitio

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `src/config/sitio.ts`, `src/styles/main.scss`, `src/pages/index.astro` (temporal), `public/favicon.svg`
- Test: `tests/unit/sitio.test.ts`

**Interfaces:**
- Produces: `SITIO` exportado desde `src/config/sitio.ts`:
  ```ts
  export const SITIO: {
    url: string;            // 'https://cfrigeri.github.io'
    titulo: string;         // 'Claudio Frigeri'
    lema: string;           // 'Banca digital · APIs financieras · IA aplicada'
    descripcion: string;    // una oración para la meta descripción por defecto
    autor: { nombre: string; rol: string; bioCorta: string; foto: string | null };
    enlaces: { email: string; linkedin: string; github: string };
    formspreeId: string;    // import.meta.env.PUBLIC_FORMSPREE_ID ?? ''
    goatcounterCodigo: string; // import.meta.env.PUBLIC_GOATCOUNTER_CODIGO ?? ''
  };
  ```
  `autor.foto` es `null` hasta que Claudio aporte una foto (los componentes muestran las iniciales "CF").

- [ ] **Step 1:** Crear el proyecto Astro en la carpeta actual con la plantilla mínima y TypeScript `strict`. Instalar: `bootstrap`, `sass`, `@fontsource-variable/inter`, `@astrojs/rss`, `@astrojs/sitemap` y, como dependencias de desarrollo, `vitest`, `node-html-parser`, `cross-env` y `@astrojs/check`. Definir los scripts de la tabla anterior.

- [ ] **Step 2: Escribir la prueba que falla**

```ts
// tests/unit/sitio.test.ts
import { describe, it, expect } from 'vitest';
import { SITIO } from '../../src/config/sitio';

describe('SITIO', () => {
  it('tiene la URL y los enlaces de la spec', () => {
    expect(SITIO.url).toBe('https://cfrigeri.github.io');
    expect(SITIO.enlaces).toEqual({
      email: 'cfrigeri@gmail.com',
      linkedin: 'https://www.linkedin.com/in/cfrigeri',
      github: 'https://github.com/cfrigeri',
    });
  });
  it('lee los IDs externos de variables de entorno y usa vacío si no están', () => {
    expect(typeof SITIO.formspreeId).toBe('string');
    expect(typeof SITIO.goatcounterCodigo).toBe('string');
  });
});
```

- [ ] **Step 3:** Ejecutar `npm test`. Resultado esperado: FAIL (no existe `src/config/sitio.ts`).

- [ ] **Step 4:** Implementar `src/config/sitio.ts`. `bioCorta`: 2 oraciones basadas en el perfil (consultor técnico independiente con 13 años en banca digital; integración de IA, APIs y arquitectura).

- [ ] **Step 5:** Configurar `astro.config.mjs`: `site: SITIO.url`, integración `sitemap()` y `markdown.shikiConfig.theme: 'github-light'`. Configurar `vitest.config.ts` con `environment: 'node'`. En `main.scss`, definir `$primary: #1F4E79` y `$font-family-sans-serif: 'Inter Variable', system-ui, sans-serif` **antes** de importar Bootstrap, e importar solo: functions, variables, maps, mixins, utilities, root, reboot, type, images, containers, grid, buttons, forms, nav, navbar, card, badge, alert, transitions y `utilities/api`. `index.astro` temporal: un `<h1>` que importa `main.scss` y la fuente.

- [ ] **Step 6:** Ejecutar `npm test && npm run check && npm run build`. Resultado esperado: las pruebas pasan, 0 errores de `astro check` y existe `dist/index.html`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: andamiaje Astro con Bootstrap, Vitest y configuración del sitio"
```

---

### Task 2: Esquema de contenido y primer artículo

**Files:**
- Create: `src/content/esquema.ts`, `src/content.config.ts`, `src/content/articulos/bienvenida/index.md`
- Test: `tests/unit/esquema.test.ts`

**Interfaces:**
- Produces, desde `src/content/esquema.ts`:
  - `ETIQUETAS: readonly ['apis','open-banking','ia','arquitectura','banca-digital','liderazgo','desarrollo']`
  - `type Etiqueta = typeof ETIQUETAS[number]`
  - `crearEsquemaArticulo(imagen: z.ZodTypeAny): z.ZodObject<...>` con campos `titulo: string`, `resumen: string (max 200)`, `fecha: z.coerce.date()`, `etiquetas: Etiqueta[] (min 1)`, `borrador: boolean (default false)`, `imagen: imagen.optional()`.
- Produces, desde `src/content.config.ts`: la colección `articulos` con loader `glob({ pattern: '**/index.md', base: './src/content/articulos' })` y `schema: ({ image }) => crearEsquemaArticulo(image())`. El `id` de cada entrada es el nombre de la carpeta (`bienvenida`). Si la versión de Astro genera `bienvenida/index`, pasar un `generateId` que devuelva la carpeta.

- [ ] **Step 1: Escribir las pruebas que fallan**

```ts
// tests/unit/esquema.test.ts
import { z } from 'zod';
const esquema = crearEsquemaArticulo(z.string());
const valido = { titulo: 'T', resumen: 'R', fecha: '2026-11-03', etiquetas: ['ia'] };

it('acepta un artículo válido y pone borrador=false por defecto', () => {
  const r = esquema.parse(valido);
  expect(r.borrador).toBe(false);
  expect(r.fecha).toBeInstanceOf(Date);
});
it('rechaza una etiqueta fuera de la lista', () => {
  expect(esquema.safeParse({ ...valido, etiquetas: ['IA'] }).success).toBe(false);
});
it('rechaza un artículo sin etiquetas', () => {
  expect(esquema.safeParse({ ...valido, etiquetas: [] }).success).toBe(false);
});
it('rechaza un resumen de más de 200 caracteres', () => {
  expect(esquema.safeParse({ ...valido, resumen: 'x'.repeat(201) }).success).toBe(false);
});
it('rechaza un artículo sin fecha', () => {
  const { fecha, ...sinFecha } = valido;
  expect(esquema.safeParse(sinFecha).success).toBe(false);
});
it('ETIQUETAS coincide con la spec', () => {
  expect(ETIQUETAS).toEqual(['apis','open-banking','ia','arquitectura','banca-digital','liderazgo','desarrollo']);
});
```

Importar `zod` desde el mismo paquete que usa Astro (`astro/zod` en `esquema.ts`; en la prueba, el mismo import).

- [ ] **Step 2:** Ejecutar `npm test`. Resultado esperado: FAIL (no existe `esquema.ts`).

- [ ] **Step 3:** Implementar `esquema.ts` y `content.config.ts`.

- [ ] **Step 4:** Crear el primer artículo `bienvenida/index.md`:
  - `titulo: "Bienvenida: APIs, IA & banca digital"` (con `&` y `:` a propósito; ver Review Focus 3)
  - `resumen`: una oración sobre qué se va a publicar en el sitio
  - `fecha: 2026-10-27`
  - `etiquetas: [banca-digital, ia]`
  - sin `imagen`
  - cuerpo de 3 párrafos breves: quién escribe, sobre qué temas y con qué frecuencia (semanal), más un bloque de código TypeScript corto para verificar el resaltado.

- [ ] **Step 5:** Ejecutar `npm test && npm run check && npm run build`. Resultado esperado: todo pasa. Luego cambiar temporalmente `etiquetas` a `[IA]`, ejecutar `npm run build` y confirmar que falla mencionando `etiquetas`. Revertir el cambio.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: esquema de artículos validado y primer artículo"
```

---

### Task 3: Regla de publicación y formato de fechas

**Files:**
- Create: `src/lib/publicacion.ts`, `src/lib/fechas.ts`, `src/lib/articulos.ts`
- Test: `tests/unit/publicacion.test.ts`, `tests/unit/fechas.test.ts`

**Interfaces:**
- Consumes: `Etiqueta` y la colección `articulos` (Tarea 2).
- Produces:
  - `src/lib/publicacion.ts` (sin imports de `astro:*`):
    - `interface ArticuloBase { id: string; data: { fecha: Date; borrador: boolean; etiquetas: readonly string[] } }`
    - `filtrarPublicados<T extends ArticuloBase>(articulos: readonly T[], ahora: Date): T[]`: excluye borradores y `fecha > ahora`, ordena por `fecha` descendente y, en caso de empate, por `id` ascendente.
    - `etiquetasConArticulos<T extends ArticuloBase>(publicados: readonly T[]): string[]`: etiquetas únicas que tienen al menos un artículo, en el orden de `ETIQUETAS`.
  - `src/lib/fechas.ts`: `formatearFecha(fecha: Date): string` usando `Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })`.
  - `src/lib/articulos.ts`: `obtenerPublicados(): Promise<CollectionEntry<'articulos'>[]>` = `filtrarPublicados(await getCollection('articulos'), new Date())`. No se prueba en unidad (es solo pegamento); la cubren las pruebas de `dist/`.

- [ ] **Step 1: Escribir las pruebas que fallan**

```ts
// tests/unit/publicacion.test.ts
const a = (id: string, fecha: string, borrador = false, etiquetas = ['ia']) =>
  ({ id, data: { fecha: new Date(fecha), borrador, etiquetas } });
const ahora = new Date('2026-11-03T09:00:00Z');

it('excluye borradores', () => {
  expect(filtrarPublicados([a('x', '2026-01-01', true)], ahora)).toEqual([]);
});
it('excluye fechas futuras', () => {
  expect(filtrarPublicados([a('x', '2026-11-04')], ahora)).toEqual([]);
});
it('incluye un artículo con fecha de hoy cuando el cron corre a las 09:00 UTC', () => {
  expect(filtrarPublicados([a('x', '2026-11-03')], ahora).map(x => x.id)).toEqual(['x']);
});
it('ordena del más nuevo al más viejo y desempata por id', () => {
  const r = filtrarPublicados([a('b', '2026-10-01'), a('c', '2026-10-20'), a('a', '2026-10-01')], ahora);
  expect(r.map(x => x.id)).toEqual(['c', 'a', 'b']);
});
it('no modifica el arreglo original', () => {
  const lista = [a('b', '2026-10-01'), a('c', '2026-10-20')];
  filtrarPublicados(lista, ahora);
  expect(lista.map(x => x.id)).toEqual(['b', 'c']);
});
it('etiquetasConArticulos devuelve únicas y en el orden de ETIQUETAS', () => {
  const r = etiquetasConArticulos([a('x', '2026-01-01', false, ['ia', 'apis']), a('y', '2026-01-02', false, ['apis'])]);
  expect(r).toEqual(['apis', 'ia']);
});
```

```ts
// tests/unit/fechas.test.ts
it('formatea en es-AR sin correrse de día por la zona horaria', () => {
  expect(formatearFecha(new Date('2026-11-03'))).toBe('3 de noviembre de 2026');
});
```

- [ ] **Step 2:** Ejecutar `npm test`. Resultado esperado: FAIL (no existen los módulos).

- [ ] **Step 3:** Implementar `publicacion.ts`, `fechas.ts` y `articulos.ts`.

- [ ] **Step 4:** Ejecutar `npm test && npm run check`. Resultado esperado: PASS y 0 errores.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: regla de publicación por fecha y borrador, y formato de fechas"
```

---

### Task 4: Layout base, header, footer, SEO y analítica

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `scripts/generar-og.mjs`, `public/og-default.png`, `tests/dist/helpers.ts`, `tests/dist/base.test.ts`
- Modify: `src/pages/index.astro` (usa `Base`)

**Interfaces:**
- Consumes: `SITIO` (Tarea 1).
- Produces:
  - `Base.astro`, con props `{ titulo?: string; descripcion?: string; imagen?: string; tipo?: 'website' | 'article'; fechaPublicacion?: Date }`.
    - `<title>`: `${titulo} | Claudio Frigeri` si hay `titulo`; si no, `Claudio Frigeri | ${SITIO.lema}`.
    - Meta: `description` (por defecto `SITIO.descripcion`), `link rel=canonical` (`new URL(Astro.url.pathname, SITIO.url)`), `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (URL absoluta; por defecto `/og-default.png`), `og:locale=es_AR`, `twitter:card=summary_large_image`, `article:published_time` si hay `fechaPublicacion`, y `<link rel="alternate" type="application/rss+xml" href="/rss.xml">`.
    - Script de GoatCounter según las Global Constraints.
    - `<meta name="google-site-verification">` solo si `SITIO.googleVerificacion` no está vacío. Agregar ese campo a `SITIO` leyendo `PUBLIC_GOOGLE_VERIFICACION ?? ''`, para dar de alta Search Console.
    - Importa `main.scss`, la fuente Inter y el bundle JS de Bootstrap (`bootstrap/dist/js/bootstrap.bundle.min.js`) para el colapso del navbar.
    - `<slot />` dentro de `<main>`.
  - `Header.astro`: navbar con marca "Claudio Frigeri" y enlaces Inicio `/`, Artículos `/articulos`, Sobre mí `/sobre-mi` y Contacto `/contacto`. Marca el enlace activo con `aria-current="page"`.
  - `Footer.astro`: enlaces a email (`mailto:`), LinkedIn, GitHub y RSS (`/rss.xml`), más "© {año} Claudio Frigeri".
  - `tests/dist/helpers.ts`: `leerHtml(ruta: string): HTMLElement` (parsea `dist/<ruta>` con `node-html-parser`) y `existeEnDist(ruta: string): boolean`.

- [ ] **Step 1:** Escribir `scripts/generar-og.mjs` con `sharp` (ya viene con Astro): PNG de 1200×630, fondo `#1F4E79`, texto blanco "Claudio Frigeri" y debajo "Banca digital · APIs financieras · IA aplicada". Ejecutarlo una vez y commitear `public/og-default.png`.

- [ ] **Step 2: Escribir las pruebas que fallan**

```ts
// tests/dist/base.test.ts
const html = leerHtml('index.html');
it('tiene lang es y título por defecto', () => {
  expect(html.querySelector('html')?.getAttribute('lang')).toBe('es');
  expect(html.querySelector('title')?.text).toBe('Claudio Frigeri | Banca digital · APIs financieras · IA aplicada');
});
it('og:image es absoluta y por defecto', () => {
  expect(html.querySelector('meta[property="og:image"]')?.getAttribute('content'))
    .toBe('https://cfrigeri.github.io/og-default.png');
});
it('canonical apunta a la home', () => {
  expect(html.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://cfrigeri.github.io/');
});
it('incluye GoatCounter con el código de prueba en el build de producción', () => {
  expect(html.querySelector('script[data-goatcounter]')?.getAttribute('data-goatcounter'))
    .toBe('https://prueba.goatcounter.com/count');
});
it('el navbar tiene los 4 enlaces y el footer los de contacto', () => {
  const navs = html.querySelectorAll('header nav a.nav-link').map(a => a.getAttribute('href'));
  expect(navs).toEqual(['/', '/articulos', '/sobre-mi', '/contacto']);
  const pie = html.querySelector('footer')!.innerHTML;
  for (const e of ['mailto:cfrigeri@gmail.com', 'https://www.linkedin.com/in/cfrigeri', 'https://github.com/cfrigeri', '/rss.xml']) {
    expect(pie).toContain(e);
  }
});
```

- [ ] **Step 3:** Ejecutar `npm run test:dist`. Resultado esperado: FAIL.

- [ ] **Step 4:** Implementar `Base.astro`, `Header.astro` y `Footer.astro`, y hacer que `index.astro` use `Base`.

- [ ] **Step 5:** Ejecutar `npm run test:dist && npm run check`. Resultado esperado: PASS. Luego ejecutar `npm run dev`, abrir el sitio y confirmar que el HTML **no** contiene `data-goatcounter` y que el menú colapsa en un ancho de celular.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: layout base con SEO, Open Graph, navegación y GoatCounter"
```

---

### Task 5: Listado de artículos, página de artículo y etiquetas

**Files:**
- Create: `src/layouts/Articulo.astro`, `src/components/TarjetaArticulo.astro`, `src/components/Etiquetas.astro`, `src/components/BioAutor.astro`, `src/pages/articulos/index.astro`, `src/pages/articulos/[slug].astro`, `src/pages/articulos/tag/[tag].astro`
- Test: `tests/dist/articulos.test.ts`

**Interfaces:**
- Consumes: `obtenerPublicados()`, `etiquetasConArticulos()` y `formatearFecha()` (Tarea 3); `Base` (Tarea 4).
- Produces:
  - `TarjetaArticulo.astro`, props `{ articulo: CollectionEntry<'articulos'> }`: título enlazado a `/articulos/<id>`, fecha formateada en `<time datetime=ISO>`, resumen y `Etiquetas`.
  - `Etiquetas.astro`, props `{ etiquetas: readonly string[] }`: badges que enlazan a `/articulos/tag/<etiqueta>`.
  - `BioAutor.astro`, sin props: foto o iniciales "CF", nombre, `bioCorta` y enlace "Escribime" a `/contacto`.
  - `Articulo.astro`, props `{ articulo: CollectionEntry<'articulos'> }`: usa `Base` con `tipo='article'`, `titulo`, `descripcion=resumen`, `fechaPublicacion` e `imagen` (URL absoluta de la imagen procesada con `getImage()` si existe; si no, la de por defecto). Columna de lectura `max-width: 70ch`. `BioAutor` va al final.
  - `[slug].astro`: `getStaticPaths` sobre `obtenerPublicados()`, con `params.slug = id`; renderiza con `render()`.
  - `tag/[tag].astro`: `getStaticPaths` sobre `etiquetasConArticulos(publicados)`, con título "Artículos sobre <etiqueta>".
  - `articulos/index.astro`: título "Artículos" y todas las `TarjetaArticulo` en orden.

- [ ] **Step 1: Escribir las pruebas que fallan**

```ts
// tests/dist/articulos.test.ts
const articulo = leerHtml('articulos/bienvenida/index.html');
it('la página del artículo escapa bien el título', () => {
  expect(articulo.querySelector('title')?.text).toBe('Bienvenida: APIs, IA & banca digital | Claudio Frigeri');
  expect(articulo.querySelector('meta[property="og:title"]')?.getAttribute('content'))
    .toBe('Bienvenida: APIs, IA & banca digital');
});
it('un artículo sin imagen usa la og:image por defecto', () => {
  expect(articulo.querySelector('meta[property="og:image"]')?.getAttribute('content'))
    .toBe('https://cfrigeri.github.io/og-default.png');
  expect(articulo.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('article');
});
it('muestra la fecha formateada y la bio con enlace a contacto', () => {
  expect(articulo.querySelector('time')?.text).toBe('27 de octubre de 2026');
  expect(articulo.querySelector('a[href="/contacto"]')).not.toBeNull();
});
it('resalta el bloque de código', () => {
  expect(articulo.querySelector('pre.astro-code')).not.toBeNull();
});
it('el listado enlaza al artículo', () => {
  expect(leerHtml('articulos/index.html').querySelector('a[href="/articulos/bienvenida"]')).not.toBeNull();
});
it('genera páginas solo para etiquetas con artículos', () => {
  expect(existeEnDist('articulos/tag/ia/index.html')).toBe(true);
  expect(existeEnDist('articulos/tag/banca-digital/index.html')).toBe(true);
  expect(existeEnDist('articulos/tag/liderazgo/index.html')).toBe(false);
});
```

- [ ] **Step 2:** Ejecutar `npm run test:dist`. Resultado esperado: FAIL en las pruebas nuevas.

- [ ] **Step 3:** Implementar los componentes, el layout y las tres páginas.

- [ ] **Step 4:** Ejecutar `npm run test:dist && npm test && npm run check`. Resultado esperado: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: listado de artículos, página de artículo y filtro por etiqueta"
```

---

### Task 6: Inicio, Sobre mí y 404

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/sobre-mi.astro`, `src/pages/404.astro`
- Test: `tests/dist/paginas.test.ts`

**Interfaces:**
- Consumes: `obtenerPublicados()`, `TarjetaArticulo`, `Base` y `SITIO`.

**Contenido fijo (del perfil profesional adjunto en la conversación):**
- **Inicio:** `<h1>` "Claudio Frigeri" y subtítulo `SITIO.lema`. Debajo, una oración: líder técnico con más de 13 años transformando la banca digital. Sección "Últimos artículos" con hasta 4 `TarjetaArticulo` y enlace "Ver todos" a `/articulos`. Si no hay ninguno, mostrar "Pronto vas a encontrar acá los primeros artículos." Sección "En qué puedo ayudarte" con 3 ítems breves (diseño e integración de APIs financieras, transformación digital de canales bancarios, adopción de IA aplicada en procesos) y botón "Conversemos" a `/contacto`.
- **Sobre mí:** título "Sobre mí". Resumen en 1 párrafo. "Trayectoria": importante banco argentino con fuerte presencia tecnológica (2013 – hoy), con 4 logros (modernización del homebanking a cloud, APIs integradas con importantes actores del ecosistema fintech, un framework interno de desarrollo y el liderazgo de canales electrónicos); después, una línea por cada experiencia previa descrita por industria, sin nombres de empresas. "Formación": Analista de sistemas (2006–2008). "Certificaciones": las 4 de la spec. "Consultoría": 1 párrafo con enlace a `/contacto`.
- **404:** título "Página no encontrada", una oración y enlaces a `/` y `/articulos`.

- [ ] **Step 1: Escribir las pruebas que fallan**

```ts
// tests/dist/paginas.test.ts
it('inicio lista el artículo y tiene el CTA a contacto', () => {
  const h = leerHtml('index.html');
  expect(h.querySelector('a[href="/articulos/bienvenida"]')).not.toBeNull();
  expect(h.querySelector('a[href="/contacto"].btn')).not.toBeNull();
});
it('sobre mí incluye trayectoria y las 4 certificaciones', () => {
  const t = leerHtml('sobre-mi/index.html').text;
  for (const c of ['importante banco argentino con fuerte presencia tecnológica', 'AI Fluency Framework & Foundations',
    'Introduction to Model Context Protocol', 'Optimize Agent Behavior', 'Claude Code in Action']) {
    expect(t).toContain(c);
  }
});
it('existe la 404 con enlace a artículos', () => {
  expect(leerHtml('404.html').querySelector('a[href="/articulos"]')).not.toBeNull();
});
```

- [ ] **Step 2:** Ejecutar `npm run test:dist`. Resultado esperado: FAIL.

- [ ] **Step 3:** Implementar las tres páginas.

- [ ] **Step 4:** Ejecutar `npm run test:dist && npm run check`. Resultado esperado: PASS. Revisar con `npm run dev` en ancho de celular y de escritorio.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: páginas de inicio, sobre mí y 404"
```

---

### Task 7: Contacto y formulario

**Files:**
- Create: `src/lib/contacto.ts`, `src/components/FormContacto.astro`, `src/pages/contacto.astro`
- Test: `tests/unit/contacto.test.ts`, `tests/dist/contacto.test.ts`

**Interfaces:**
- Consumes: `SITIO` y `Base`.
- Produces:
  - `src/lib/contacto.ts`:
    - `type ResultadoEnvio = 'ok' | 'error' | 'spam'`
    - `enviarContacto(datos: FormData, endpoint: string, fetchFn: typeof fetch = fetch): Promise<ResultadoEnvio>`: si `_gotcha` no está vacío, devuelve `'spam'` sin llamar a `fetchFn`. Si no, hace `POST` con `body: datos` y `headers: { Accept: 'application/json' }`; devuelve `'ok'` si `res.ok`, `'error'` si no o si `fetchFn` lanza una excepción.
  - `FormContacto.astro`: `<form method="POST" action="https://formspree.io/f/${SITIO.formspreeId}" novalidate>` con `nombre` (text, required), `email` (email, required), `mensaje` (textarea, required, 5 filas), honeypot `_gotcha` oculto (`class="d-none"`, `tabindex="-1"`, `autocomplete="off"`) y botón "Enviar". Un `<script>` del componente:
    1. intercepta `submit`; si `!form.checkValidity()`, agrega `was-validated` y corta;
    2. deshabilita el botón y cambia su texto a "Enviando…";
    3. llama a `enviarContacto`;
    4. `'ok'` o `'spam'`: oculta el formulario, muestra la alerta de éxito "¡Gracias! Te respondo a la brevedad." y, si es `'ok'`, ejecuta `window.goatcounter?.count({ path: 'contacto-enviado', title: 'Contacto enviado', event: true })`;
    5. `'error'`: **no** limpia los campos, muestra la alerta de error "No se pudo enviar el mensaje. Probá de nuevo o escribime a cfrigeri@gmail.com." (con `mailto:`) y vuelve a habilitar el botón.
  - Si `SITIO.formspreeId` está vacío, el componente no renderiza el formulario (solo quedan los enlaces de la página).
  - `contacto.astro`: título "Contacto", una oración de invitación, `FormContacto` y una lista con email, LinkedIn y GitHub.

- [ ] **Step 1: Escribir las pruebas que fallan**

```ts
// tests/unit/contacto.test.ts
const datos = (gotcha = '') => {
  const f = new FormData();
  f.set('nombre', 'Ana'); f.set('email', 'ana@x.com'); f.set('mensaje', 'Hola'); f.set('_gotcha', gotcha);
  return f;
};
const URL_F = 'https://formspree.io/f/prueba123';

it('devuelve ok y envía POST con Accept JSON', async () => {
  const fetchFn = vi.fn().mockResolvedValue({ ok: true });
  expect(await enviarContacto(datos(), URL_F, fetchFn)).toBe('ok');
  expect(fetchFn).toHaveBeenCalledWith(URL_F, expect.objectContaining({
    method: 'POST', headers: { Accept: 'application/json' } }));
});
it('devuelve error si la respuesta no es ok', async () => {
  expect(await enviarContacto(datos(), URL_F, vi.fn().mockResolvedValue({ ok: false }))).toBe('error');
});
it('devuelve error si no hay red', async () => {
  expect(await enviarContacto(datos(), URL_F, vi.fn().mockRejectedValue(new TypeError('red')))).toBe('error');
});
it('no envía si el honeypot está completo', async () => {
  const fetchFn = vi.fn();
  expect(await enviarContacto(datos('bot'), URL_F, fetchFn)).toBe('spam');
  expect(fetchFn).not.toHaveBeenCalled();
});
```

```ts
// tests/dist/contacto.test.ts
const h = leerHtml('contacto/index.html');
it('el formulario apunta a Formspree con el ID de prueba', () => {
  expect(h.querySelector('form')?.getAttribute('action')).toBe('https://formspree.io/f/prueba123');
});
it('tiene los campos requeridos y el honeypot oculto', () => {
  for (const n of ['nombre', 'email', 'mensaje']) {
    expect(h.querySelector(`[name="${n}"]`)?.hasAttribute('required')).toBe(true);
  }
  expect(h.querySelector('[name="_gotcha"]')?.getAttribute('tabindex')).toBe('-1');
});
it('el texto de error ofrece el email como alternativa', () => {
  expect(h.innerHTML).toContain('mailto:cfrigeri@gmail.com');
});
```

- [ ] **Step 2:** Ejecutar `npm test && npm run test:dist`. Resultado esperado: FAIL.

- [ ] **Step 3:** Implementar `contacto.ts`, `FormContacto.astro` y `contacto.astro`.

- [ ] **Step 4:** Ejecutar `npm test && npm run test:dist && npm run check`. Resultado esperado: PASS.

- [ ] **Step 5: Verificación manual en el navegador** con `npm run build:test && npx astro preview`, en `/contacto`:
  - enviar vacío → se ven los mensajes de validación de Bootstrap y no hay request;
  - completar y hacer doble clic rápido en "Enviar" → la pestaña Network muestra **un solo** POST y el botón dice "Enviando…" deshabilitado (Review Focus 5);
  - con el ID de prueba Formspree responde error → aparece la alerta de error, los campos conservan el texto y el botón se rehabilita.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: página de contacto con formulario Formspree, antispam y evento de analítica"
```

---

### Task 8: RSS, sitemap, robots y verificación de enlaces internos

**Files:**
- Create: `src/pages/rss.xml.ts`, `public/robots.txt`
- Test: `tests/dist/feeds.test.ts`, `tests/dist/enlaces.test.ts`

**Interfaces:**
- Consumes: `obtenerPublicados()` y `SITIO`.
- Produces:
  - `rss.xml.ts`: con `@astrojs/rss`; `title: SITIO.titulo`, `description: SITIO.descripcion`, `site: SITIO.url` y un ítem por artículo publicado (`title`, `description=resumen`, `pubDate=fecha`, `link=/articulos/<id>/`, `categories=etiquetas`).
  - `robots.txt`: `User-agent: *`, `Allow: /` y `Sitemap: https://cfrigeri.github.io/sitemap-index.xml`.

- [ ] **Step 1: Escribir las pruebas que fallan**

```ts
// tests/dist/feeds.test.ts
const rss = readFileSync('dist/rss.xml', 'utf8');
it('el RSS contiene el artículo con & escapado', () => {
  expect(rss).toContain('Bienvenida: APIs, IA &amp; banca digital');
  expect(rss).toContain('https://cfrigeri.github.io/articulos/bienvenida/');
});
it('existen sitemap y robots que lo referencian', () => {
  expect(existeEnDist('sitemap-index.xml')).toBe(true);
  expect(readFileSync('dist/robots.txt', 'utf8')).toContain('Sitemap: https://cfrigeri.github.io/sitemap-index.xml');
});
```

```ts
// tests/dist/enlaces.test.ts
// Recorre todos los .html de dist/, junta cada href que empieza con "/" (sin "//"),
// le quita el #fragmento y el ?query, y verifica que exista:
//   ruta con extensión → dist/<ruta>;  ruta sin extensión → dist/<ruta>/index.html
it('no hay enlaces internos rotos', () => {
  expect(enlacesRotos()).toEqual([]);   // lista de "pagina.html -> /href" rotos
});
```

`enlacesRotos(): string[]` se implementa en `tests/dist/helpers.ts`.

- [ ] **Step 2:** Ejecutar `npm run test:dist`. Resultado esperado: FAIL en `feeds` (no hay RSS ni robots). `enlaces` puede fallar por `/rss.xml`.

- [ ] **Step 3:** Implementar `rss.xml.ts`, `robots.txt` y `enlacesRotos()`.

- [ ] **Step 4:** Ejecutar `npm run test:dist`. Resultado esperado: PASS. Para confirmar que la prueba de enlaces detecta errores, agregar temporalmente `<a href="/no-existe">` en `404.astro`, comprobar que `enlaces.test.ts` falla mostrando `/no-existe` y revertir.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: feed RSS, sitemap, robots y verificación de enlaces internos"
```

---

### Task 9: Publicación automática y documentación

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`

**Interfaces:**
- Consumes: los scripts `check`, `test`, `test:dist` y `build`; las variables de repositorio `PUBLIC_FORMSPREE_ID` y `PUBLIC_GOATCOUNTER_CODIGO`.

**Workflow `deploy.yml`:**
- Disparadores: `push` a `main`, `schedule` con cron `0 9 * * *` y `workflow_dispatch`.
- Permisos: `contents: read`, `pages: write` e `id-token: write`. `concurrency: { group: pages, cancel-in-progress: false }`.
- Job `verificar` (ubuntu-latest): checkout, setup-node (`lts/*`, cache npm), `npm ci`, `npm run check`, `npm test` y `npm run test:dist`.
- Job `publicar` (`needs: verificar`): checkout, setup-node, `npm ci`, `npm run build` con `env` `PUBLIC_FORMSPREE_ID: ${{ vars.PUBLIC_FORMSPREE_ID }}` y `PUBLIC_GOATCOUNTER_CODIGO: ${{ vars.PUBLIC_GOATCOUNTER_CODIGO }}` y `PUBLIC_GOOGLE_VERIFICACION: ${{ vars.PUBLIC_GOOGLE_VERIFICACION }}`; después `actions/configure-pages`, `actions/upload-pages-artifact` (`path: dist`) y `actions/deploy-pages`, en el environment `github-pages`.
- Usar la última versión mayor publicada de cada action oficial (verificarla en su repositorio al implementar).

**`README.md`** (en español), con estas secciones:
1. **Qué es:** una línea y enlace a la spec.
2. **Requisitos:** Node LTS.
3. **Desarrollo:** `npm install`, `npm run dev`.
4. **Publicar un artículo:** crear `src/content/articulos/<slug>/index.md` con el frontmatter de ejemplo (todos los campos), las etiquetas permitidas, cómo funcionan `borrador` y la fecha futura (se publica sola a las 06:00 de Buenos Aires del día indicado), y commit + push.
5. **Pruebas:** `npm test`, `npm run test:dist`, `npm run check`.
6. **Configuración inicial (una vez):** crear el repo `cfrigeri.github.io`; en *Settings → Pages* elegir la fuente "GitHub Actions"; crear el formulario en Formspree y la cuenta de GoatCounter; cargar sus IDs como *variables* del repositorio (`PUBLIC_FORMSPREE_ID`, `PUBLIC_GOATCOUNTER_CODIGO`).
7. **Checklist de lanzamiento:** los 5 puntos de la sección 11 de la spec.
8. **Dominio propio (futuro):** configurarlo en *Settings → Pages* y actualizar `SITIO.url`.

- [ ] **Step 1:** Escribir `deploy.yml`.

- [ ] **Step 2:** Validar la sintaxis con `npx --yes action-validator .github/workflows/deploy.yml` (o `actionlint` si está disponible). Resultado esperado: sin errores.

- [ ] **Step 3:** Escribir `README.md`.

- [ ] **Step 4:** Verificación final completa: `npm ci && npm run check && npm test && npm run test:dist && npm run build`. Resultado esperado: todo en verde.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "ci: publicación en GitHub Pages en cada push y diaria; docs: README"
```

- [ ] **Step 6 (con Claudio):** crear el repo en GitHub, hacer push, cargar las variables y confirmar que la Action publica en `https://cfrigeri.github.io`. Después, recorrer el checklist de lanzamiento del README.
