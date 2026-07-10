import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";
// import rehypeSlug from "rehype-slug";
import { remarkReadingTime } from "./src/lib/remark-reading-time.mjs";
import { remarkModifiedTime } from "./src/lib/remark-modified-time.mjs";
import rehypePrismPlus from "rehype-prism-plus";
import { satteri } from "@astrojs/markdown-satteri";
import { unified } from "@astrojs/markdown-remark";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://v2.ttymayor.com",
  prefetchAll: false,
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
  markdown: {
    processor: satteri({
      features: { math: true, gfm: true, directive: true },
    }),
  },
  integrations: [
    mdx({
      processor: unified({
        remarkPlugins: [remarkReadingTime, remarkModifiedTime],
        rehypePlugins: [[rehypePrismPlus, { ignoreMissing: true }]],
      }),
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
