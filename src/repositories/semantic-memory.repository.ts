import { prisma } from "../database/prisma.js";

export class SemanticMemoryRepository {
  async create(userId: string, fact: string) {
    return prisma.semanticMemory.create({
      data: {
        userId,
        fact,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.semanticMemory.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async deleteByUserId(userId: string) {
    return prisma.semanticMemory.deleteMany({
      where: {
        userId,
      },
    });
  }

  async findByUserIdAndFact(userId: string, fact: string) {
    return prisma.semanticMemory.findFirst({
      where: {
        userId,
        fact,
      },
    });
  }
}
