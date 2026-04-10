export const prerender = true;

import type { APIRoute } from "astro";
import { renderOgImage } from "@/lib/og-image";

export const GET: APIRoute = async () => {
  const png = await renderOgImage({
    title: "About",
    description: "tantuyu 的個人網站",
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
