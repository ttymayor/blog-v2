export interface BlogPost {
  id: string;
  title: string;
  description?: string;
  pubDate: string;
  heroImage?: string;
  tags: string[];
  category?: string;
  draft?: boolean;
  chatWithAI?: boolean;
  excerpt?: string;
}
