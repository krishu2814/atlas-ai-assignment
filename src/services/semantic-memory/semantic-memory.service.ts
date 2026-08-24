import { SemanticMemoryRepository } from "../../repositories/semantic-memory.repository.js";
import { HuggingFaceEmbeddingProvider } from "../../provider/embedding/huggingface.provider.js";
import type { AIService } from "../ai/ai.service.js";
import { UserService } from "../user/user.service.js";

export class SemanticMemoryService {
  private readonly semanticMemoryRepository: SemanticMemoryRepository;
  private readonly embeddingProvider: HuggingFaceEmbeddingProvider;
  private readonly userService: UserService;

  constructor() {
    this.semanticMemoryRepository = new SemanticMemoryRepository();
    this.embeddingProvider = new HuggingFaceEmbeddingProvider();
    this.userService = new UserService();
  }

  async saveFact(userId: string, fact: string) {
    const normalizedFact = fact.trim();
    const existing = await this.semanticMemoryRepository.findByUserIdAndFact(
      userId,
      normalizedFact,
    );

    if (existing) {
      return existing;
    }

    const embedding = await this.embeddingProvider.getEmbedding(normalizedFact);
    return this.semanticMemoryRepository.create(userId, normalizedFact, embedding);
  }

  async getFacts(userId: string): Promise<string[]> {
    const memories = await this.semanticMemoryRepository.findByUserId(userId);

    return memories.map((memory) => memory.fact);
  }

  async getRelevantFacts(
    userId: string,
    query: string,
    topK: number = 3,
    threshold: number = 0.35,
  ): Promise<string[]> {
    if (!query.trim()) {
      return this.getFacts(userId);
    }

    const queryVector = await this.embeddingProvider.getEmbedding(query);
    const similar = await this.semanticMemoryRepository.findSimilarFacts(
      userId,
      queryVector,
      topK,
      threshold,
    );

    if (!similar.length) {
      const all = await this.getFacts(userId);
      return all.slice(-2);
    }

    return similar.map((s) => s.fact);
  }

  async clearFacts(userId: string) {
    await this.semanticMemoryRepository.deleteByUserId(userId);
  }

  async getFactsByTelegramId(telegramId: string): Promise<string[]> {
    const user = await this.userService.findByTelegramId(telegramId);
    if (!user) {
      return [];
    }

    return this.getFacts(user.id);
  }

  // This method processes a message, extracts facts using the AIService, and saves them to the semantic memory for the given userId.
  async processMessage(userId: string, message: string, aiService: AIService) {
    const shouldExtract = message.length > 15 && !message.endsWith("?");

    if (!shouldExtract) {
      return;
    }

    const facts = await aiService.extractFacts(message);

    for (const fact of facts) {
      await this.saveFact(userId, fact);
    }
  }

  async clear(userId: string) {
    await this.semanticMemoryRepository.deleteAll(userId);
  }
}

