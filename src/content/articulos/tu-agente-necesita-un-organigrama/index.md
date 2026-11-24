---
titulo: "Tu agente de IA necesita un lugar en el organigrama"
resumen: "Rol, responsable, permisos, período de prueba, evaluación de desempeño y baja: cómo gestionar a un agente de IA con las mismas preguntas que te harías con alguien nuevo en el equipo."
fecha: 2026-11-28
etiquetas: [ia, liderazgo]
imagen: ./portada.png
borrador: true
---

En las dos entregas anteriores de esta serie hablé de [principios](/articulos/gobernar-agentes-como-un-banco) y de [arquitectura](/articulos/cuatro-capas-de-control-para-agentes). Pero hay una pregunta que ninguna capa técnica responde, y que aparece siempre en el peor momento:

**¿De quién es este agente?**

Cuando un agente responde mal a un cliente, aprueba algo que no debía o empieza a costar el triple, alguien tiene que hacerse cargo. Y en muchas empresas, la respuesta honesta es "de nadie": lo armó alguien de sistemas, lo usa un área de negocio y lo paga otra.

La propuesta de este artículo es simple: **tratar a cada agente como a una persona nueva en el equipo**. No porque sea una persona, sino porque las organizaciones ya saben cómo integrar, supervisar y evaluar a alguien nuevo. Esas mismas preguntas sirven para un agente.

## 1. Una descripción de puesto

Nadie entra a una empresa sin saber qué tiene que hacer. Un agente tampoco debería.

La descripción de puesto de un agente responde:

- **Para qué existe:** el problema concreto que resuelve.
- **Qué puede hacer:** las tareas y herramientas habilitadas.
- **Qué no puede hacer:** tan importante como lo anterior, y casi siempre olvidado.
- **Cuándo escala:** en qué situaciones tiene que derivar a una persona.

Si no podés escribir esto en media página, probablemente el agente está haciendo demasiadas cosas.

## 2. Un responsable con nombre y apellido

Cada agente necesita un **dueño**: una persona del negocio que responde por lo que el agente hace, no solo por cómo está construido.

Conviene separar dos roles:

- **Responsable funcional:** decide qué tiene que hacer el agente y acepta sus resultados. Suele estar en el área de negocio.
- **Responsable técnico:** mantiene la infraestructura, los permisos y las integraciones. Suele estar en tecnología.

Y un tercero, que es el que más se olvida: **quién atiende los escalamientos**. Si el agente deriva casos a una persona, esa persona tiene que existir, saber que existe el agente y tener tiempo asignado para eso.

## 3. Accesos de ingresante

A alguien que recién entra no le das acceso a todo el primer día. Le das lo que necesita para su tarea y vas ampliando a medida que demuestra criterio.

Con un agente pasa lo mismo: **permisos mínimos al inicio y ampliación gradual**, con una revisión explícita cada vez que se amplían. Y los permisos se otorgan al agente, con su propia identidad, nunca prestando las credenciales de alguien del equipo.

## 4. Período de prueba

Antes de darle autonomía, un buen esquema es el **modo sombra**: el agente procesa los casos reales y propone qué haría, pero quien ejecuta es una persona. Durante unas semanas comparás lo que el agente propuso con lo que la persona decidió.

Eso te da algo muy valioso: **datos reales de precisión antes de asumir riesgos**. Después podés pasar a una autonomía parcial, donde el agente resuelve solo los casos de bajo riesgo y escala el resto, y ajustar los umbrales con la evidencia que juntaste.

## 5. Evaluación de desempeño

Una vez por mes, el responsable funcional revisa cuatro números: precisión, costo por caso, tiempo de respuesta y tasa de escalamiento. Y una pregunta cualitativa: ¿hubo algún caso que nos preocupó?

Esta revisión no es burocracia. Es el momento de decidir si el agente gana alcance, se queda como está o vuelve a modo sombra.

## 6. Una baja ordenada

Cuando una persona deja la empresa, se le revocan los accesos el mismo día. Con los agentes esto casi nunca pasa: el proyecto se abandona, pero las credenciales siguen vivas durante meses.

Dar de baja un agente implica revocar credenciales y tokens, desactivar sus integraciones, archivar sus registros de auditoría por el tiempo que corresponda y avisar a quienes trabajaban con él.

## La ficha del agente

Todo lo anterior entra en una ficha corta. Este es un ejemplo para un agente de triaje de soporte:

```yaml
agente: triaje-soporte
proposito: Clasificar los tickets entrantes y responder consultas frecuentes.
responsable_funcional: Jefa de Atención al Cliente
responsable_tecnico: Líder de Plataforma
escalamientos: Equipo de soporte nivel 2
puede:
  - leer tickets y el historial del cliente
  - responder preguntas frecuentes con la base de conocimiento
  - asignar prioridad y área
no_puede:
  - emitir reintegros ni modificar datos del cliente
  - responder reclamos legales
escala_cuando:
  - el cliente menciona una baja o un reclamo formal
  - la confianza en la clasificación es baja
  - el ticket lleva más de dos respuestas sin resolverse
metricas: [precision, costo_por_caso, tiempo_de_respuesta, tasa_de_escalamiento]
estado: modo sombra, revisión el 15 de cada mes
```

## Un inventario de agentes

Cuando cada agente tiene su ficha, aparece algo que pocas organizaciones tienen hoy: **un inventario de agentes**. Una lista de qué agentes existen, qué hacen, quién responde por ellos y qué acceso tienen.

Sin ese inventario aparecen los agentes fantasma: automatizaciones que alguien armó con buena intención, que tienen acceso a datos sensibles y que nadie recuerda que existen. Es el mismo problema que las cuentas de usuario huérfanas, y se resuelve igual: con registro, responsables y revisiones periódicas.

## El cierre de la serie

Si juntamos las tres entregas, la gobernanza de agentes se apoya en tres patas:

1. **Principios** que la banca ya probó: identidad, segregación de funciones, límites, doble control, conciliación y auditoría.
2. **Arquitectura** que los hace cumplir: política, ejecución, evaluación y auditoría, fuera del alcance del modelo.
3. **Organización** que se hace cargo: un responsable, una descripción de puesto y un ciclo de vida claro.

Las dos primeras se resuelven con tecnología. La tercera, con decisiones. Y es la que más se demora.

¿Ya tienen definido quién es el responsable de cada agente en tu organización? Si te interesa armar la primera ficha o el inventario, [contame en qué andás](/contacto).
