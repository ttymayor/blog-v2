export const prerender = true;

import type { APIRoute } from "astro";
import { renderOgImage } from "@/lib/og-image";

export const GET: APIRoute = async () => {
  const png = await renderOgImage({
    title: "tantuyu",
    description: "涉世未深、少不更事的年輕人",
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
