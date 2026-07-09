import type { CrossProcessEdge } from "./types";

export const crossProcessEdges: CrossProcessEdge[] = [
  {
    from: "par_n13",
    to: "camp_meta_n4",
    reason: "Piezas de la parrilla pueden reutilizarse como creatividades de campañas de Meta.",
  },
  {
    from: "par_n2",
    to: "camp_meta_n2",
    reason:
      "Los copys de la parrilla son insumo para los copys de anuncios cuando no hay una parrilla dedicada a la campaña.",
  },
  {
    from: "web_n6",
    to: "camp_google_n4",
    reason:
      "El dominio de desarrollo del proyecto Web es la base para armar el subdominio de la landing page de campañas de Google.",
  },
  {
    from: "web_n20",
    to: "camp_google_n5",
    reason:
      "El sitio publicado en el dominio definitivo es la plataforma sobre la que se crea la landing page de campañas de Google.",
  },
];
