import type { ProcessDefinition } from "../types";

/**
 * Fuente: Procesos.md, bloque "Web" (pasos 1-26).
 * El paso 12 "Desarrollo del sitio" es nodo padre con dos sub-ítems del
 * documento (Archivo .MD, Lógica) que corren en paralelo y convergen en el
 * paso 13. Todos los demás pasos son 1:1 con el listado original.
 */
export const web: ProcessDefinition = {
  id: "web",
  label: "Web",
  color: "#9B72E0",
  nodes: [
    {
      id: "web_n1",
      label: "Creación del\ncronograma",
      dept: "cuentas",
      description: "Cuentas elabora el cronograma de trabajo del proyecto web.",
    },
    {
      id: "web_n2",
      label: "Encuesta de inicio\nde proyecto",
      dept: "cuentas",
      description: "Cuentas envía la encuesta de inicio de proyecto al cliente.",
    },
    {
      id: "web_n3",
      label: "Revisar textos y\nproponer mejoras",
      dept: "copywriting",
      description:
        "Copywriting revisa los textos existentes del cliente y propone mejoras, si aplica.",
    },
    {
      id: "web_n4",
      label: "Solicitar copy\nal cliente",
      dept: "cuentas",
      description: "Cuentas envía el documento para que el cliente agregue el copy del sitio.",
    },
    {
      id: "web_n5",
      label: "Creación de copy\npara el sitio",
      dept: "copywriting",
      description: "Copywriting redacta el copy del sitio cuando el cliente no lo provee.",
    },
    {
      id: "web_n6",
      label: "Creación de dominio\nde desarrollo",
      dept: "desarrollo",
      description: "Desarrollo crea el dominio de desarrollo del proyecto.",
    },
    {
      id: "web_n7",
      label: "Elaboración del\nmapa de sitio",
      dept: "diseno",
      description: "Diseño elabora el mapa de sitio (arquitectura de información).",
    },
    {
      id: "web_n8",
      label: "Reunión: cronograma\ny mapa de sitio",
      dept: "cuentas",
      description:
        "Cuentas agenda una reunión con el cliente para revisar cronograma y mapa de sitio.",
    },
    {
      id: "web_n9",
      label: "Solicitar accesos\nde dominio",
      dept: "desarrollo",
      description:
        "Desarrollo solicita datos del dominio (accesos a cPanel o FTP), en caso necesario.",
    },
    {
      id: "web_n10",
      label: "Propuesta de diseño\nen Figma",
      dept: "diseno",
      description: "Diseño elabora la propuesta de diseño del sitio en Figma.",
    },
    {
      id: "web_n11",
      label: "Revisión de propuesta\ncon cliente",
      dept: "cuentas",
      description:
        "Cuentas presenta la propuesta de diseño al cliente para su revisión y aprobación.",
    },
    {
      id: "web_n12",
      label: "Desarrollo\ndel sitio",
      dept: "desarrollo",
      description:
        "Desarrollo implementa el sitio siguiendo el diseño aprobado, dividido en archivo .MD y lógica.",
    },
    {
      id: "web_n12a",
      label: "Archivo .MD",
      dept: "desarrollo",
      description: "Desarrollo estructura el contenido del sitio en archivo .MD.",
    },
    {
      id: "web_n12b",
      label: "Lógica",
      dept: "desarrollo",
      description: "Desarrollo implementa la lógica funcional del sitio.",
    },
    {
      id: "web_n13",
      label: "Primera revisión\ndel sitio con cliente",
      dept: "cuentas",
      description: "Cuentas presenta el sitio al cliente para la primera revisión.",
    },
    {
      id: "web_n14",
      label: "Encuesta de satisfacción\nde mitad de proyecto",
      dept: "cuentas",
      description: "Cuentas envía la encuesta de satisfacción de mitad de proyecto.",
    },
    {
      id: "web_n15",
      label: "Comentarios del\ncliente (parte 1)",
      dept: "cuentas",
      description: "Cuentas recopila los comentarios del cliente sobre la primera revisión.",
    },
    {
      id: "web_n16",
      label: "Segunda revisión\ndel sitio",
      dept: "cuentas",
      description: "Cuentas presenta la segunda revisión del sitio con los ajustes aplicados.",
    },
    {
      id: "web_n17",
      label: "Comentarios del\ncliente (parte 2)",
      dept: "cuentas",
      description: "Cuentas recopila los comentarios del cliente sobre la segunda revisión.",
    },
    {
      id: "web_n18",
      label: "Capacitación\nal cliente",
      dept: "cuentas",
      description: "Cuentas y Desarrollo capacitan al cliente en el uso del sitio.",
    },
    {
      id: "web_n19",
      label: "Crear accesos\npara el cliente",
      dept: "desarrollo",
      description: "Desarrollo crea los accesos del sitio para el cliente.",
    },
    {
      id: "web_n20",
      label: "Subir sitio al\ndominio definitivo",
      dept: "desarrollo",
      description: "Desarrollo publica el sitio en el dominio definitivo.",
    },
    {
      id: "web_n21",
      label: "Revisión general\ndel sitio web",
      dept: "desarrollo",
      description: "Desarrollo realiza una revisión general del sitio ya publicado.",
    },
    {
      id: "web_n22",
      label: "Configuración\nde reCAPTCHA",
      dept: "desarrollo",
      description: "Desarrollo configura reCAPTCHA en los formularios del sitio.",
    },
    {
      id: "web_n23",
      label: "Revisión de puntos\nclave del sitio",
      dept: "desarrollo",
      description: "Desarrollo revisa los puntos clave de funcionamiento del sitio.",
    },
    {
      id: "web_n24",
      label: "Backup\ndel sitio",
      dept: "desarrollo",
      description: "Desarrollo realiza el backup del sitio ya publicado.",
    },
    {
      id: "web_n25",
      label: "Carta de cierre\nde proyecto",
      dept: "cuentas",
      description: "Cuentas elabora y envía la carta de cierre de proyecto.",
    },
    {
      id: "web_n26",
      label: "Encuesta final\nde satisfacción",
      dept: "cuentas",
      description: "Cuentas envía la encuesta final de satisfacción al cliente.",
    },
  ],
  edges: [
    { from: "web_n1", to: "web_n2", label: "cronograma listo", type: "handoff" },
    { from: "web_n2", to: "web_n3", label: "encuesta enviada", type: "handoff" },
    { from: "web_n3", to: "web_n4", label: "textos revisados", type: "handoff" },
    { from: "web_n4", to: "web_n5", label: "sin copy del cliente", type: "handoff" },
    { from: "web_n5", to: "web_n6", label: "copy listo", type: "handoff" },
    { from: "web_n6", to: "web_n7", label: "dominio creado", type: "handoff" },
    { from: "web_n7", to: "web_n8", label: "mapa de sitio listo", type: "handoff" },
    { from: "web_n8", to: "web_n9", label: "reunión realizada", type: "handoff" },
    { from: "web_n9", to: "web_n10", label: "accesos solicitados", type: "handoff" },
    { from: "web_n10", to: "web_n11", label: "propuesta lista", type: "handoff" },
    { from: "web_n11", to: "web_n12", label: "aprobación de propuesta", type: "approval" },
    { from: "web_n12", to: "web_n12a", label: "estructura de contenido", type: "handoff" },
    { from: "web_n12", to: "web_n12b", label: "lógica funcional", type: "handoff" },
    { from: "web_n12a", to: "web_n13", label: "contenido listo", type: "handoff" },
    { from: "web_n12b", to: "web_n13", label: "lógica lista", type: "handoff" },
    { from: "web_n13", to: "web_n14", label: "primera revisión", type: "review" },
    { from: "web_n14", to: "web_n15", label: "encuesta enviada", type: "handoff" },
    { from: "web_n15", to: "web_n16", label: "comentarios aplicados", type: "feedback" },
    { from: "web_n16", to: "web_n17", label: "segunda revisión", type: "review" },
    { from: "web_n17", to: "web_n18", label: "comentarios resueltos", type: "handoff" },
    { from: "web_n18", to: "web_n19", label: "capacitación realizada", type: "handoff" },
    { from: "web_n19", to: "web_n20", label: "accesos creados", type: "handoff" },
    { from: "web_n20", to: "web_n21", label: "sitio publicado", type: "handoff" },
    { from: "web_n21", to: "web_n22", label: "revisión general lista", type: "handoff" },
    { from: "web_n22", to: "web_n23", label: "reCAPTCHA configurado", type: "handoff" },
    { from: "web_n23", to: "web_n24", label: "puntos clave revisados", type: "handoff" },
    { from: "web_n24", to: "web_n25", label: "backup realizado", type: "handoff" },
    { from: "web_n25", to: "web_n26", label: "carta enviada", type: "handoff" },
  ],
};
