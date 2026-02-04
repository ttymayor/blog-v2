import type { BlogPost } from "@/types/blog";
import { PostCard } from "@/components/react/PostCard";

interface BlogPostListProps {
  posts: BlogPost[];
}

export function BlogPostList({ posts }: BlogPostListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-lg">找不到文章</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
