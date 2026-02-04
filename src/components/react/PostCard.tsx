import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types/blog";
// import { Pencil } from "lucide-react";

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <a key={post.id} href={`/blog/${post.id}/`}>
      <Card className="h-full rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
        <CardHeader>
          <CardTitle>
            <h3 className="mb-0 flex items-center gap-2 text-lg font-bold">
              {post.title}

              {post.draft &&
                import.meta.env.DEV &&
                // <Pencil className="size-4" />
                "draft"}
            </h3>
          </CardTitle>
          {(post.category || post.tags?.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {post.category && (
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              )}
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {post.description}
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            {new Date(post.pubDate).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}
