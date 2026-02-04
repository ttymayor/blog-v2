import type { CollectionEntry } from "astro:content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  post: CollectionEntry<"blog">;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <a key={post.id} href={`/blog/${post.id}/`}>
      <Card className="h-full rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
        <CardHeader>
          <CardTitle>
            <h3 className="mb-0 text-lg font-bold">{post.data.title}</h3>
          </CardTitle>
          {(post.data.category || post.data.tags.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {post.data.category && (
                <Badge variant="secondary" className="text-xs">
                  {post.data.category}
                </Badge>
              )}
              {post.data.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.data.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.data.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {post.data.description}
          </p>
          <p className="text-muted-foreground text-sm">
            {post.data.pubDate.toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}
