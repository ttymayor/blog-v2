import type { CollectionEntry } from "astro:content";
import { PostCard } from "@/components/react/PostCard";

interface LatestPostsProps {
  posts: CollectionEntry<"blog">[];
}

export function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
