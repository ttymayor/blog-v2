import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const BLOG_DIR = join("src", "content", "blog");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (/\.mdx?$/.test(entry)) out.push(full);
  }
  return out;
}

function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  return m[1];
}

function extractCategory(fm) {
  const m = fm.match(/^category:\s*['"]?([^'"\n]+?)['"]?\s*$/m);
  return m ? m[1].trim() : null;
}

function extractTags(fm) {
  const m = fm.match(/^tags:\s*\[([^\]]*)\]/m);
  if (!m) return [];
  return m[1]
    .split(",")
    .map((t) => t.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);
}

/**
 * Scan all blog posts and collect unique tags and categories with usage counts.
 * Returns { tags: [{name, count}], categories: [{name, count}] } sorted by count desc.
 */
export function analyzePostMeta(baseDir = BLOG_DIR) {
  const files = walk(baseDir);
  const tagCount = new Map();
  const catCount = new Map();

  for (const file of files) {
    const fm = parseFrontmatter(readFileSync(file, "utf-8"));
    if (!fm) continue;
    for (const t of extractTags(fm)) {
      tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
    }
    const c = extractCategory(fm);
    if (c) catCount.set(c, (catCount.get(c) ?? 0) + 1);
  }

  const toSorted = (map) =>
    [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return { tags: toSorted(tagCount), categories: toSorted(catCount) };
}
