// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://ttymayor.com",

  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [rehypeKatex, rehypeSlug],
      gfm: true,
    }),
    sitemap(),
    react(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Roboto",
        cssVariable: "--font-roboto",
      },
    ],
  },
});
