import { WatchlistService } from "../services/finance/watchlist.service.js";

export class WatchlistController {
  private readonly watchlistService: WatchlistService;

  constructor() {
    this.watchlistService = new WatchlistService();
  }

  async getWatchlist(telegramId: string) {
    return this.watchlistService.getWatchlist(telegramId);
  }

  async addCompany(telegramId: string, company: string) {
    return this.watchlistService.addCompany(telegramId, company);
  }

  async removeCompany(telegramId: string, company: string) {
    return this.watchlistService.removeCompany(telegramId, company);
  }
}

