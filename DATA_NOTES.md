# Notas de mapeo — Procesos.md → src/data/

`Procesos.md` no trae departamentos ni tipos de conexión explícitos. Este
documento explica los supuestos usados para transformarlo en el modelo de
datos tipado de `src/data/`, para que se puedan ajustar sin tener que releer
todo el código.

## Departamentos

Se mantienen los 5 del prototipo original y se agrega uno:

| id            | label        | por qué                                                                 |
|---------------|--------------|--------------------------------------------------------------------------|
| `cuentas`     | Cuentas      | brief, revisiones internas, aprobación de cliente, coordinación         |
| `diseno`      | Diseño       | piezas gráficas, mockups, UX/UI                                         |
| `copywriting` | Copywriting  | textos, copies, investigación de keywords                               |
| `desarrollo`  | Desarrollo   | dominio, sitio web, tracking técnico                                    |
| `paid_media`  | Paid Media   | estrategia y configuración de campañas                                  |
| `ventas`      | Ventas       | **nuevo** — prospección hasta cierre de venta y contrato (Campañas)     |

`ventas` se separó de `cuentas` porque en el resto del documento "Cuentas"
funciona como gestión de cuenta post-venta (brief, revisiones, cliente), y el
tramo de prospección→cierre en Campañas es una función distinta (comercial).
Si se prefiere fusionarlos, basta con cambiar el `dept` de los nodos
`camp_n1`–`camp_n9` y `camp_n7a`–`camp_n7e` a `cuentas` y borrar la entrada
`ventas` de `departments.ts`.

## Tipos de conexión

Se reutilizan los mismos 5 tipos filtrables del prototipo (`handoff`,
`approval`, `feedback`, `review`, `cross`), con este criterio:

- **`handoff`** (por defecto): un paso entrega su resultado al siguiente.
- **`approval`**: el paso siguiente solo puede iniciar si alguien (cliente o
  Cuentas) da un visto bueno explícito. Ej. `par_n5→par_n6` (revisión interna
  final → cliente), `camp_n17→camp_n18` (visto bueno cliente → implementar).
- **`feedback`**: una revisión genera correcciones que vuelven al mismo rol
  que hizo el trabajo. Ej. `par_n3→par_n4` (revisión interna → aplicar
  cambios), `web_n15→web_n16` (comentarios cliente → segunda revisión).
- **`review`**: presentación/revisión de un entregable con el cliente que no
  es un simple hand-off ni una aprobación binaria. Ej. `web_n13→web_n14`,
  `camp_n16→camp_n17`.
- **`cross`**: se reserva para `crossProcess_edges` (conexiones entre
  procesos distintos), igual que en el prototipo original.

## Proceso 1 — Diseño y Comunicación (Parrillas)

Mapeo 1:1 con los 14 pasos listados. Sin ambigüedad estructural: es una lista
lineal. Los dos ciclos de revisión interna (copy y diseño) se modelan con
`feedback` en la arista de "revisión → aplicar cambios/comentarios".

## Proceso 2 — Web

Mapeo 1:1 con los 26 pasos. El paso 12 "Desarrollo del sitio" es un nodo
padre (`web_n12`) con dos hijos que aparecen como sub-ítems en el documento
(`web_n12a` "Archivo .MD", `web_n12b` "Lógica"); ambos corren en paralelo y
convergen en el paso 13. Es la única bifurcación real del documento en este
bloque.

## Proceso 3 — Campañas (el más complejo)

El texto mezcla tres niveles distintos y se trataron de forma diferente:

1. **Funnel comercial + gestión de cuenta + estrategia** (bullets `*` de
   nivel superior): cada bullet es un nodo, 1:1.

2. **Clasificación tras "Enviar brief"** (`camp_n7`): el documento lista 5
   categorías (Cliente Meta con/sin historial, Cliente Google con/sin
   historial, Otras plataformas) como una enumeración paralela, no como texto
   descriptivo de un único paso. Se modelaron como 5 nodos hermanos
   (`camp_n7a`–`camp_n7e`) que parten de `camp_n7` y convergen en
   `camp_n8` ("Definir contrato").

3. **Listas anidadas de agenda/checklist** dentro de "Kickoff interno"
   (`camp_n11`), "Kickoff con cliente" (`camp_n12`) y "Trabajar en la
   estrategia" (`camp_n14`): estos ítems (¿Qué tiene que pasar?, Si hay
   histórico, Nos presentamos, Definir objetivos, Buyer persona, Benchmark,
   etc.) **no son hand-offs entre departamentos** — son el contenido/agenda
   de una sola reunión o tarea. Se plegaron en el campo `description` del
   nodo padre en vez de crear un nodo por ítem, para no inflar el grafo con
   ramas sin conexiones reales entre roles. Si se prefiere verlos como nodos
   explícitos, están listados textualmente en cada `description` y se pueden
   promover a nodos propios más adelante.

4. **Implementar estrategia → Meta / Google**: el documento explícitamente
   numera Meta (1) y Google (2) como dos vías de ejecución con pasos propios
   y secuenciales. Se modelaron como dos sub-flujos con 18 nodos cada uno
   (`camp_meta_n1`–`n18`, `camp_google_n1`–`n18`), ambos arrancando desde
   `camp_n18` ("Implementar estrategia"). Van dentro del mismo `ProcessDefinition`
   de Campañas (no son procesos aparte) porque comparten el mismo funnel
   comercial y de estrategia previo — separarlos en procesos independientes
   hubiera duplicado esos ~18 nodos previos o roto la trazabilidad del
   embudo comercial → ejecución.

   Dentro de Google, los pasos marcados explícitamente "(Web)" en el
   documento (subdominio, landing page, tag manager, objetivos de
   conversión) se asignaron a `desarrollo` en vez de `paid_media`, y generan
   cross-process edges hacia el proceso Web (ver abajo).

## Cross-process edges

| from                | to                  | razón                                                              |
|---------------------|---------------------|---------------------------------------------------------------------|
| `par_n13`           | `camp_meta_n4`      | artes de parrilla reutilizables como creatividad de Meta            |
| `par_n2`            | `camp_meta_n2`      | copys de parrilla reutilizables como copy de anuncios               |
| `web_n6`            | `camp_google_n4`    | el dominio de desarrollo del proyecto Web es base del subdominio    |
| `web_n20`           | `camp_google_n5`    | el sitio publicado es la plataforma de la landing page de Google    |

## Agregar procesos nuevos

`src/data/processes.ts` es el único archivo que hay que tocar para dar de
alta un proceso: crear `src/data/processes/<nombre>.ts` exportando un
`ProcessDefinition` (ver `src/data/types.ts`) y agregarlo al arreglo
`processes` en `processes.ts`. Ningún componente necesita cambios — todos
leen de `DATA`, `deptMap`, `procMap` y `nodeMap` exportados desde ahí. Si el
proceso nuevo necesita un departamento que no existe, agregarlo a
`src/data/departments.ts` (id, label, color hex) y usarlo en los `dept` de
los nodos.
