import { useEffect, useState } from "react";
import Filter from "./Filter";
import PostList from "./PostList";
import type { BlogPost } from "@/types/blog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PAGE_SIZE = 15;

interface PostBrowserProps {
  posts: BlogPost[];
}

export default function PostBrowser({ posts }: PostBrowserProps) {
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [page, setPage] = useState(1);

  function onSetPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0 });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = search.toLowerCase();
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          (post.category?.toLowerCase().includes(q) ?? false),
      );
      setFilteredPosts(filtered);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, posts]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const pagePosts = filteredPosts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function getPageNumbers() {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, null, totalPages];
    if (page >= totalPages - 2)
      return [
        1,
        null,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [1, null, page - 1, page, page + 1, null, totalPages];
  }

  return (
    <div className="flex flex-col gap-4">
      <Filter
        search={search}
        setSearch={setSearch}
        totalPosts={filteredPosts.length}
      />
      <PostList posts={pagePosts} />
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onSetPage(Math.max(1, page - 1))}
                aria-disabled={page === 1}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {getPageNumbers().map((p, i) =>
              p === null ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => onSetPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => onSetPage(Math.min(totalPages, page + 1))}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
