import { NewsService } from "../services/news/news.service.js";

export class NewsController {
  private readonly newsService = new NewsService();

  async getNews(topic: string) {
    return this.newsService.getNews(topic);
  }
}
