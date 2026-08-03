import { GNewsProvider } from "../../provider/news/gnews.provider.js";

export class NewsService {
  private readonly newsProvider = new GNewsProvider();

  async getNews(topic: string) {
    return this.newsProvider.search(topic);
  }
}
