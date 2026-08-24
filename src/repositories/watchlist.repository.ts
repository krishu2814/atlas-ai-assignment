import { prisma } from "../database/prisma.js";

export class WatchlistRepository {
  async create(userId: string, company: string, symbol?: string) {
    return prisma.watchlist.create({
      data: {
        userId,
        company,
        symbol,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.watchlist.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findByCompany(userId: string, company: string) {
    return prisma.watchlist.findFirst({
      where: {
        userId,
        company,
      },
    });
  }

  async delete(userId: string, company: string) {
    return prisma.watchlist.deleteMany({
      where: {
        userId,
        company,
      },
    });
  }

  async findUsersWithWatchlists() {
    const records = await prisma.watchlist.findMany({
      select: {
        user: {
          select: {
            id: true,
            telegramId: true,
          },
        },
      },
      distinct: ["userId"],
    });

    return records
      .map((r) => r.user)
      .filter((u): u is { id: string; telegramId: string } => Boolean(u && u.telegramId));
  }
}
