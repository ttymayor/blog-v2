// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { remarkReadingTime } from "./src/lib/remark-reading-time.mjs";
import { remarkModifiedTime } from "./src/lib/remark-modified-time.mjs";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://v2.ttymayor.com",
  fonts: [
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
    {
      provider: fontProviders.local(),
      name: "GeistPixelGrid",
      cssVariable: "--font-geist-pixel-grid",
      options: {
        variants: [{
          src: ['./src/assets/fonts/GeistPixel/GeistPixel-Grid.woff2'],
          weight: 'normal',
          style: 'normal'
        }]
      }
    }
  ],
  experimental: {
    queuedRendering: {
      enabled: true,
    },
  },
  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      remarkPlugins: [
        remarkMath,
        remarkGfm,
        remarkReadingTime,
        remarkModifiedTime,
      ],
      rehypePlugins: [rehypeKatex, rehypeSlug],
      gfm: true,
    }),
    sitemap(),
    react(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
