import { getCollection } from "astro:content";
import type { BlogPost } from "@/types/blog";

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
    }));
}
