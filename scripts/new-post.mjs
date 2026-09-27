#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { input } from "@inquirer/prompts";

const ROOT_DIR = fileURLToPath(new URL("..", import.meta.url));
const BLOG_DIR = join(ROOT_DIR, "src", "content", "blog");

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

function buildPost({ title, pubDate }) {
  return `---
title: ${JSON.stringify(title)}
description: ""
pubDate: ${JSON.stringify(pubDate)}
tags: []
category: ""
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
  const slug = toSlug(title);

  const filePath = join(BLOG_DIR, year, month, `${slug}.mdx`);

  try {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(
      filePath,
      buildPost({
        title,
        pubDate: now.toISOString(),
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
