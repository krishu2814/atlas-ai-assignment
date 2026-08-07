import { WatchlistRepository } from "../../repositories/watchlist.repository.js";
import { UserRepository } from "../../repositories/user.repository.js";

export class WatchlistService {
  private readonly watchlistRepository: WatchlistRepository;
  private readonly userRepository: UserRepository;

  constructor() {
    this.watchlistRepository = new WatchlistRepository();
    this.userRepository = new UserRepository();
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
}
