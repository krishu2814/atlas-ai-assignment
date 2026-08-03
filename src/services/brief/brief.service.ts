import { AIService } from "../ai/ai.service.js";
import { NewsService } from "../news/news.service.js";
import { UserService } from "../user/user.service.js";

export class BriefService {
  private readonly userService: UserService;
  private readonly newsService: NewsService;
  private readonly aiService: AIService;

  constructor() {
    this.userService = new UserService();
    this.newsService = new NewsService();
    this.aiService = new AIService();
  }

  async generateBrief(telegramId: string): Promise<string> {
    // Fetch user
    const user = await this.userService.findByTelegramId(telegramId);

    if (!user) {
      return "User not found.";
    }

    // Ensure onboarding is complete
    if (!user.onboardingCompleted) {
      return "Please complete your profile first using /update.";
    }

    // Collect unique topics and limit them
    const topics = [
      ...new Set([...user.interests, ...user.industries, ...user.companies]),
    ]
      .map((topic) => topic.trim())
      .filter(Boolean)
      .slice(0, 3);

    if (topics.length === 0) {
      return "No interests found. Update your profile using /update.";
    }

    // Make a single search query
    const query = topics.join(" OR ");

    const news = await this.newsService.getNews(query);

    if (!news.articles.length) {
      return "No recent news found for your interests.";
    }

    let articles = "";

    for (const article of news.articles) {
      articles += `
Title: ${article.title}
Description: ${article.description ?? "No description"}
Source: ${article.source.name}

`;
    }

    // AI Summary
    return this.aiService.summarizeDailyBrief(
      user.firstName ?? "there",
      articles,
    );
  }
}
