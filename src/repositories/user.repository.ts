import { prisma } from "../database/prisma.js";
import type { Prisma } from "@prisma/client";

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

  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(userId: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }
}
