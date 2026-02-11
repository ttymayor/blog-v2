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
  excerpt?: string;
}
