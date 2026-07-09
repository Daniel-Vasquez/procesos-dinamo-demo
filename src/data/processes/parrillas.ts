import type { ProcessDefinition } from "../types";

/**
 * Fuente: Procesos.md, bloque "Diseño y Comunicación (parrillas)" (pasos 1-14).
 * Mapeo 1:1 — cada paso listado es un nodo.
 */
export const parrillas: ProcessDefinition = {
  id: "parrillas",
  label: "Diseño y Comunicación (Parrillas)",
  color: "#4EC89A",
  nodes: [
    {
      id: "par_n1",
      label: "Investigación\nde temas",
      dept: "copywriting",
      description:
        "Copywriting investiga tendencias, temas relevantes y referencias para alimentar la parrilla del mes.",
    },
    {
      id: "par_n2",
      label: "Creación de contenido\n(copys y referencias)",
      dept: "copywriting",
      description:
        "Copywriting redacta los copys de cada pieza y reúne referencias visuales para Diseño.",
    },
    {
      id: "par_n3",
      label: "Revisión interna\nde la parrilla",
      dept: "cuentas",
      description:
        "Cuentas revisa internamente los copys y referencias antes de enviarlos a aprobación de cliente.",
    },
    {
      id: "par_n4",
      label: "Aplicar cambios\na la parrilla",
      dept: "copywriting",
      description: "Copywriting aplica los ajustes señalados en la revisión interna.",
    },
    {
      id: "par_n5",
      label: "Envío a revisión\ninterna final",
      dept: "cuentas",
      description: "Cuentas da el visto bueno final a los copys antes de mandarlos a cliente.",
    },
    {
      id: "par_n6",
      label: "Revisión con cliente\n(correo + WhatsApp)",
      dept: "cuentas",
      description:
        "Cuentas envía la parrilla al cliente por correo y avisa por WhatsApp para su aprobación.",
    },
    {
      id: "par_n7",
      label: "CM confirma\ncon diseñador",
      dept: "cuentas",
      description:
        "Una vez aprobada la parrilla con el cliente, el CM de la cuenta confirma con el diseñador para que inicie los diseños.",
    },
    {
      id: "par_n8",
      label: "Diseño de piezas\nde la parrilla",
      dept: "diseno",
      description: "Diseño produce las piezas gráficas de cada publicación de la parrilla.",
    },
    {
      id: "par_n9",
      label: "Revisión interna\nde diseños",
      dept: "cuentas",
      description:
        "Cuentas revisa los diseños cuidando ortografía y dedazos antes de aplicar comentarios.",
    },
    {
      id: "par_n10",
      label: "Aplicar comentarios\na los diseños",
      dept: "diseno",
      description: "Diseño aplica los comentarios de la revisión interna a las piezas.",
    },
    {
      id: "par_n11",
      label: "Envío a revisión\ninterna final",
      dept: "cuentas",
      description:
        "Cuentas da el visto bueno final a los diseños antes de enviarlos a cliente.",
    },
    {
      id: "par_n12",
      label: "Revisión con cliente\n(arte y copy OUT)",
      dept: "cuentas",
      description:
        "Cuentas envía los diseños finales al cliente por WhatsApp para su aprobación (arte y copy OUT).",
    },
    {
      id: "par_n13",
      label: "Subir artes finales\na OneDrive",
      dept: "diseno",
      description:
        "Diseño sube los artes finales con la nomenclatura 'cliente_tipo de entregable_fecha de publicación' a la carpeta de OneDrive y comparte con el CM.",
    },
    {
      id: "par_n14",
      label: "Programar contenido\nen Meta",
      dept: "diseno",
      description: "Diseño programa el contenido final aprobado en Meta.",
    },
  ],
  edges: [
    { from: "par_n1", to: "par_n2", label: "temas investigados", type: "handoff" },
    { from: "par_n2", to: "par_n3", label: "contenido a revisión", type: "handoff" },
    { from: "par_n3", to: "par_n4", label: "comentarios de revisión", type: "feedback" },
    { from: "par_n4", to: "par_n5", label: "cambios aplicados", type: "handoff" },
    { from: "par_n5", to: "par_n6", label: "visto bueno interno", type: "approval" },
    { from: "par_n6", to: "par_n7", label: "aprobación cliente", type: "approval" },
    { from: "par_n7", to: "par_n8", label: "inicia diseño", type: "handoff" },
    { from: "par_n8", to: "par_n9", label: "diseños a revisión", type: "handoff" },
    { from: "par_n9", to: "par_n10", label: "comentarios de revisión", type: "feedback" },
    { from: "par_n10", to: "par_n11", label: "cambios aplicados", type: "handoff" },
    { from: "par_n11", to: "par_n12", label: "visto bueno interno", type: "approval" },
    { from: "par_n12", to: "par_n13", label: "aprobación cliente", type: "approval" },
    { from: "par_n13", to: "par_n14", label: "artes listas para programar", type: "handoff" },
  ],
};
