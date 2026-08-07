import { Context } from "telegraf";
import { WatchlistService } from "../services/finance/watchlist.service.js";

export class FinanceController {
  private readonly watchlistService: WatchlistService;

  constructor() {
    this.watchlistService = new WatchlistService();
  }

  async handleWatchlist(c: Context) {
    const telegramId = String(c.from?.id);

    const text = c.message && "text" in c.message ? c.message.text.trim() : "";

    const parts = text.split(/\s+/);

    if (parts.length === 1) {
      const companies = await this.watchlistService.getWatchlist(telegramId);

      if (companies.length === 0) {
        await c.reply("Your watchlist is empty.");
        return;
      }

      const message = companies
        .map((item, index) => `${index + 1}. ${item.company}`)
        .join("\n");

      await c.reply(`📈 Your Watchlist\n\n${message}`);
      return;
    }

    const action = parts[1]!.toLowerCase();
    const company = parts.slice(2).join(" ");

    if (!company) {
      await c.reply("Usage:\n/watchlist add Apple\n/watchlist remove Apple");
      return;
    }

    if (action === "add") {
      const response = await this.watchlistService.addCompany(
        telegramId,
        company,
      );

      await c.reply(response);
      return;
    }

    if (action === "remove") {
      const response = await this.watchlistService.removeCompany(
        telegramId,
        company,
      );

      await c.reply(response);
      return;
    }

    await c.reply(
      "Unknown action.\nUse:\n/watchlist add Apple\n/watchlist remove Apple",
    );
  }
}
