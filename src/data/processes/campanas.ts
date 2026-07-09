import type { ProcessDefinition } from "../types";

/**
 * Fuente: Procesos.md, bloque "Campañas".
 *
 * Este bloque mezcla el funnel comercial (prospección → venta), la gestión
 * de cuenta post-venta y la ejecución de campañas, que se ramifica en Meta y
 * Google como sub-flujos con pasos propios. Las listas anidadas dentro de
 * "Kickoff interno", "Kickoff con cliente" y "Trabajar en la estrategia" son
 * agenda/checklist de una sola reunión o tarea (no hand-offs entre
 * departamentos), así que se pliegan en la descripción del nodo padre en vez
 * de crear un nodo por ítem. Detalle completo del criterio en DATA_NOTES.md.
 */
export const campanas: ProcessDefinition = {
  id: "campanas",
  label: "Campañas",
  color: "#E8606A",
  nodes: [
    // ── Funnel comercial ────────────────────────────────────────────
    {
      id: "camp_n1",
      label: "Acercamiento con\nprospectos",
      dept: "ventas",
      description:
        "Ventas se acerca a posibles prospectos para agendar una asesoría personalizada.",
    },
    {
      id: "camp_n2",
      label: "Asesoría\npersonalizada",
      dept: "ventas",
      description:
        "Ventas brinda la asesoría, escucha al cliente y lo asesora en función a posibles soluciones.",
    },
    {
      id: "camp_n3",
      label: "Propuesta\neconómica",
      dept: "ventas",
      description: "Ventas elabora la propuesta económica para el prospecto.",
    },
    {
      id: "camp_n4",
      label: "Reunión de\npresentación",
      dept: "ventas",
      description: "Ventas agenda una reunión para presentar la propuesta económica.",
    },
    {
      id: "camp_n5",
      label: "Explicación\ndel alcance",
      dept: "ventas",
      description: "Ventas explica a detalle el alcance de la propuesta.",
    },
    {
      id: "camp_n6",
      label: "Cierre\nde venta",
      dept: "ventas",
      description: "Ventas concreta la venta con el prospecto.",
    },
    {
      id: "camp_n7",
      label: "Enviar\nbrief",
      dept: "ventas",
      description:
        "Ventas envía el brief inicial, que se clasifica según la plataforma y el historial de campañas del cliente.",
    },
    {
      id: "camp_n7a",
      label: "Cliente Meta\ncon historial",
      dept: "ventas",
      description:
        "Cliente con campañas previas en Meta: se solicitan accesos a las plataformas existentes.",
    },
    {
      id: "camp_n7b",
      label: "Cliente Meta\nsin historial",
      dept: "ventas",
      description: "Cliente sin campañas previas en Meta: hay que generar todo desde cero.",
    },
    {
      id: "camp_n7c",
      label: "Cliente Google\ncon historial",
      dept: "ventas",
      description:
        "Cliente con campañas previas en Google: se solicitan accesos a las plataformas existentes.",
    },
    {
      id: "camp_n7d",
      label: "Cliente Google\nsin historial",
      dept: "ventas",
      description: "Cliente sin campañas previas en Google: hay que generar todo desde cero.",
    },
    {
      id: "camp_n7e",
      label: "Otras plataformas\n(TikTok, LinkedIn, Spotify...)",
      dept: "ventas",
      description:
        "Cliente que ejecutará campañas en otras plataformas (TikTok, LinkedIn, Spotify, etc.).",
    },
    {
      id: "camp_n8",
      label: "Definir\ncontrato",
      dept: "ventas",
      description: "Ventas define el contrato con el cliente.",
    },
    {
      id: "camp_n9",
      label: "Primer pago y\nfirma de contrato",
      dept: "ventas",
      description: "Se formaliza el primer pago y la firma del contrato.",
    },
    // ── Gestión de cuenta / kickoff ─────────────────────────────────
    {
      id: "camp_n10",
      label: "Confirmar acceso\na plataformas",
      dept: "cuentas",
      description:
        "Cuentas (Tanya) confirma con el cliente que se cuenta con acceso a las plataformas necesarias.",
    },
    {
      id: "camp_n11",
      label: "Kickoff\ninterno",
      dept: "cuentas",
      description:
        "Cuentas organiza el kickoff interno: se define qué tiene que pasar y se revisa el brief en conjunto (~45 min). Si hay histórico, no se puede asignar la cuenta a alguien sin conocimiento de esa plataforma (Google, Meta, etc.); se confirma y verifica el acceso a las plataformas, y se valida si la cotización va acorde con el análisis de las campañas del cliente (recomendaciones de otras plataformas, cambio de campañas de venta o interacción).",
    },
    {
      id: "camp_n12",
      label: "Kickoff\ncon cliente",
      dept: "cuentas",
      description:
        "Cuentas realiza el kickoff con el cliente: presentación del equipo, revisión del brief y el alcance, resolución de dudas, y presentación del manual de buenas prácticas genérico. Se define qué tiene que pasar según haya o no histórico, y si se proponen ajustes a la propuesta inicial.",
    },
    {
      id: "camp_n13",
      label: "Envío de plan\nde trabajo",
      dept: "cuentas",
      description: "Cuentas envía el plan de trabajo al cliente.",
    },
    // ── Estrategia ───────────────────────────────────────────────────
    {
      id: "camp_n14",
      label: "Trabajar en la\nestrategia",
      dept: "paid_media",
      description:
        "Paid Media define la estrategia: objetivos, diagnóstico/auditoría (cuando aplica), buyer persona, benchmark de competidores que pagan publicidad, presupuesto, pilares de contenido, tono de comunicación y alcance.",
    },
    {
      id: "camp_n15",
      label: "Revisión interna\nde estrategia",
      dept: "paid_media",
      description: "Paid Media revisa internamente la estrategia antes de presentarla al cliente.",
    },
    {
      id: "camp_n16",
      label: "Presentación de\nestrategia al cliente",
      dept: "cuentas",
      description: "Cuentas y Paid Media presentan la estrategia al cliente.",
    },
    {
      id: "camp_n17",
      label: "Visto bueno\ndel cliente",
      dept: "cuentas",
      description: "El cliente da el visto bueno a la estrategia propuesta.",
    },
    {
      id: "camp_n18",
      label: "Implementar\nestrategia",
      dept: "paid_media",
      description:
        "Paid Media inicia la implementación de la estrategia, que se ejecuta en paralelo por plataforma (Meta y Google, entre otras).",
    },
    // ── Sub-flujo Meta ────────────────────────────────────────────────
    {
      id: "camp_meta_n1",
      label: "Definición de\nvolumen de anuncios",
      dept: "paid_media",
      description: "Paid Media define el volumen de anuncios según necesidades y objetivos.",
    },
    {
      id: "camp_meta_n2",
      label: "Propuesta\nde copys",
      dept: "copywriting",
      description: "Copywriting propone los copys de los anuncios.",
    },
    {
      id: "camp_meta_n3",
      label: "Visto bueno\nde copys",
      dept: "cuentas",
      description:
        "Cuentas da el visto bueno a los copys, en caso de que no haya una parrilla de la que reutilizarlos.",
    },
    {
      id: "camp_meta_n4",
      label: "Diseño\nde anuncios",
      dept: "diseno",
      description: "Diseño produce las piezas visuales de los anuncios.",
    },
    {
      id: "camp_meta_n5",
      label: "Visto bueno\nde diseños",
      dept: "cuentas",
      description: "Cuentas da el visto bueno a los diseños de los anuncios.",
    },
    {
      id: "camp_meta_n6",
      label: "Envío de anuncios\na cliente",
      dept: "cuentas",
      description: "Cuentas envía los anuncios al cliente para su aprobación.",
    },
    {
      id: "camp_meta_n7",
      label: "Visto bueno\ndel cliente",
      dept: "cuentas",
      description: "El cliente da el visto bueno a los anuncios.",
    },
    {
      id: "camp_meta_n8",
      label: "Configurar objetivo\nde campaña",
      dept: "paid_media",
      description: "Paid Media configura el objetivo de la campaña en Meta Ads.",
    },
    {
      id: "camp_meta_n9",
      label: "Configurar\npresupuesto",
      dept: "paid_media",
      description: "Paid Media configura el presupuesto diario/mensual.",
    },
    {
      id: "camp_meta_n10",
      label: "Configurar\ntemporalidad",
      dept: "paid_media",
      description: "Paid Media configura la temporalidad de la campaña.",
    },
    {
      id: "camp_meta_n11",
      label: "Configurar público\nobjetivo",
      dept: "paid_media",
      description: "Paid Media configura el público objetivo.",
    },
    {
      id: "camp_meta_n12",
      label: "Configurar\nubicaciones",
      dept: "paid_media",
      description: "Paid Media configura las ubicaciones de los anuncios.",
    },
    {
      id: "camp_meta_n13",
      label: "Configuraciones\navanzadas",
      dept: "paid_media",
      description: "Paid Media configura píxel, base de datos y otras configuraciones avanzadas.",
    },
    {
      id: "camp_meta_n14",
      label: "Notificar activación\nal cliente",
      dept: "cuentas",
      description: "Cuentas notifica al cliente la activación de las campañas.",
    },
    {
      id: "camp_meta_n15",
      label: "Seguimiento\nsemanal",
      dept: "paid_media",
      description: "Paid Media da seguimiento semanal, revisando y ajustando la campaña.",
    },
    {
      id: "camp_meta_n16",
      label: "Envío de leads y\nretroalimentación",
      dept: "cuentas",
      description: "Cuentas envía los leads al cliente y recibe retroalimentación.",
    },
    {
      id: "camp_meta_n17",
      label: "Reporte mensual\nde resultados",
      dept: "paid_media",
      description: "Paid Media elabora el reporte mensual de resultados.",
    },
    {
      id: "camp_meta_n18",
      label: "Presentación de\nreporte al cliente",
      dept: "cuentas",
      description: "Cuentas presenta el reporte de resultados al cliente.",
    },
    // ── Sub-flujo Google ──────────────────────────────────────────────
    {
      id: "camp_google_n1",
      label: "Crear cuenta\n(cuando aplica)",
      dept: "paid_media",
      description: "Paid Media crea la cuenta de Google Ads cuando aplica.",
    },
    {
      id: "camp_google_n2",
      label: "Copy de\nlanding page",
      dept: "copywriting",
      description: "Copywriting redacta el copy de la landing page de la campaña.",
    },
    {
      id: "camp_google_n3",
      label: "Investigación de\npalabras clave",
      dept: "paid_media",
      description: "Paid Media investiga las palabras clave relevantes para la campaña.",
    },
    {
      id: "camp_google_n4",
      label: "Armar subdominio\n(si aplica web)",
      dept: "desarrollo",
      description: "Desarrollo arma el subdominio para la landing page, si aplica.",
    },
    {
      id: "camp_google_n5",
      label: "Creación de\nlanding page",
      dept: "desarrollo",
      description: "Desarrollo crea la landing page de la campaña (Web).",
    },
    {
      id: "camp_google_n6",
      label: "Conectar\nTag Manager",
      dept: "desarrollo",
      description: "Desarrollo conecta Tag Manager para registrar conversiones (Web).",
    },
    {
      id: "camp_google_n7",
      label: "Configurar objetivos\nde conversión",
      dept: "desarrollo",
      description: "Desarrollo configura los objetivos de conversión de la landing page (Web).",
    },
    {
      id: "camp_google_n8",
      label: "Crear\ncampaña",
      dept: "paid_media",
      description:
        "Paid Media crea la campaña definiendo objetivos, copy de anuncios, presupuesto, públicos y días activos.",
    },
    {
      id: "camp_google_n9",
      label: "Compartir testigos\nde la campaña",
      dept: "cuentas",
      description: "Cuentas comparte con el cliente testigos de cómo luce la campaña.",
    },
    {
      id: "camp_google_n10",
      label: "Armar diseño\no video",
      dept: "diseno",
      description: "Diseño arma el diseño o video de la campaña, si aplica.",
    },
    {
      id: "camp_google_n11",
      label: "Seguimiento a\nsaldo de campaña",
      dept: "cuentas",
      description: "Cuentas da seguimiento para que se ponga saldo a la campaña.",
    },
    {
      id: "camp_google_n12",
      label: "Activación de\nla campaña",
      dept: "paid_media",
      description: "Paid Media activa la campaña.",
    },
    {
      id: "camp_google_n13",
      label: "Monitoreo diario\n(primeros 14 días)",
      dept: "paid_media",
      description: "Paid Media monitorea diariamente la campaña durante los primeros 14 días.",
    },
    {
      id: "camp_google_n14",
      label: "Primeros\najustes",
      dept: "paid_media",
      description:
        "Paid Media aplica los primeros ajustes según la retroalimentación del cliente y el análisis de Dínamo.",
    },
    {
      id: "camp_google_n15",
      label: "Análisis de métricas\na la semana",
      dept: "paid_media",
      description:
        "Paid Media analiza las métricas y resultados obtenidos a la semana de la activación de la campaña.",
    },
    {
      id: "camp_google_n16",
      label: "Reporte y base\nde datos de leads",
      dept: "paid_media",
      description:
        "Paid Media elabora el reporte de resultados y la base de datos con la información de los leads semanales.",
    },
    {
      id: "camp_google_n17",
      label: "Monitoreo semanal\nde indicadores",
      dept: "paid_media",
      description:
        "Paid Media monitorea semanalmente CTR, % de conversiones, QS, saldo, nivel de relevancia de palabras clave y experiencia de usuario, construyendo un histórico.",
    },
    {
      id: "camp_google_n18",
      label: "Retroalimentación\nde campañas",
      dept: "cuentas",
      description: "Cuentas da retroalimentación de las campañas al cliente.",
    },
  ],
  edges: [
    // Funnel comercial
    { from: "camp_n1", to: "camp_n2", label: "prospecto agendado", type: "handoff" },
    { from: "camp_n2", to: "camp_n3", label: "solución definida", type: "handoff" },
    { from: "camp_n3", to: "camp_n4", label: "propuesta lista", type: "handoff" },
    { from: "camp_n4", to: "camp_n5", label: "reunión agendada", type: "handoff" },
    { from: "camp_n5", to: "camp_n6", label: "alcance explicado", type: "handoff" },
    { from: "camp_n6", to: "camp_n7", label: "venta concretada", type: "approval" },
    { from: "camp_n7", to: "camp_n7a", label: "clasificación cliente", type: "handoff" },
    { from: "camp_n7", to: "camp_n7b", label: "clasificación cliente", type: "handoff" },
    { from: "camp_n7", to: "camp_n7c", label: "clasificación cliente", type: "handoff" },
    { from: "camp_n7", to: "camp_n7d", label: "clasificación cliente", type: "handoff" },
    { from: "camp_n7", to: "camp_n7e", label: "clasificación cliente", type: "handoff" },
    { from: "camp_n7a", to: "camp_n8", label: "brief clasificado", type: "handoff" },
    { from: "camp_n7b", to: "camp_n8", label: "brief clasificado", type: "handoff" },
    { from: "camp_n7c", to: "camp_n8", label: "brief clasificado", type: "handoff" },
    { from: "camp_n7d", to: "camp_n8", label: "brief clasificado", type: "handoff" },
    { from: "camp_n7e", to: "camp_n8", label: "brief clasificado", type: "handoff" },
    { from: "camp_n8", to: "camp_n9", label: "contrato definido", type: "handoff" },
    { from: "camp_n9", to: "camp_n10", label: "contrato firmado", type: "handoff" },
    { from: "camp_n10", to: "camp_n11", label: "accesos confirmados", type: "handoff" },
    { from: "camp_n11", to: "camp_n12", label: "kickoff interno listo", type: "handoff" },
    { from: "camp_n12", to: "camp_n13", label: "kickoff con cliente listo", type: "handoff" },
    { from: "camp_n13", to: "camp_n14", label: "plan de trabajo enviado", type: "handoff" },
    { from: "camp_n14", to: "camp_n15", label: "estrategia definida", type: "handoff" },
    { from: "camp_n15", to: "camp_n16", label: "estrategia validada internamente", type: "approval" },
    { from: "camp_n16", to: "camp_n17", label: "presentación realizada", type: "review" },
    { from: "camp_n17", to: "camp_n18", label: "visto bueno del cliente", type: "approval" },
    { from: "camp_n18", to: "camp_meta_n1", label: "inicia ejecución en Meta", type: "handoff" },
    { from: "camp_n18", to: "camp_google_n1", label: "inicia ejecución en Google", type: "handoff" },

    // Sub-flujo Meta
    { from: "camp_meta_n1", to: "camp_meta_n2", label: "volumen definido", type: "handoff" },
    { from: "camp_meta_n2", to: "camp_meta_n3", label: "copys propuestos", type: "approval" },
    { from: "camp_meta_n3", to: "camp_meta_n4", label: "copys aprobados", type: "handoff" },
    { from: "camp_meta_n4", to: "camp_meta_n5", label: "anuncios diseñados", type: "approval" },
    { from: "camp_meta_n5", to: "camp_meta_n6", label: "diseños aprobados", type: "handoff" },
    { from: "camp_meta_n6", to: "camp_meta_n7", label: "anuncios enviados", type: "approval" },
    { from: "camp_meta_n7", to: "camp_meta_n8", label: "anuncios aprobados", type: "handoff" },
    { from: "camp_meta_n8", to: "camp_meta_n9", label: "objetivo configurado", type: "handoff" },
    { from: "camp_meta_n9", to: "camp_meta_n10", label: "presupuesto configurado", type: "handoff" },
    { from: "camp_meta_n10", to: "camp_meta_n11", label: "temporalidad configurada", type: "handoff" },
    { from: "camp_meta_n11", to: "camp_meta_n12", label: "público configurado", type: "handoff" },
    { from: "camp_meta_n12", to: "camp_meta_n13", label: "ubicaciones configuradas", type: "handoff" },
    { from: "camp_meta_n13", to: "camp_meta_n14", label: "configuración avanzada lista", type: "handoff" },
    { from: "camp_meta_n14", to: "camp_meta_n15", label: "campaña activada", type: "handoff" },
    { from: "camp_meta_n15", to: "camp_meta_n16", label: "seguimiento realizado", type: "handoff" },
    { from: "camp_meta_n16", to: "camp_meta_n17", label: "leads enviados", type: "handoff" },
    { from: "camp_meta_n17", to: "camp_meta_n18", label: "reporte listo", type: "handoff" },

    // Sub-flujo Google
    { from: "camp_google_n1", to: "camp_google_n2", label: "cuenta creada", type: "handoff" },
    { from: "camp_google_n2", to: "camp_google_n3", label: "copy de landing listo", type: "handoff" },
    { from: "camp_google_n3", to: "camp_google_n4", label: "keywords listas", type: "handoff" },
    { from: "camp_google_n4", to: "camp_google_n5", label: "subdominio listo", type: "handoff" },
    { from: "camp_google_n5", to: "camp_google_n6", label: "landing page lista", type: "handoff" },
    { from: "camp_google_n6", to: "camp_google_n7", label: "tag manager conectado", type: "handoff" },
    { from: "camp_google_n7", to: "camp_google_n8", label: "conversiones configuradas", type: "handoff" },
    { from: "camp_google_n8", to: "camp_google_n9", label: "campaña creada", type: "handoff" },
    { from: "camp_google_n9", to: "camp_google_n10", label: "testigos compartidos", type: "handoff" },
    { from: "camp_google_n10", to: "camp_google_n11", label: "creatividad lista", type: "handoff" },
    { from: "camp_google_n11", to: "camp_google_n12", label: "saldo confirmado", type: "handoff" },
    { from: "camp_google_n12", to: "camp_google_n13", label: "campaña activada", type: "handoff" },
    { from: "camp_google_n13", to: "camp_google_n14", label: "monitoreo inicial listo", type: "handoff" },
    { from: "camp_google_n14", to: "camp_google_n15", label: "ajustes aplicados", type: "feedback" },
    { from: "camp_google_n15", to: "camp_google_n16", label: "métricas analizadas", type: "handoff" },
    { from: "camp_google_n16", to: "camp_google_n17", label: "reporte y BD de leads listos", type: "handoff" },
    { from: "camp_google_n17", to: "camp_google_n18", label: "monitoreo semanal listo", type: "handoff" },
  ],
};
