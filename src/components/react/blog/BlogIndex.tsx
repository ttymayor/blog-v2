import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDownIcon, XIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SearchInput } from "./SearchInput";
import { BlogPostList } from "./BlogPostList";
import type { BlogIndexProps, FilterState, BlogPost } from "./types";

// Category Selector Component
function CategorySelector({
  categories,
  selected,
  onChange,
  placeholder = "Select category...",
}: {
  categories: string[];
  selected: string | null;
  onChange: (selected: string | null) => void;
  placeholder?: string;
}) {
  const handleSelect = (category: string | null) => {
    onChange(category);
  };

  if (categories.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "h-9 w-full justify-between px-3 py-2",
            !selected && "text-muted-foreground",
          )}
        >
          <span className="truncate">{selected || placeholder}</span>
          <div className="flex items-center gap-1">
            {selected && (
              <button
                type="button"
                className="hover:bg-accent rounded-full p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                aria-label="Clear category"
              >
                <XIcon className="text-muted-foreground h-4 w-4" />
              </button>
            )}
            <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-2"
        align="start"
      >
        <div className="max-h-60 overflow-y-auto">
          {categories.map((category) => {
            const isSelected = selected === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleSelect(isSelected ? null : category)}
                className={cn(
                  "hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm",
                  isSelected && "bg-accent",
                )}
              >
                <span>{category}</span>
                {isSelected && <CheckIcon className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Tag Selector Component
function TagSelector({
  tags,
  selected,
  onChange,
  placeholder = "Select tags...",
}: {
  tags: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}) {
  const handleToggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  const handleRemove = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((t) => t !== tag));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  if (tags.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "h-auto min-h-9 w-full justify-between px-3 py-2",
            selected.length === 0 && "text-muted-foreground",
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selected.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              selected.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="mr-1 mb-1 last:mb-0"
                >
                  {tag}
                  <button
                    type="button"
                    className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                    onClick={(e) => handleRemove(tag, e)}
                    aria-label={`Remove ${tag}`}
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
          <div className="flex items-center gap-1">
            {selected.length > 0 && (
              <button
                type="button"
                className="hover:bg-accent rounded-full p-0.5"
                onClick={handleClearAll}
                aria-label="Clear all tags"
              >
                <XIcon className="text-muted-foreground h-4 w-4" />
              </button>
            )}
            <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-2"
        align="start"
      >
        <div className="max-h-60 overflow-y-auto">
          {tags.map((tag) => {
            const isSelected = selected.includes(tag);
            return (
              <label
                key={tag}
                className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5"
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleToggle(tag)}
                />
                <span className="text-sm">{tag}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function getInitialFilters(): FilterState {
  if (typeof window === "undefined") {
    return { query: "", tags: [], category: null };
  }

  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  const tags = params.get("tags")?.split(",").filter(Boolean) || [];
  const category = params.get("category") || null;

  return { query, tags, category };
}

function updateUrl(filters: FilterState) {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.tags.length > 0) params.set("tags", filters.tags.join(","));
  if (filters.category) params.set("category", filters.category);

  const search = params.toString();
  const url = search ? `?${search}` : window.location.pathname;
  window.history.replaceState({}, "", url);
}

function filterPosts(posts: BlogPost[], filters: FilterState): BlogPost[] {
  return posts.filter((post) => {
    if (filters.query) {
      const searchLower = filters.query.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(searchLower);
      const matchesDesc = post.description.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDesc) return false;
    }

    if (filters.tags.length > 0) {
      const hasAllTags = filters.tags.every((tag) => post.tags.includes(tag));
      if (!hasAllTags) return false;
    }

    if (filters.category) {
      if (post.category !== filters.category) return false;
    }

    return true;
  });
}

export function BlogIndex({ posts, allTags, allCategories }: BlogIndexProps) {
  const [filters, setFilters] = useState<FilterState>(getInitialFilters);

  useEffect(() => {
    updateUrl(filters);
  }, [filters]);

  const filteredPosts = useMemo(
    () => filterPosts(posts, filters),
    [posts, filters],
  );

  const handleSearchChange = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  }, []);

  const handleTagsChange = useCallback((tags: string[]) => {
    setFilters((prev) => ({ ...prev, tags }));
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ query: "", tags: [], category: null });
  }, []);

  const hasFilters =
    filters.query || filters.tags.length > 0 || filters.category;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="w-full">
          <SearchInput value={filters.query} onChange={handleSearchChange} />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          {allCategories.length > 0 && (
            <div className="w-full sm:w-48">
              <CategorySelector
                categories={allCategories}
                selected={filters.category}
                onChange={handleCategoryChange}
                placeholder="Category"
              />
            </div>
          )}

          {allTags.length > 0 && (
            <div className="w-full sm:w-64">
              <TagSelector
                tags={allTags}
                selected={filters.tags}
                onChange={handleTagsChange}
                placeholder="Select tags..."
              />
            </div>
          )}

          {hasFilters && (
            <Button
              variant="outline"
              size="default"
              onClick={handleClearFilters}
            >
              清除
            </Button>
          )}
        </div>
      </div>

      <p className="text-muted-foreground text-sm">
        {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}{" "}
        {hasFilters && "found"}
      </p>

      <BlogPostList posts={filteredPosts} />
    </div>
  );
}
