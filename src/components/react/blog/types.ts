export interface BlogPost {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  heroImage?: string;
  tags: string[];
  category?: string;
  draft?: boolean;
}

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
