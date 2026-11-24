---
titulo: "Gobernar agentes de IA"
resumen: "Doble firma, límites por operación, segregación de funciones y auditoría: seis principios traducidos en la arquitectura de un agente."
fecha: 2026-11-24
etiquetas: [ia, arquitectura]

borrador: true
---

Uns entidad financiera deja que miles de personas muevan dinero todos los días. Cajeros, operadores, analistas, sistemas automáticos. Y aun así, lo normal es que el dinero termine donde tiene que terminar.

Eso no pasa porque el banco confíe ciegamente en cada persona. Pasa porque durante décadas construyó un sistema que **no depende de la confianza**: identidades claras, límites, doble control y una pista de auditoría que permite reconstruir cualquier movimiento.

Hoy estamos empezando a darles a los agentes de IA algo parecido a lo que el banco le da a un operador: acceso a sistemas, capacidad de ejecutar acciones y cierto margen para decidir. Y en muchas empresas se hace al revés: primero se le da el acceso y después se piensa cómo controlarlo.

Este artículo trata sobre gobernanza de agentes, y arranca por seis principios bancarios y cómo se traducen en componentes concretos de arquitectura.

## Por qué ahora

Tres señales muestran que el tema dejó de ser teórico:

- En diciembre de 2025, OWASP publicó su **Top 10 de riesgos para aplicaciones agénticas**. Entre los primeros aparecen el secuestro del objetivo del agente, el mal uso de herramientas y el abuso de identidad y privilegios.
- En octubre de 2026, NIST propuso **diez principios de diseño para la identidad de agentes**: identidad propia, privilegio mínimo, autorizaciones de corta duración, intervención humana por umbral de riesgo y evidencia inalterable, entre otros.
- En la Unión Europea, el reglamento de IA ya está en marcha. Con la reforma publicada en julio de 2026, las obligaciones para sistemas de alto riesgo, que incluyen casos como la evaluación crediticia, se aplicarán desde diciembre de 2027. El reloj sigue corriendo.

Ninguno de estos documentos inventa algo nuevo.

## Seis principios y su traducción a arquitectura

### 1. Nadie opera con un usuario genérico

Cada operación queda asociada a una persona. No existe "el usuario" que usan todos.

**En un agente:** cada agente necesita una **identidad propia**, distinta de la del usuario que lo dispara y distinta de una cuenta de servicio compartida. Y esa identidad tiene que quedar vinculada a quién inició la tarea. Si un agente actúa en nombre de alguien, el sistema tiene que poder responder "¿quién pidió esto?" en cada paso.

El error típico es darle al agente las credenciales de un usuario administrador "para que funcione". Funciona, sí. Y cuando algo sale mal, nadie sabe si fue la persona o el agente.

### 2. Quien carga no aprueba

La segregación de funciones es un clásico: la persona que carga no es la misma que lo aprueba.

**En un agente:** separar **el que propone del que decide**. El modelo de lenguaje razona y propone una acción. Pero la decisión de si esa acción está permitida tiene que tomarla un componente **determinístico**: un motor de políticas que no se puede convencer con un buen argumento.

Esto es clave porque un modelo es probabilístico y puede ser manipulado: un correo con instrucciones escondidas, un documento envenenado, una respuesta inesperada de otra herramienta. Si la regla vive solo en el prompt, alguien va a encontrar la forma de que el modelo la ignore. Si vive en código, fuera del modelo, no.

### 3. Cada puesto tiene un límite

Los límites no expresan desconfianza: definen el tamaño del daño posible.

**En un agente:** **permisos mínimos y temporales**. OWASP lo llama *least agency*: darle al agente solo la autonomía, las herramientas y los permisos que necesita para la tarea, nada más. En la práctica:

- una lista cerrada de herramientas por agente, en lugar de acceso a todo el catálogo;
- permisos de solo lectura salvo que la tarea requiera escribir;
- límites explícitos de monto, cantidad de operaciones y costo por tarea;
- credenciales que vencen en minutos, no en meses.

### 4. Doble firma

El esquema *maker-checker*: una persona prepara la operación y otra la revisa antes de que se ejecute. Pero solo cuando el riesgo lo justifica, porque si todo requiere doble firma, la segunda firma se vuelve automática y deja de controlar.

**En un agente:** **intervención humana por umbral de riesgo**. El agente resuelve solo lo rutinario y escala lo que supera ciertos límites: montos altos, acciones irreversibles, clientes sensibles, baja confianza en la respuesta.

Diseñar bien estos umbrales es más importante que el modelo que uses. Si tu agente escala el 80 % de los casos, no automatizaste nada. Si escala el 0 %, probablemente estés aceptando riesgos que no mediste.

### 5. Todos los días se concilia

Las diferencias se investigan.

**En un agente:** **evaluación continua**. No alcanza con probar el agente antes de salir a producción. Hay que comparar regularmente lo que el agente dijo que hizo con lo que efectivamente pasó, y medir tres cosas: cuánto acierta, cuánto cuesta y cuánto tarda. Cuando esas métricas se mueven, es una alerta, igual que una diferencia de conciliación.

### 6. Todo deja rastro

Quién, qué, cuándo, desde dónde y con qué autorización.

**En un agente:** un **registro auditable de cada decisión**: qué pedido recibió, qué información consultó, qué herramientas usó, qué respondió y quién aprobó, si hubo aprobación. Ese registro tiene que ser inalterable y guardar la versión del modelo y de las instrucciones usadas, porque un mismo pedido puede dar resultados distintos con otra versión.

## El mapa completo

| Principio | Componente en un agente |
| --- | --- |
| Usuario nominal | Identidad propia del agente, vinculada a quien inició la tarea |
| Segregación de funciones | Motor de políticas determinístico, separado del modelo |
| Límites por puesto | Permisos mínimos, herramientas acotadas y credenciales de corta duración |
| Doble firma | Aprobación humana por umbral de riesgo |
| Conciliación diaria | Evaluación continua de precisión, costo y latencia |
| Pista de auditoría | Registro inalterable de cada decisión y versión |


Me interesa saber cómo lo están encarando en tu equipo. ¿Qué principio te parece más difícil de aplicar? [Contame](/contacto).

## Fuentes

- OWASP GenAI Security Project: [Top 10 para aplicaciones agénticas 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) (diciembre de 2025).
- NIST: [principios de diseño para la identidad de agentes](https://labs.cloudsecurityalliance.org/research/csa-research-note-nist-agent-identity-design-tenets-20261109/), resumen de Cloud Security Alliance (noviembre de 2026).
- Reglamento (UE) 2026/1744, que modifica el reglamento de IA: [resumen de fechas de aplicación](https://www.actuia.com/en/news/ai-act-obligations-in-force-and-delays-under-omnibus-2026-1744/).
