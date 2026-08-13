#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { checkbox, input } from "@inquirer/prompts";
import { analyzePostMeta } from "./lib/post-meta.mjs";

const ROOT_DIR = fileURLToPath(new URL("..", import.meta.url));
const BLOG_DIR = join(ROOT_DIR, "src", "content", "blog");
const { tags: TAG_STATS, categories: CAT_STATS } = analyzePostMeta(BLOG_DIR);
const CATEGORIES = CAT_STATS.map(({ name }) => name);
const DEFAULT_CATEGORY = CATEGORIES[0] ?? "tech";

function toSlug(title) {
  return (
    title
      .normalize("NFKC")
      .toLocaleLowerCase("zh-Hant")
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "untitled"
  );
}

function validateSlug(value) {
  const slug = value.trim();
  if (!slug) return "Slug is required";
  if (!/^[\p{L}\p{N}][\p{L}\p{N}_-]*$/u.test(slug)) {
    return "Slug may contain only letters, numbers, underscores, and hyphens";
  }
  return true;
}

function buildPost({ title, description, pubDate, tags, category }) {
  return `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
pubDate: ${JSON.stringify(pubDate)}
tags: ${JSON.stringify(tags)}
category: ${JSON.stringify(category)}
draft: true
---

## 前言



## 內容



## 總結

`;
}

async function main() {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  const title = (
    await input({
      message: "Post title:",
      validate: (value) => value.trim() !== "" || "Title is required",
    })
  ).trim();
  const description = (await input({ message: "Description (optional):" })).trim();
  const category = (
    await input({
      message: `Category (${CATEGORIES.join(" / ")}):`,
      default: DEFAULT_CATEGORY,
      validate: (value) => value.trim() !== "" || "Category is required",
    })
  ).trim();
  const selectedTags = await checkbox({
    message: "Select tags:",
    choices: TAG_STATS.map(({ name, count }) => ({
      name: `${name} (${count})`,
      value: name,
    })),
  });
  const extraTags = (await input({ message: "Additional tags (comma separated, optional):" }))
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const tags = [...new Set([...selectedTags, ...extraTags])];
  const slug = (
    await input({
      message: "Slug:",
      default: toSlug(title),
      validate: validateSlug,
    })
  )
    .trim()
    .normalize("NFKC");

  const filePath = join(BLOG_DIR, year, month, `${slug}.mdx`);

  try {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(
      filePath,
      buildPost({
        title,
        description,
        pubDate: now.toISOString(),
        tags,
        category,
      }),
      { encoding: "utf-8", flag: "wx" },
    );
  } catch (error) {
    if (error.code === "EEXIST") {
      console.error(`File already exists: ${relative(ROOT_DIR, filePath)}`);
    } else {
      console.error(`Failed to create ${relative(ROOT_DIR, filePath)}: ${error.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Created: ${relative(ROOT_DIR, filePath)}`);
}

try {
  await main();
} catch (error) {
  if (error.name === "ExitPromptError") {
    console.error("Cancelled.");
    process.exitCode = 1;
  } else {
    throw error;
  }
}
