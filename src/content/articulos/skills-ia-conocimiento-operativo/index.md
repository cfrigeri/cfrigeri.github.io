---
titulo: "Skills en agentes de IA: cómo convertir el conocimiento de tu equipo en un activo reutilizable"
resumen: "Qué son las Skills, por qué importan más allá del hype, qué riesgos traen y cómo crear la primera en una tarde."
fecha: 2026-11-26
etiquetas: ["gobernanza", "automatizacion"]
borrador: false
---

Todos los equipos tienen un problema que nadie anota en el backlog.

El conocimiento operativo vive en la cabeza de dos o tres personas. Cómo se revisa un endpoint. Qué se valida antes de un pase a producción. Cómo se redacta un post-mortem para que lo entienda el negocio.

Cuando empezamos a trabajar con IA, ese problema no desaparece. Se multiplica.

Cada persona escribe sus propios prompts. Cada uno corrige al modelo a su manera. Y el resultado depende de quién estaba sentado frente al teclado ese día.

Las **Skills** atacan justo eso.

## Qué es una Skill

Una Skill esta compuesta por una carpeta. Adentro contiene un archivo `SKILL.md` con instrucciones, y opcionalmente ejemplos, plantillas o scripts.

La diferencia con un prompt suelto es cómo se usa. El agente no carga todo de entrada. Primero lee solo el nombre y la descripción de cada skill disponible. Cuando detecta que la tarea coincide, recién ahí carga las instrucciones completas.

Eso tiene tres consecuencias prácticas:

- **Estandarizás procesos.** Las reglas de revisión, los formatos y los criterios se escriben una vez.
- **Cuidás el contexto.** El modelo no arrastra instrucciones que no necesita.
- **Componés.** Una skill de análisis de logs puede trabajar junto a otra que redacta el informe de incidente.

Una skill no le da al agente nuevas conexiones con sistemas externos. Para eso hay otras elementos, como los servidores MCP. La skill le da un marco sobre **cómo** razonar y proceder en un dominio concreto.

## Por qué ahora importa más

Anthropic creó el formato para Claude. En diciembre de 2025 lo publicó como estándar abierto, con la especificación en [agentskills.io](https://agentskills.io).

Hoy el mismo `SKILL.md` lo leen varios agentes y herramientas de desarrollo, no solo Claude.

Para una empresa eso cambia la ecuación. Ya no estás atando tu conocimiento a un proveedor. Estás construyendo un activo portable, versionado en un repo, que sobrevive al cambio de herramienta.

Una skill se puede revisar en un pull request, auditar y mejorar como cualquier otro código. El conocimiento deja de ser tácito.

## Cómo se ve una Skill

La estructura mínima:

```plaintext
revisor-arquitectura-api/
├── SKILL.md          # Instrucciones y descripción
├── ejemplos/         # Entrada y salida esperada
└── scripts/          # Validaciones opcionales
```

Y un `SKILL.md` efectivo puede ser así de corto:

```markdown
---
name: revisor-arquitectura-api
description: Evalúa especificaciones OpenAPI y contratos de microservicios buscando fallas de idempotencia, seguridad y manejo de errores. Usar cuando el usuario pida revisar endpoints o diseñar APIs.
---

# Instrucciones de revisión

1. **Seguridad:** verificá el esquema de autenticación (OAuth2/JWT) y la validación estricta de parámetros de entrada.
2. **Resiliencia:** comprobá el uso de claves de idempotencia en operaciones `POST` y `PATCH`.
3. **Formato de salida:** entregá una tabla con Severidad, Hallazgo y Propuesta de remediación.
```

El campo que más trabajo merece es `description`. Es lo único que el agente lee para decidir si activa la skill. Si es vaga, se activa cuando no corresponde. O no se activa nunca.

## El riesgo

Una skill son instrucciones que el agente va a seguir. Eso la convierte en una superficie de ataque.

El riesgo depende de qué puede hacer el entorno donde corre:

| Riesgo | Tipo de skill | Qué puede salir mal |
|---|---|---|
| Bajo | Solo texto (reglas, plantillas, guías) | Instrucciones sesgadas o de mala calidad |
| Medio | Con acceso a archivos locales | Lectura o modificación de código y documentos sin revisión |
| Alto | Con scripts o acceso a red | Prompt injection, ejecución de comandos, exfiltración de datos |

En un entorno regulado, como el financiero, esto no es un detalle técnico. Es un tema de gobernanza.

La regla es simple: **una skill de terceros se trata como una dependencia de terceros.** Se lee completa antes de instalarla. Sobre todo si el agente tiene permisos de escritura o ejecución.

Lo mismo que hacemos con un paquete de npm. O que deberíamos hacer.

## Dónde encontrar skills existentes

- **[anthropics/skills](https://github.com/anthropics/skills):** el repositorio de referencia de Anthropic, con ejemplos de desarrollo, documentos y comunicación.
- **[agentskills.io](https://agentskills.io):** la especificación del estándar y la lista de herramientas que lo soportan.
- **Listas comunitarias en GitHub:** buscá `awesome-claude-skills` o `claude-code-skills`. Útiles para inspirarse. Leelas antes de instalarlas.

## Para empezar esta semana

Elegí una sola tarea repetitiva de tu equipo. Escribí su `SKILL.md` con tres reglas y un ejemplo. Guardala en `.claude/skills/` dentro del repo del proyecto, para que todo el equipo la use y la revise en los pull requests.

Si no sabés por dónde arrancar, usá la skill `skill-creator` del repositorio de Anthropic: te guía para armar la estructura y probarla.

La IA no reemplaza el criterio de tu equipo. Pero bien estructurada, lo puede volver repetible.
