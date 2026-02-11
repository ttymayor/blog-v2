#!/usr/bin/env node

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: pnpm new-post <slug>");
  console.error("Example: pnpm new-post my-first-post");
  process.exit(1);
}

const now = new Date();
const year = now.getFullYear().toString();
const month = (now.getMonth() + 1).toString().padStart(2, "0");
const pubDate = `${year}-${month}-${now.getDate().toString().padStart(2, "0")}`;

const dir = join("src", "content", "blog", year, month);
const filePath = join(dir, `${slug}.mdx`);

if (existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
}

const content = `---
title: ''
description: ''
pubDate: '${pubDate}'
tags: []
category: ''
draft: true
---

## 前言



## 內容



## 總結

`;

mkdirSync(dir, { recursive: true });
writeFileSync(filePath, content, "utf-8");
console.log(`Created: ${filePath}`);
