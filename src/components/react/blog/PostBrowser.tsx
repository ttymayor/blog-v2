import { useEffect, useState, type MouseEvent } from "react";
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
import { BLOG_PAGE_SIZE } from "@/lib/pagination";

function getPagePath(page: number) {
  return page === 1 ? "/blog" : `/blog/${page}`;
}

function getPageFromUrl(totalPages: number) {
  const match = window.location.pathname.match(/^\/blog\/(\d+)\/?$/);
  const parsedPage = Number(match?.[1] ?? 1);

  if (!Number.isSafeInteger(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return Math.min(parsedPage, totalPages);
}

function updatePageInUrl(page: number, method: "pushState" | "replaceState") {
  const url = new URL(window.location.href);
  url.pathname = getPagePath(page);
  url.searchParams.delete("page");
  window.history[method]({}, "", url);
}

interface PostBrowserProps {
  posts: BlogPost[];
  initialPage?: number;
}

export default function PostBrowser({ posts, initialPage = 1 }: PostBrowserProps) {
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [page, setPage] = useState(initialPage);

  function onSetPage(nextPage: number) {
    setPage(nextPage);
    updatePageInUrl(nextPage, "pushState");
    window.scrollTo({ top: 0 });
  }

  function onPageClick(event: MouseEvent<HTMLAnchorElement>, nextPage: number) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    onSetPage(nextPage);
  }

  function onSearchChange(nextSearch: string) {
    setSearch(nextSearch);

    if (page !== 1) {
      setPage(1);
      updatePageInUrl(1, "replaceState");
    }
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
    }, 300);
    return () => clearTimeout(timer);
  }, [search, posts]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / BLOG_PAGE_SIZE));

  useEffect(() => {
    function syncPageFromUrl() {
      const nextPage = getPageFromUrl(totalPages);

      setPage(nextPage);
    }

    syncPageFromUrl();
    window.addEventListener("popstate", syncPageFromUrl);

    return () => window.removeEventListener("popstate", syncPageFromUrl);
  }, [totalPages]);

  const pagePosts = filteredPosts.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE);

  function getPageNumbers() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, null, totalPages];
    if (page >= totalPages - 2)
      return [1, null, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, null, page - 1, page, page + 1, null, totalPages];
  }

  return (
    <div className="flex flex-col gap-4">
      <Filter search={search} setSearch={onSearchChange} totalPosts={filteredPosts.length} />
      <PostList posts={pagePosts} />
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={getPagePath(Math.max(1, page - 1))}
                onClick={(event) => onPageClick(event, Math.max(1, page - 1))}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                    href={getPagePath(p)}
                    isActive={p === page}
                    onClick={(event) => onPageClick(event, p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                href={getPagePath(Math.min(totalPages, page + 1))}
                onClick={(event) => onPageClick(event, Math.min(totalPages, page + 1))}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
