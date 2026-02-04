import type { BlogPost } from "@/types/blog";

export interface FilterState {
  query: string;
  tags: string[];
  category: string | null;
}

export interface BlogIndexProps {
  posts: BlogPost[];
  allTags: string[];
  allCategories: string[];
}
