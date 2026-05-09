export const prerender = true;

import type { APIRoute } from "astro";
import { renderOgImage } from "@/lib/og-image";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/consts";

export const GET: APIRoute = async () => {
  const png = await renderOgImage({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
