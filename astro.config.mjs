import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { remarkReadingTime } from "./src/lib/remark-reading-time.mjs";
import { remarkModifiedTime } from "./src/lib/remark-modified-time.mjs";
import rehypePrismPlus from "rehype-prism-plus";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://v2.ttymayor.com",
  fonts: [
    {
      name: "Noto Serif TC",
      cssVariable: "--font-serif",
      provider: fontProviders.google(),
    },
    {
      name: "Geist",
      cssVariable: "--font-geist",
      provider: fontProviders.google(),
    },
    {
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      provider: fontProviders.google(),
    },
  ],
  experimental: {
    queuedRendering: {
      enabled: true,
    },
  },
  integrations: [
    mdx({
      syntaxHighlight: false,
      remarkPlugins: [
        remarkMath,
        remarkGfm,
        remarkReadingTime,
        remarkModifiedTime,
      ],
      rehypePlugins: [
        rehypeKatex,
        [rehypePrismPlus, { ignoreMissing: true }],
        rehypeSlug,
      ],
      gfm: true,
    }),
    sitemap({
      filter: (page) =>
        page !== "https://v2.ttymayor.com/blog/2026/03/new-relationship/" &&
        page !== "https://v2.ttymayor.com/blog/2026/02/i-am-who-i-am/" &&
        page !== "https://v2.ttymayor.com/diff/" &&
        page !== "https://v2.ttymayor.com/blog/2026/04/am-i-the-problem/",
    }),
    react(),
    partytown(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
