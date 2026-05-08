import { getCollection } from "astro:content";
import type { BlogPost } from "@/types/blog";

function extractExcerpt(body: string, maxLength = 300): string {
  return (
    body
      .replace(/^---[\s\S]*?---/, "")
      .replace(/^>.*$/gm, "")
      .replace(/```[\s\S]*?```/g, "")
      // [alt](url) --> alt
      .replace(/!?\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/#{1,6}\s+/g, "")
      .replace(/[*_~`]/g, "")
      .replace(/\n+/g, " ")
      .replace(/<YouTubeEmbed id="(.*?)" \/>/g, "[YouTube 嵌入]")
      .trim()
      .slice(0, maxLength)
      .trimEnd() + "…"
  );
}

export async function getAdjacentPosts(currentId: string): Promise<{
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
}> {
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.id === currentId);
  return {
    prevPost: posts[index + 1] ?? null, // older
    nextPost: posts[index - 1] ?? null, // newer
  };
}

function countWords(body: string): number {
  const clean = body
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/!?\[.*?\]\(.*?\)/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, "");

  const cjk = (clean.match(/[一-鿿㐀-䶿]/g) ?? []).length;
  const latin = clean
    .replace(/[一-鿿㐀-䶿]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  return cjk + latin;
}

export async function getTotalWordCount(): Promise<number> {
  const posts = await getCollection("blog");
  return posts
    .filter((post) => !post.data.draft)
    .reduce((sum, post) => sum + countWords(post.body ?? ""), 0);
}

export async function getPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog");

  return posts
    .filter((post) => !post.data.draft || import.meta.env.DEV)
    .sort((a, b) => b.data.pubDate.localeCompare(a.data.pubDate))
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      heroImage: post.data.heroImage?.src,
      tags: post.data.tags,
      category: post.data.category,
      draft: post.data.draft,
      chatWithAI: post.data.chatWithAI,
      excerpt: post.data.description || extractExcerpt(post.body ?? ""),
    }));
}
