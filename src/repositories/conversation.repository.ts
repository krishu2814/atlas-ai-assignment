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
}
