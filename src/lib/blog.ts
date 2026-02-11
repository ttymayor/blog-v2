import { getCollection } from "astro:content";
import type { BlogPost } from "@/types/blog";

function extractExcerpt(body: string, maxLength = 100): string {
  return body
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^>.*$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!?\[.*?\]\(.*?\)/g, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/[*_~`]/g, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, maxLength)
    .trimEnd() + "…";
}

export async function getPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog");

  return posts
    .filter((post) => !post.data.draft || import.meta.env.DEV)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate.toISOString(),
      updatedDate: post.data.updatedDate?.toISOString(),
      heroImage: post.data.heroImage?.src,
      tags: post.data.tags,
      category: post.data.category,
      draft: post.data.draft,
      excerpt: post.data.description || extractExcerpt(post.body ?? ""),
    }));
}
