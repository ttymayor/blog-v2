import type { BlogPost } from "@/types/blog";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemFooter,
} from "@/components/ui/item";

const rtf = new Intl.RelativeTimeFormat("zh-TW", { numeric: "auto" });

function relativeTime(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.round(diff / 86400000);
  if (Math.abs(days) < 1) return rtf.format(Math.round(diff / 3600000), "hour");
  if (Math.abs(days) < 30) return rtf.format(days, "day");
  if (Math.abs(days) < 365) return rtf.format(Math.round(days / 30), "month");
  return rtf.format(Math.round(days / 365), "year");
}

interface PostListProps {
  posts: BlogPost[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <ItemGroup>
      {posts.map((post, i) => (
        <div key={post.id}>
          {i > 0 && (
            <div className="my-1 px-3">
              <ItemSeparator />
            </div>
          )}
          <Item asChild size="sm" className="rounded-2xl">
            <a href={`/blog/${post.id}`}>
              <ItemContent className="min-w-0">
                <ItemTitle
                  className="font-serif text-lg"
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
                    <span className="text-muted-foreground text-xs">
                      {post.category}
                    </span>
                  )}
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {relativeTime(post.pubDate)}
                </span>
              </ItemFooter>
            </a>
          </Item>
        </div>
      ))}
    </ItemGroup>
  );
}
