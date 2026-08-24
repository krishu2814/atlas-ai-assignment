import { Context } from "telegraf";
import { NewsController } from "../../controllers/news.controller.js";

const newsController = new NewsController();

export async function newsHandler(ctx: Context) {
  try {
    if (!ctx.message || !("text" in ctx.message)) {
      return;
    }

    const topic = ctx.message.text.replace("/news", "").trim();
    if (!topic) {
      await ctx.reply("Usage:\n/news AI");
      return;
    }

    await ctx.sendChatAction("typing");

    const news = await newsController.getNews(topic);
    if (!news.articles?.length) {
      await ctx.reply(`No news found for "${topic}".`);
      return;
    }

    let response = `📰 Latest news about ${topic}\n\n`;

    news.articles.forEach((article, index) => {
      response += `${index + 1}. ${article.title}\n`;
      response += `Source: ${article.source.name}\n`;
      response += `${article.url}\n\n`;
    });

    await ctx.reply(response.trim());
  } catch (error) {
    console.error("News command failed:", error);
    await ctx.reply(
      "Unable to fetch news right now. Please try again later.",
    );
  }
}
