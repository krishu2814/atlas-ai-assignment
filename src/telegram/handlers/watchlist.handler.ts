import { Context } from "telegraf";
import { WatchlistController } from "../../controllers/watchlist.controller.js";

const watchlistController = new WatchlistController();

export const watchlistHandler = async (ctx: Context) => {
  try {
    const telegramId = String(ctx.from?.id);

    if (!telegramId) {
      await ctx.reply("Unable to identify your Telegram account.");
      return;
    }

    const message = ctx.message;
    if (!message || !("text" in message)) {
      return;
    }

    const parts = message.text.trim().split(/\s+/);
    const action = parts[1]?.toLowerCase();
    const company = parts.slice(2).join(" ").trim();

    // Case 1: /watchlist (View watchlist)
    if (!action) {
      await ctx.sendChatAction("typing");
      const list = await watchlistController.getWatchlist(telegramId);

      if (list.length === 0) {
        await ctx.reply(
          "📈 Your watchlist is empty.\n\n" +
            "Add companies or stock symbols:\n" +
            "• /watchlist add Apple\n" +
            "• /watchlist add NVDA",
        );
        return;
      }

      const formattedList = list
        .map((item, index) => {
          const name =
            item.company.length <= 5
              ? item.company.toUpperCase()
              : item.company.charAt(0).toUpperCase() + item.company.slice(1);
          return `${index + 1}. ${name}`;
        })
        .join("\n");

      await ctx.reply(
        `📈 Your Watchlist (${list.length} items)\n\n` +
          `${formattedList}\n\n` +
          `💡 Use /stock <SYMBOL> or /company <NAME> to view real-time market data.`,
      );
      return;
    }

    // Case 2: /watchlist add <company>
    if (action === "add") {
      if (!company) {
        await ctx.reply(
          "Please provide a company name or ticker symbol to add.\n\nExample:\n/watchlist add Apple\n/watchlist add AAPL",
        );
        return;
      }

      await ctx.sendChatAction("typing");
      const response = await watchlistController.addCompany(telegramId, company);
      await ctx.reply(`✅ ${response}`);
      return;
    }

    // Case 3: /watchlist remove <company>
    if (action === "remove") {
      if (!company) {
        await ctx.reply(
          "Please provide a company name or ticker symbol to remove.\n\nExample:\n/watchlist remove Apple",
        );
        return;
      }

      await ctx.sendChatAction("typing");
      const response = await watchlistController.removeCompany(telegramId, company);
      await ctx.reply(`🗑️ ${response}`);
      return;
    }

    // Default: Invalid command syntax
    await ctx.reply(
      "Usage:\n" +
        "• /watchlist (view tracked items)\n" +
        "• /watchlist add <company/symbol>\n" +
        "• /watchlist remove <company/symbol>",
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "";

    if (errorMessage.includes("User not found")) {
      await ctx.reply("Please start the bot first with /start.");
      return;
    }

    console.error("Watchlist command error:", error);
    await ctx.reply(
      "Unable to process your watchlist request right now. Please try again later.",
    );
  }
};
