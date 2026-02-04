// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://ttymayor.com",

  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [rehypeKatex],
      gfm: true,
    }),
    sitemap(),
    react(),
  ],

  output: "server",

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});
