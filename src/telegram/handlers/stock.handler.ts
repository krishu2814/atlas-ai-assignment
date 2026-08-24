import { Context } from "telegraf";
import { FinanceController } from "../../controllers/finance.controller.js";

const financeController = new FinanceController();

export const stockHandler = async (ctx: Context) => {
  try {
    const message = ctx.message;

    if (!message || !("text" in message)) {
      return;
    }

    const parts = message.text.trim().split(/\s+/);
    const symbol = parts[1];

    if (!symbol) {
      await ctx.reply("Usage:\n/stock AAPL");
      return;
    }

    await ctx.sendChatAction("typing");

    const { quote, analysis } = await financeController.getStockIntelligence(symbol);

    const sign = quote.change >= 0 ? "+" : "";
    const changeFormatted = `${sign}${quote.change.toFixed(2)} (${sign}${quote.changePercent.toFixed(2)}%)`;

    await ctx.reply(
      `📈 ${quote.symbol}\n\n` +
        `💰 Price: $${quote.price.toFixed(2)}\n` +
        `📊 Change: ${changeFormatted}\n` +
        `🔼 High: $${quote.high.toFixed(2)} | 🔽 Low: $${quote.low.toFixed(2)}\n` +
        `🚪 Prev Close: $${quote.previousClose.toFixed(2)}\n\n` +
        `🧠 AI Analysis\n` +
        `${analysis}`,
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "";

    if (errorMessage.includes("not found")) {
      await ctx.reply(`⚠️ ${errorMessage}\nPlease check the ticker symbol and try again.`);
      return;
    }

    console.error("Stock command failed:", error);
    await ctx.reply(
      "Market data is temporarily unavailable. Please try again later.",
    );
  }
};

