---
titulo: "Cuatro capas de control antes de dejar a un agente tocar producción"
resumen: "Política, ejecución, evaluación y auditoría: una arquitectura concreta para que un agente de IA pueda actuar sobre tus sistemas sin que el riesgo dependa de lo que diga el prompt."
fecha: 2026-11-19
etiquetas: [ia, arquitectura, apis]
imagen: ./portada.png
---

La semana pasada repasé [seis principios que la banca usa hace décadas](/articulos/gobernar-agentes-como-un-banco) para controlar a quien opera dinero, y cómo se traducen al mundo de los agentes de IA. Esta vez bajo esos principios a una arquitectura.

La idea central es simple: **entre el agente y tus sistemas tiene que haber capas que el agente no controla**. El modelo puede razonar, proponer y equivocarse. Lo que no puede es saltear las reglas, porque las reglas no viven en él.

![Diagrama de las cuatro capas: el pedido llega al agente, que propone una acción; la capa de política decide si está permitida; la capa de ejecución la lleva a los sistemas a través de un gateway; si supera un umbral, aprueba una persona. Debajo, dos capas transversales: evaluación y auditoría.](./capas.svg)

## Capa 1: Política, o qué puede hacer el agente

Es la capa que responde "¿esta acción está permitida?" antes de que ocurra. Tiene tres piezas:

- **Identidad:** el agente se presenta con una identidad propia, vinculada a quién inició la tarea. Así cada decisión de permisos se toma sabiendo quién pide y en nombre de quién.
- **Permisos:** una lista cerrada de herramientas por agente y, dentro de cada herramienta, el alcance mínimo. Un agente de soporte puede consultar el estado de un pedido, pero no modificar el precio.
- **Límites:** montos, cantidades, horarios y costo máximo por tarea. Por encima de ciertos umbrales, la acción no se rechaza: se deriva a una persona.

Lo importante es **dónde vive** esta capa: en código, fuera del modelo. Existen motores de políticas como Open Policy Agent o Cedar que permiten escribir estas reglas de forma declarativa, versionarlas y probarlas como cualquier otro código. Si preferís empezar más simple, una función que valide cada acción contra una tabla de reglas ya es un salto enorme respecto de confiar en el prompt.

**Qué riesgo cubre:** el abuso de identidad y privilegios, y el secuestro del objetivo del agente. Si alguien logra manipular al modelo con instrucciones escondidas en un documento, la política sigue diciendo que no.

## Capa 2: Ejecución, o cómo actúa sin romper nada

Una acción permitida todavía puede salir mal. Esta capa controla **cómo** se ejecuta.

- **Un gateway de herramientas:** el agente no habla directo con tus APIs ni con tu base de datos. Habla con un intermediario que valida cada llamada, aplica la política, registra todo y recién ahí la deriva. Si usás el protocolo MCP para exponer herramientas, su especificación ya va en esa dirección: cada servidor tiene que aceptar solo tokens emitidos para él, y está prohibido reenviar tokens a otros servicios.
- **Credenciales de corta duración:** tokens que vencen en minutos y solo sirven para un recurso. Si se filtran, el daño es acotado.
- **Aislamiento:** si el agente ejecuta código, que lo haga en un entorno aislado, sin acceso a la red interna ni a secretos.
- **Topes y cortes:** cantidad máxima de llamadas por minuto, tiempo máximo por tarea y un corte automático si algo se repite de forma anormal. Un agente que entra en un bucle puede generar miles de operaciones antes de que alguien se entere.
- **Simulación primero:** para acciones con efecto, como enviar, pagar o borrar, conviene que el agente pueda ejecutar primero en modo de prueba y mostrar qué haría.

**Qué riesgo cubre:** el mal uso de herramientas, la ejecución de código inesperada y las fallas en cascada, cuando el error de un agente dispara errores en otros sistemas.

## Capa 3: Evaluación, o cómo sabés si funciona

Un agente puede cumplir todas las reglas y aun así hacer mal su trabajo. Esta capa mide la calidad, en dos momentos.

**Antes de salir a producción:** un conjunto de casos de prueba con la respuesta esperada. Empezá con 30 o 50 casos reales y representativos, incluidos los difíciles y los que deberían escalar a una persona. Cada cambio de modelo o de instrucciones se prueba contra ese conjunto, igual que un test de regresión.

**En producción:** cuatro métricas mínimas.

1. **Precisión:** qué porcentaje de casos resuelve bien, medido sobre una muestra revisada por personas.
2. **Costo por caso:** cuánto cuesta cada tarea resuelta, contando tokens y llamadas a herramientas.
3. **Latencia:** cuánto tarda, porque un agente lento también es un problema operativo.
4. **Tasa de escalamiento:** cuántos casos deriva a una persona. Si sube de golpe, algo cambió.

Para registrar y analizar todo esto existen herramientas de observabilidad específicas para modelos de lenguaje, y convenciones de OpenTelemetry para trazar llamadas a modelos. No hace falta empezar con nada sofisticado: una tabla con estas cuatro métricas por semana ya te da visibilidad.

**Qué riesgo cubre:** los agentes que se desvían de su objetivo sin que nadie lo note.

## Capa 4: Auditoría, o cómo reconstruís lo que pasó

Cuando algo sale mal, y en algún momento va a pasar, necesitás poder responder qué hizo el agente, por qué, con qué datos y quién lo aprobó.

Un buen registro de auditoría guarda, por cada tarea:

- el pedido original y quién lo inició;
- la información que el agente consultó;
- las herramientas que usó y sus respuestas;
- la acción final y su resultado;
- la aprobación humana, si la hubo;
- la versión del modelo, de las instrucciones y de las políticas vigentes.

Ese registro tiene que ser **inalterable**: que se pueda agregar, pero no modificar ni borrar. Y tiene que guardarse el tiempo suficiente para cumplir con tus obligaciones regulatorias, que en muchos sectores se miden en años.

**Qué riesgo cubre:** todos. Sin auditoría, cualquier incidente se convierte en una discusión sin evidencia.

## Cómo empezar sin frenar todo

No hace falta construir las cuatro capas antes de hacer algo útil. Un orden razonable:

1. **Semana 1:** identidad propia para el agente y lista cerrada de herramientas con permisos mínimos.
2. **Semana 2:** un registro de auditoría básico, aunque sea en una tabla de la base de datos con permisos de solo escritura.
3. **Semana 3:** un conjunto inicial de 30 casos de prueba y las cuatro métricas.
4. **Después:** el gateway, los límites y los umbrales de aprobación humana, a medida que el agente gana alcance.

Una prueba rápida para saber dónde estás: si mañana el agente hace algo inesperado, ¿cuánto tardarías en saber qué pasó y en cortarle el acceso? Si la respuesta se mide en días, empezá por la auditoría y por un botón para revocar sus credenciales.

En la próxima y última entrega de la serie salgo de la arquitectura para hablar de algo que suele quedar afuera: quién es el responsable del agente dentro de la organización.

¿Cuál de estas capas te está costando más? [Contame](/contacto) cómo la están resolviendo.

## Fuentes

- OWASP GenAI Security Project: [Top 10 para aplicaciones agénticas 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/).
- Model Context Protocol: [especificación de autorización](https://modelcontextprotocol.io/specification/latest/basic/authorization) (versión 2026-07-28).
- NIST: [principios de diseño para la identidad de agentes](https://labs.cloudsecurityalliance.org/research/csa-research-note-nist-agent-identity-design-tenets-20261109/), resumen de Cloud Security Alliance.
