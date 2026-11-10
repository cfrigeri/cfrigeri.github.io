# Sitio personal de Claudio Frigeri

Sitio personal de consultoría técnica independiente: integración de IA, APIs y arquitectura de software. Está hecho con Astro y Bootstrap (tema oscuro) y se publica en GitHub Pages. El diseño está en [la especificación](docs/superpowers/specs/2026-10-27-sitio-web-personal-design.md).

## Requisitos

- Node.js LTS (22 o superior)

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:4321
```

## Publicar un artículo

1. Creá una carpeta en `src/content/articulos/` con el slug de la URL, por ejemplo `apis-bancarias-lecciones`.
2. Dentro, creá `index.md`. Si tenés imágenes, ponelas al lado.

```markdown
---
titulo: "Lo que aprendí integrando APIs con fintechs"
resumen: "Una o dos líneas para el listado, Google y LinkedIn (máximo 200 caracteres)."
fecha: 2026-11-03
etiquetas: [apis, open-banking]
borrador: false          # opcional; con true nunca se publica
imagen: ./portada.png    # opcional; se usa como portada al compartir
---

El texto del artículo en Markdown.
```

3. Revisalo con `npm run dev` y después hacé commit y push a `main`.

**Etiquetas permitidas:** `apis`, `open-banking`, `ia`, `arquitectura`, `banca-digital`, `liderazgo`, `desarrollo`. Para agregar una nueva, editá `ETIQUETAS` en `src/content/esquema.ts`. Una etiqueta que no está en la lista hace fallar el build, a propósito.

**Programar artículos:** si la `fecha` es futura, el artículo queda en el repo pero no se muestra. La publicación automática corre todos los días a las 06:00 de Buenos Aires, así que el artículo aparece solo el día indicado. Podés dejar escritos los artículos de todo el mes.

## Pruebas

```bash
npm test           # pruebas unitarias (regla de publicación, fechas, esquema, formulario)
npm run test:dist  # compila el sitio y verifica el HTML generado (SEO, páginas, RSS, enlaces)
npm run check      # verificación de tipos de Astro y TypeScript
```

La GitHub Action ejecuta las tres antes de publicar. Si alguna falla, no se publica nada y queda online la versión anterior.

## Configuración inicial (una vez)

1. Crear en GitHub el repositorio **`cfrigeri.github.io`** (tiene que llamarse igual que tu usuario) y subir este proyecto a la rama `main`.
2. En el repo: *Settings → Pages → Build and deployment → Source:* **GitHub Actions**.
3. Crear un formulario en [Formspree](https://formspree.io) y copiar su ID (lo que sigue a `/f/` en el endpoint).
4. Crear una cuenta en [GoatCounter](https://www.goatcounter.com) y anotar el código del sitio (lo que va antes de `.goatcounter.com`).
5. En el repo: *Settings → Secrets and variables → Actions → Variables*, crear:
   - `PUBLIC_FORMSPREE_ID`
   - `PUBLIC_GOATCOUNTER_CODIGO`
   - `PUBLIC_GOOGLE_VERIFICACION` (opcional, el código de la meta etiqueta de Search Console)
6. En la pestaña *Actions*, ejecutar "Publicar sitio" (o hacer un push). Si falta alguna de las dos variables obligatorias, la publicación se detiene con un mensaje que lo indica.

Si tu usuario de GitHub no es `cfrigeri`, cambiá la URL en `src/config/sitio.ts`, en `astro.config.mjs` y en `public/robots.txt`.

## Checklist de lanzamiento

- [ ] Enviar el formulario de contacto de punta a punta y confirmar que llega el mail (el primer envío pide confirmar el email en Formspree).
- [ ] Pegar la URL de un artículo en el [Post Inspector de LinkedIn](https://www.linkedin.com/post-inspector/) y revisar la tarjeta.
- [ ] Revisar el sitio en el celular: menú, artículo y formulario.
- [ ] Confirmar en GoatCounter que se registran visitas y el evento `contacto-enviado`.
- [ ] Dar de alta el sitio en Google Search Console y enviar `sitemap-index.xml`.

## Estructura

| Ruta | Qué contiene |
|------|--------------|
| `src/config/sitio.ts` | Nombre, bio, enlaces e IDs externos (todo lo configurable) |
| `src/content/articulos/` | Los artículos |
| `src/content/esquema.ts` | Campos del frontmatter y etiquetas permitidas |
| `src/lib/` | Lógica probada: publicación, fechas y formulario |
| `src/layouts/`, `src/components/`, `src/pages/` | Plantillas y páginas |
| `src/styles/main.scss` | Color de marca (`$primary`) y estilos |
| `scripts/generar-og.mjs` | Regenera la imagen para compartir `public/og-default.png` |

## Foto de perfil

La foto está en `src/assets/claudio.jpg` (recortada y con el color ajustado a la paleta). Para cambiarla, reemplazá ese archivo por otro con el mismo nombre, en formato vertical. Astro genera las versiones optimizadas al compilar.

## Contenido sin marcas

El sitio no nombra empleadores, clientes ni socios: se describen por industria (por ejemplo, "un importante banco argentino con fuerte presencia tecnológica"). La prueba `tests/dist/marcas.test.ts` frena la publicación si aparece alguno de los nombres de su lista.

## Dominio propio (más adelante)

Configuralo en *Settings → Pages → Custom domain* y actualizá la URL en los tres archivos que se mencionan arriba.

## Colores y tipografía

Estilo editorial cercano: papel claro, tinta azul petróleo, dorado como resaltador, y bordes y sombras duras. La paleta está al principio de `src/styles/main.scss`. Las tipografías son Archivo (títulos) e IBM Plex Sans (texto), instaladas desde npm.

## Tono

El sitio no se ofrece como servicio: muestra cómo pensás y qué resolviste, y el contacto aparece como invitación ("Escribime", "Contame en qué andás"). Los casos de la portada están en `src/pages/index.astro`, en la lista `casos`.
