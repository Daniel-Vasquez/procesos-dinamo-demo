export const prerender = false;

import type { APIRoute } from "astro";
import { getAmatzaTimelineData } from "../../../lib/clickup";

export const GET: APIRoute = async () => {
  try {
    const data = await getAmatzaTimelineData();
    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido al consultar ClickUp";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
};
