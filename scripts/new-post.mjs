#!/usr/bin/env node

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { input, checkbox } from "@inquirer/prompts";

const AVAILABLE_TAGS = [
  "astro", "react", "typescript", "javascript", "css", "tailwind",
  "devops", "linux", "tools", "notes", "life"
];

const CATEGORIES = ["tech", "life", "notes", "tutorial"];

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
const pubDate = `${year}-${month}-${now.getDate().toString().padStart(2, "0")}`;

const title = await input({ message: "Post title:", validate: (v) => v.trim() !== "" || "Title is required" });
const description = await input({ message: "Description (optional):" });
const category = await input({
  message: `Category (${CATEGORIES.join(" / ")}):`,
  default: "tech",
});
const tags = await checkbox({
  message: "Select tags:",
  choices: AVAILABLE_TAGS.map((t) => ({ name: t, value: t })),
});

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
