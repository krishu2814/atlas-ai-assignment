import { prisma } from "../database/prisma.js";
import { cosineSimilarity } from "../services/semantic-memory/vector.utils.js";

export interface SemanticFactResult {
  id: string;
  fact: string;
  similarity: number;
}

export class SemanticMemoryRepository {
  async create(userId: string, fact: string, embedding: number[] = []) {
    return prisma.semanticMemory.create({
      data: {
        userId,
        fact,
        embedding,
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

  async findSimilarFacts(
    userId: string,
    queryVector: number[],
    topK: number = 3,
    threshold: number = 0.4,
  ): Promise<SemanticFactResult[]> {
    const memories = await this.findByUserId(userId);

    if (!memories.length || !queryVector.length) {
      return [];
    }

    const scored = memories
      .map((memory) => {
        const similarity =
          memory.embedding && memory.embedding.length > 0
            ? cosineSimilarity(queryVector, memory.embedding)
            : 0;

        return {
          id: memory.id,
          fact: memory.fact,
          similarity,
        };
      })
      .filter((m) => m.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity);

    return scored.slice(0, topK);
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

  async deleteAll(userId: string) {
    return prisma.semanticMemory.deleteMany({
      where: {
        userId,
      },
    });
  }
}

