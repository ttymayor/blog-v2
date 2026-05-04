#!/usr/bin/env node

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { input, checkbox } from "@inquirer/prompts";
import { analyzePostMeta } from "./lib/post-meta.mjs";

const { tags: TAG_STATS, categories: CAT_STATS } = analyzePostMeta();
const CATEGORIES = CAT_STATS.map((c) => c.name);
const DEFAULT_CATEGORY = CATEGORIES[0] ?? "tech";

function toSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-");
}

const now = new Date();
const year = now.getFullYear().toString();
const month = (now.getMonth() + 1).toString().padStart(2, "0");
const pubDate = now.toISOString();

const title = await input({ message: "Post title:", validate: (v) => v.trim() !== "" || "Title is required" });
const description = await input({ message: "Description (optional):" });
const category = await input({
  message: `Category (${CATEGORIES.join(" / ")}):`,
  default: DEFAULT_CATEGORY,
});
const selectedTags = await checkbox({
  message: "Select tags:",
  choices: TAG_STATS.map((t) => ({ name: `${t.name} (${t.count})`, value: t.name })),
});
const extraTagsInput = await input({ message: "Additional tags (comma separated, optional):" });
const extraTags = extraTagsInput
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);
const tags = [...new Set([...selectedTags, ...extraTags])];

const slugInput = await input({
  message: "Slug:",
  default: toSlug(title),
  validate: (v) => v.trim() !== "" || "Slug is required",
});

const slug = slugInput.trim();
const dir = join("src", "content", "blog", year, month);
const filePath = join(dir, `${slug}.mdx`);

if (existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
}

const tagsYaml = tags.length > 0 ? `[${tags.map((t) => `'${t}'`).join(", ")}]` : "[]";

const content = `---
title: '${title}'
description: '${description}'
pubDate: '${pubDate}'
tags: ${tagsYaml}
category: '${category}'
draft: true
---

## 前言



## 內容



## 總結

`;

mkdirSync(dir, { recursive: true });
writeFileSync(filePath, content, "utf-8");
console.log(`Created: ${filePath}`);
