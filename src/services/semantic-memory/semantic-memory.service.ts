import { SemanticMemoryRepository } from "../../repositories/semantic-memory.repository.js";

export class SemanticMemoryService {
  private readonly repository: SemanticMemoryRepository;

  constructor() {
    this.repository = new SemanticMemoryRepository();
  }

  async saveFact(userId: string, fact: string) {
    const existing = await this.repository.findByUserIdAndFact(userId, fact);

    if (existing) {
      return existing;
    }

    return this.repository.create(userId, fact);
  }

  async getFacts(userId: string): Promise<string[]> {
    const memories = await this.repository.findByUserId(userId);

    return memories.map((memory) => memory.fact);
  }

  async clearFacts(userId: string) {
    await this.repository.deleteByUserId(userId);
  }
}
