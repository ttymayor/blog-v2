import type { BlogPost } from "@/types/blog";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemFooter,
  ItemMedia,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import RelativeTime from "@/components/react/RelativeTime";
import { motion } from "motion/react";

interface PostListProps {
  posts: BlogPost[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="group/item-group flex flex-col">
      {posts.map((post, i) => (
        <div key={post.id}>
          {i > 0 && (
            <div className="my-1 px-3">
              <ItemSeparator />
            </div>
          )}
          <Item asChild size="sm" className="rounded-2xl">
            <motion.a
              href={`/blog/${post.id}`}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, filter: "none" }}
            >
              {post.heroImage && (
                <img
                  src={post.heroImage}
                  alt={post.title}
                  className="h-16 object-cover"
                  loading="lazy"
                  decoding="async"
                  style={{
                    viewTransitionName: `post-hero-${post.id.replace(/\//g, "-")}`,
                  }}
                />
              )}
              <ItemContent className="min-w-0">
                <ItemTitle
                  className="font-serif text-lg font-bold"
                  style={{
                    viewTransitionName: `post-title-${post.id.replace(/\//g, "-")}`,
                  }}
                >
                  {post.title}
                </ItemTitle>
                {post.excerpt && (
                  <ItemDescription className="truncate">
                    {post.excerpt}
                  </ItemDescription>
                )}
              </ItemContent>
              <ItemFooter>
                <div className="flex flex-wrap items-center gap-1.5">
                  {post.category && (
                    <Badge
                      variant={"default"}
                      style={{
                        viewTransitionName: `post-category-${post.id.replace(/\//g, "-")}`,
                      }}
                    >
                      {post.category}
                    </Badge>
                  )}
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge
                      variant={"secondary"}
                      key={tag}
                      className="rounded-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span className="text-muted-foreground shrink-0 text-xs">
                  <RelativeTime dateStr={post.pubDate} />
                </span>
              </ItemFooter>
            </motion.a>
          </Item>
        </div>
      ))}
    </div>
  );
}
