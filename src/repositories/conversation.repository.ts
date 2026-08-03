import { prisma } from "../database/prisma.js";

export class ConversationRepository {
  async create(data: { userId: string; role: string; content: string }) {
    return prisma.conversation.create({
      data: {
        userId: data.userId,
        role: data.role,
        content: data.content,
      },
    });
  }

  async findRecentMessages(userId: string, limit: number = 10) {
    return prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async deleteAll(userId: string) {
    return prisma.semanticMemory.deleteMany({
      where: {
        userId,
      },
    });
  }
}
