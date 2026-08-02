import { prisma } from "../database/prisma.js";

export class UserRepository {
  async findByTelegramId(telegramId: string) {
    return prisma.user.findUnique({
      where: {
        telegramId,
      },
    });
  }

  async create(data: {
    telegramId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  }) {
    return prisma.user.create({
      data: {
        telegramId: data.telegramId,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        interests: [],
        industries: [],
        companies: [],
      },
    });
  }
}
