# Sitio web personal de Claudio Frigeri — Especificación de diseño

- **Fecha:** 2026-10-27
- **Estado:** pendiente de revisión
- **Autor:** Claudio Frigeri

## 1. Propósito

Sitio personal para publicar contenido y conocimiento profesional sobre banca digital, APIs financieras, Open Banking e IA aplicada, con una forma simple de contacto.

### Objetivos, en orden de prioridad

1. **Construir autoridad y marca personal** como referente en banca digital e IA aplicada.
2. **Enseñar y compartir** conocimiento práctico con la comunidad.
3. **Captar clientes de consultoría**, como invitación y no como venta.

### Criterios de éxito

- Publicar un artículo nuevo requiere solo escribir Markdown, hacer commit y push.
- Se sostiene un ritmo de un artículo por semana, con posibilidad de programar publicaciones.
- Un enlace compartido en LinkedIn muestra una tarjeta con título, resumen e imagen.
- Una persona que lee un artículo puede contactar a Claudio sin salir del sitio.
- Se puede medir qué artículos se leen, de dónde llega el tráfico y cuántos contactos genera.

## 2. Alcance

### Incluido

- Cinco páginas: Inicio, Artículos (con filtro por etiqueta), Artículo, Sobre mí y Contacto.
- Página 404, feed RSS y sitemap.
- Formulario de contacto (Formspree) y enlaces a email, LinkedIn y GitHub.
- Analítica con GoatCounter, incluido el evento de envío del formulario.
- Publicación programada por fecha y soporte de borradores.
- Etiquetas Open Graph y metadatos SEO por página.

### Fuera de alcance (por ahora)

Buscador, comentarios, newsletter, modo oscuro, versión en inglés, página propia de consultoría y dominio propio. Todo puede agregarse después sin rehacer la base.

## 3. Restricciones y decisiones

| Tema | Decisión | Motivo |
|------|----------|--------|
| Idioma | Solo español | Audiencia principal: sector financiero de Argentina y LATAM |
| Generador | Astro (TypeScript) | Stack conocido, valida el contenido, HTML estático rápido |
| Estilos | Bootstrap vía npm + SCSS | Framework que Claudio ya domina, personalizado por variables |
| Contenido | Markdown en el repo | Flujo con Git, sin CMS ni base de datos |
| Hosting | GitHub Pages | Gratis, publica con cada push |
| Dominio | Subdominio `<usuario>.github.io` | Dominio propio más adelante, sin cambios de código |
| Formulario | Formspree (plan gratuito) | GitHub Pages no ejecuta backend |
| Analítica | GoatCounter | Gratis, sin cookies, no requiere banner |
| Mantenimiento | Claudio | El código debe ser simple y estar documentado |

## 4. Páginas

### Inicio (`/`)
- Encabezado con nombre y propuesta de valor en una línea (banca digital, APIs financieras, IA aplicada).
- Los 4 artículos publicados más recientes.
- Bloque breve "En qué puedo ayudarte" con enlace a Contacto.

### Artículos (`/articulos`)
- Listado de todos los artículos publicados, del más nuevo al más viejo: título, fecha, resumen y etiquetas.
- Listado filtrado por etiqueta en `/articulos/tag/<etiqueta>`.

### Artículo (`/articulos/<slug>`)
- Título, fecha, etiquetas e imagen de portada opcional.
- Cuerpo con tipografía de lectura, ancho de columna limitado y resaltado de código (Shiki).
- Al final, una bio corta del autor con enlace a Contacto.

### Sobre mí (`/sobre-mi`)
- Trayectoria resumida a partir del perfil profesional: los logros en banca primero y después el recorrido previo, sin nombres de empresas.
- Certificaciones: AI Fluency Framework & Foundations, Introduction to Model Context Protocol, Optimize Agent Behavior y Claude Code in Action.
- Un párrafo sobre los servicios de consultoría.

### Contacto (`/contacto`)
- Formulario (ver sección 8) y enlaces a email, LinkedIn y GitHub.

### Comunes a todas las páginas
- Header con navbar de Bootstrap, colapsable en celular.
- Footer con enlaces de contacto y RSS.
- Página 404 con enlaces a Inicio y Artículos.

## 5. Modelo de contenido

Cada artículo es una carpeta dentro de `src/content/articulos/`. El nombre de la carpeta define el slug de la URL. Las imágenes se guardan junto al `index.md` y Astro las optimiza al compilar.

```
src/content/articulos/
  apis-bancarias-lecciones/
    index.md
    portada.png
```

### Frontmatter (validado con Zod en `content.config.ts`)

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|-------|
| `titulo` | string | sí | |
| `resumen` | string | sí | Para listados, SEO y Open Graph. Máximo 200 caracteres |
| `fecha` | date | sí | Fecha de publicación |
| `etiquetas` | lista de valores permitidos | sí | Al menos una |
| `borrador` | boolean | no | Por defecto `false` |
| `imagen` | imagen local | no | Portada y Open Graph |

### Etiquetas permitidas (lista inicial, editable)

`apis`, `open-banking`, `ia`, `arquitectura`, `banca-digital`, `liderazgo`, `desarrollo`

Una etiqueta fuera de la lista hace fallar el build.

### Regla de publicación

Un artículo se considera publicado si `borrador` es `false` **y** `fecha` es igual o anterior al momento del build. Esta regla vive solo en `src/lib/articulos.ts`, y todas las páginas, etiquetas y el RSS la usan.

## 6. Flujo de publicación

1. Crear la carpeta del artículo y escribir en Markdown.
2. Revisar en local con `npm run dev`.
3. Commit y push a `main`.
4. La GitHub Action compila y publica en GitHub Pages.

La Action se ejecuta:
- en cada push a `main`;
- una vez por día (cron), para publicar los artículos programados con fecha futura;
- manualmente (`workflow_dispatch`).

## 7. Estructura del código

```
├── src/
│   ├── content.config.ts      esquema de artículos y etiquetas permitidas
│   ├── content/articulos/     artículos
│   ├── config/sitio.ts        nombre, bio, enlaces, IDs de Formspree y GoatCounter, URL base
│   ├── lib/articulos.ts       obtener artículos publicados (filtro + orden)
│   ├── layouts/
│   │   ├── Base.astro         <head>, SEO, Open Graph, analítica, header, footer
│   │   └── Articulo.astro     plantilla de lectura + BioAutor
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── TarjetaArticulo.astro
│   │   ├── Etiquetas.astro
│   │   ├── BioAutor.astro
│   │   └── FormContacto.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── articulos/index.astro
│   │   ├── articulos/[slug].astro
│   │   ├── articulos/tag/[tag].astro
│   │   ├── sobre-mi.astro
│   │   ├── contacto.astro
│   │   ├── 404.astro
│   │   └── rss.xml.ts
│   └── styles/main.scss       variables de Bootstrap e importación selectiva de módulos
├── public/                    favicon, robots.txt, foto de perfil
├── tests/articulos.test.ts    pruebas de la regla de publicación
└── .github/workflows/deploy.yml
```

### Principios

- **Un solo lugar para lo configurable:** `config/sitio.ts`. Cambiar el dominio o el servicio de formulario implica tocar un archivo.
- **Un solo lugar para decidir qué está publicado:** `lib/articulos.ts`, una función pura que recibe la lista y la fecha actual, para poder probarla.
- **Componentes pequeños** con una única responsabilidad y propiedades tipadas.

### Estilo visual

- Sobrio y legible, con fondo claro.
- Un color de acento que transmita confianza: azul `#1F4E79` por defecto, definido como variable `$primary` en `main.scss`, para reemplazarlo fácilmente por el color de la marca personal.
- Tipografía cómoda para textos largos y ancho de lectura de unos 70 caracteres.
- Bootstrap personalizado por variables SCSS, sin aspecto de plantilla genérica.

## 8. Formulario de contacto

- **Servicio:** Formspree, endpoint configurado en `config/sitio.ts`.
- **Campos:** nombre, email y mensaje, todos obligatorios, con validación HTML5 y estilos de validación de Bootstrap.
- **Antispam:** campo honeypot oculto más el filtro de Formspree. Sin captcha.
- **Mejora progresiva:**
  - Con JavaScript: envío con `fetch`, y el mensaje de éxito aparece en la misma página.
  - Sin JavaScript: envío tradicional del formulario a Formspree.
- **Medición:** si el envío es exitoso, se registra el evento `contacto-enviado` en GoatCounter.

## 9. Analítica y SEO

- **GoatCounter:** script en `Base.astro`, solo en el build de producción (no en `npm run dev`). Código de sitio en `config/sitio.ts`.
- **Google Search Console:** se da de alta en el lanzamiento y se verifica con una meta etiqueta configurable.
- **Por página:** `<title>`, meta descripción, URL canónica y etiquetas Open Graph y Twitter Card. En los artículos se usan el título, el resumen y la portada (o una imagen por defecto del sitio).
- **Sitemap** (`@astrojs/sitemap`) y `robots.txt` que lo referencia.
- **RSS** (`@astrojs/rss`) con los artículos publicados.

## 10. Manejo de errores

| Situación | Comportamiento |
|-----------|----------------|
| Falla el envío del formulario o no hay conexión | El texto se conserva y se muestra un aviso con el email como alternativa |
| Frontmatter inválido o etiqueta no permitida | Falla el build; queda online la versión anterior y GitHub avisa por mail |
| Enlace interno roto | Falla la verificación en la Action |
| URL inexistente | Página 404 propia |

## 11. Pruebas y verificación

- **`astro check`** en cada build: tipos y componentes.
- **Vitest** sobre `lib/articulos.ts`: excluye borradores, excluye fechas futuras, incluye la fecha de hoy y ordena de más nuevo a más viejo.
- **Verificación de enlaces internos** sobre el sitio compilado, dentro de la Action.
- **Checklist de lanzamiento (manual, una vez):**
  - Enviar el formulario de punta a punta y confirmar que llega el mail.
  - Revisar la tarjeta con el Post Inspector de LinkedIn.
  - Revisar el sitio en celular.
  - Confirmar que GoatCounter registra visitas y el evento del formulario.
  - Dar de alta Google Search Console y enviar el sitemap.

## 12. Configuración externa necesaria

Lo hace Claudio con sus cuentas:

1. Repositorio en GitHub, con GitHub Pages configurado para publicar desde GitHub Actions.
2. Cuenta en Formspree y un formulario creado (se obtiene el ID del endpoint).
3. Cuenta en GoatCounter con un código de sitio.
4. Google Search Console (en el lanzamiento).

## 13. Evolución prevista

- **Dominio propio:** se configura el dominio personalizado en GitHub Pages y se actualiza la URL en `config/sitio.ts`.
- Funcionalidades fuera de alcance (buscador, newsletter, modo oscuro): se agregan como componentes nuevos sin modificar el modelo de contenido.

## 14. Revisión de diseño (2026-11-08)

Cambios acordados con Claudio después de validar la primera versión:

- **Posicionamiento:** consultor técnico independiente para empresas de cualquier industria. La experiencia en banca se presenta como fuente de rigor, no como único mercado.
- **Sin marcas:** no se nombran empleadores, clientes ni socios. Se usan descripciones como "un importante banco argentino con fuerte presencia tecnológica" e "importantes actores del ecosistema fintech". Lo verifica `tests/dist/marcas.test.ts`.
- **Visual:** tema oscuro (fondo `#0F1E26`, paneles `#162A35`, líneas `#2A4250`, texto `#E9EEF0`, dorado `#C9A55A`), titulares grandes en Archivo y texto en IBM Plex Sans, foto profesional en la portada.
- **Portada:** hero con foto, franja de trayectoria, sección "Servicios" con los tres pilares (integraciones críticas y APIs, eficiencia operativa con IA agéntica, liderazgo de arquitectura y refactor), sección "Cómo trabajo" con diagrama y cuatro pasos, artículo destacado y cierre con llamado a contacto. "Servicios" y "Cómo trabajo" son secciones de la portada, enlazadas desde el menú.

## 15. Segunda revisión de diseño (2026-11-10)

Reemplaza la dirección visual y de tono de la sección 14 (se mantiene la regla de contenido sin marcas).

- **Referencia:** el espíritu editorial y cercano de sitios personales de creadores técnicos, sin copiar su identidad.
- **Tono:** el sitio no se presenta como oferta de servicios. Muestra criterio y problemas resueltos; el contacto es una invitación a conversar. Sin la palabra "Servicios" ni "Contame tu proyecto" en la portada (lo verifica una prueba).
- **Visual:** fondo papel `#F6F4EE`, tinta `#0F1E26`, azul petróleo `#163A4A`, dorado `#D4AE5E`; bordes de 2px y sombras duras; foto en formato polaroid.
- **Portada:** titular "Pongo la IA a trabajar en sistemas reales. Y te cuento cómo.", fila de temas, "Problemas que me tocó destrabar" (tres casos, cada uno con una pregunta que invita a escribir), banda oscura "Cómo pienso la IA dentro de un sistema" con el diagrama y tres ideas, "Lo que voy escribiendo" y un bloque final "¿Estás peleando con algo parecido?".
- **Menú:** Artículos, Lo que resolví, Sobre mí, Escribime.
