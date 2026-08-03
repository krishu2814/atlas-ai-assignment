export interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}
