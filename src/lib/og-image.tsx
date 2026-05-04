import React from "react";
import { SITE_TITLE } from "@/consts";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";

const fontDir = join(
  process.cwd(),
  "node_modules",
  "geist",
  "dist",
  "fonts",
  "geist-sans",
);

const fontRegular = readFileSync(join(fontDir, "Geist-Regular.ttf"));
const fontBold = readFileSync(join(fontDir, "Geist-Bold.ttf"));

// Fetch a subset of Noto Sans TC from Google Fonts that only contains the
// glyphs used by `text`. This keeps the embedded font tiny and lets satori
// render CJK characters.
const cjkFontCache = new Map<string, ArrayBuffer>();
async function loadCjkFont(
  text: string,
  weight: 400 | 700,
): Promise<ArrayBuffer | null> {
  const chars = Array.from(new Set(text)).filter((c) => c.charCodeAt(0) > 127);
  if (chars.length === 0) return null;
  const key = `${weight}:${[...chars].sort().join("")}`;
  const cached = cjkFontCache.get(key);
  if (cached) return cached;

  const cssUrl =
    `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@${weight}` +
    `&text=${encodeURIComponent(chars.join(""))}`;
  try {
    const css = await fetch(cssUrl, {
      headers: {
        // Google serves woff2 only to modern UAs.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(5000),
    }).then((r) => r.text());
    const match = css.match(
      /src:\s*url\(([^)]+)\)\s*format\('(woff2?|truetype)'\)/,
    );
    if (!match) return null;
    const buf = await fetch(match[1], {
      signal: AbortSignal.timeout(5000),
    }).then((r) => r.arrayBuffer());
    cjkFontCache.set(key, buf);
    return buf;
  } catch (err) {
    console.warn("[og] CJK font fetch failed:", (err as Error).message);
    return null;
  }
}

interface OgImageOptions {
  title: string;
  description?: string;
  category?: string;
}

export async function renderOgImage({
  title,
  description,
  category,
}: OgImageOptions): Promise<Buffer> {
  const allText = [title, description ?? "", category ?? "", SITE_TITLE].join(
    " ",
  );
  const [cjkRegular, cjkBold] = await Promise.all([
    loadCjkFont(allText, 400),
    loadCjkFont(allText, 700),
  ]);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f1729 100%)",
          color: "#fafafa",
          fontFamily: "Geist, NotoTC",
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column", gap: "24px" },
              children: [
                category && {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignSelf: "flex-start",
                      padding: "8px 20px",
                      borderRadius: "9999px",
                      background: "#fafafa",
                      color: "#0a0a0a",
                      fontSize: "28px",
                      fontWeight: 700,
                    },
                    children: category,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      fontSize: "72px",
                      fontWeight: 700,
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                    },
                    children: title,
                  },
                },
                description && {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      fontSize: "32px",
                      color: "#a1a1aa",
                      lineHeight: 1.4,
                    },
                    children: description,
                  },
                },
              ].filter(Boolean),
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "28px",
                color: "#a1a1aa",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      fontWeight: 700,
                      color: "#fafafa",
                    },
                    children: SITE_TITLE,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { display: "flex" },
                    children: "v2.ttymayor.com",
                  },
                },
              ],
            },
          },
        ],
      },
    } as React.ReactElement,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Geist", data: fontRegular, weight: 400, style: "normal" },
        { name: "Geist", data: fontBold, weight: 700, style: "normal" },
        ...(cjkRegular
          ? [
              {
                name: "NotoTC",
                data: cjkRegular,
                weight: 400 as const,
                style: "normal" as const,
              },
            ]
          : []),
        ...(cjkBold
          ? [
              {
                name: "NotoTC",
                data: cjkBold,
                weight: 700 as const,
                style: "normal" as const,
              },
            ]
          : []),
      ],
    },
  );

  return await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, quality: 80, palette: true })
    .toBuffer();
}
