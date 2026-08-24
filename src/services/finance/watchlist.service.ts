import { WatchlistRepository } from "../../repositories/watchlist.repository.js";
import { UserRepository } from "../../repositories/user.repository.js";
import { FinanceService } from "./finance.service.js";
import { FinnhubProvider } from "../../provider/finance/finnhub.provider.js";
import type { StockQuote } from "../../types/finance.js";

export class WatchlistService {
  private readonly watchlistRepository: WatchlistRepository;
  private readonly userRepository: UserRepository;
  private readonly financeService: FinanceService;
  private readonly finnhubProvider: FinnhubProvider;

  constructor() {
    this.watchlistRepository = new WatchlistRepository();
    this.userRepository = new UserRepository();
    this.financeService = new FinanceService();
    this.finnhubProvider = new FinnhubProvider();
  }

  async addCompany(telegramId: string, company: string) {
    const user = await this.userRepository.findByTelegramId(telegramId);

    if (!user) {
      throw new Error("User not found.");
    }
    const normalizedCompany = company.trim().toLowerCase();
    const existing = await this.watchlistRepository.findByCompany(
      user.id,
      normalizedCompany,
    );

    if (existing) {
      return `${company} is already in your watchlist.`;
    }

    await this.watchlistRepository.create(user.id, normalizedCompany);

    return `${company} added to your watchlist.`;
  }

  async removeCompany(telegramId: string, company: string) {
    const user = await this.userRepository.findByTelegramId(telegramId);

    if (!user) {
      throw new Error("User not found.");
    }

    const normalizedCompany = company.trim().toLowerCase();
    await this.watchlistRepository.delete(user.id, normalizedCompany);

    return `${company} removed from your watchlist.`;
  }

  async getWatchlist(telegramId: string) {
    const user = await this.userRepository.findByTelegramId(telegramId);

    if (!user) {
      throw new Error("User not found.");
    }

    return this.watchlistRepository.findByUserId(user.id);
  }

  async getUsersWithWatchlists() {
    return this.watchlistRepository.findUsersWithWatchlists();
  }

  async evaluateUserWatchlist(telegramId: string): Promise<string | null> {
    const user = await this.userRepository.findByTelegramId(telegramId);
    if (!user) {
      return null;
    }

    const items = await this.watchlistRepository.findByUserId(user.id);
    if (!items.length) {
      return null;
    }

    const quotes: Array<{ name: string; symbol: string; quote: StockQuote }> = [];

    for (const item of items) {
      try {
        let symbol = item.symbol;
        if (!symbol) {
          if (/^[A-Za-z0-9.]{1,5}$/.test(item.company)) {
            symbol = item.company.toUpperCase();
          } else {
            const search = await this.finnhubProvider.searchCompany(item.company);
            if (search.result?.length) {
              symbol = search.result[0].symbol;
            }
          }
        }

        if (symbol) {
          const quote = await this.financeService.getStockQuote(symbol);
          quotes.push({
            name: item.company,
            symbol,
            quote,
          });
        }
      } catch {
        continue;
      }
    }

    if (!quotes.length) {
      return null;
    }

    const lines = quotes.map(({ symbol, quote }) => {
      const sign = quote.change >= 0 ? "+" : "";
      const isMover = Math.abs(quote.changePercent) >= 2.0;
      const tag = isMover
        ? quote.change >= 0
          ? " 🚀"
          : " 🔻"
        : "";

      return `• ${symbol}: $${quote.price.toFixed(2)} (${sign}${quote.changePercent.toFixed(2)}%)${tag}`;
    });

    return [
      `📊 Watchlist Market Update\n`,
      ...lines,
      `\n💡 Use /stock <SYMBOL> for detailed AI analysis.`,
    ].join("\n");
  }
}

