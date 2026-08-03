import { SemanticMemoryService } from "../services/semantic-memory/semantic-memory.service.js";

export class MemoryController {
  private readonly semanticMemoryService: SemanticMemoryService;

  constructor() {
    this.semanticMemoryService = new SemanticMemoryService();
  }

  async getMemory(telegramId: string): Promise<string> {
    const memories =
      await this.semanticMemoryService.getFactsByTelegramId(telegramId);

    if (memories.length === 0) {
      return "🧠 No long-term memories found.";
    }

    return [
      "🧠 Your Long-Term Memory\n",
      ...memories.map((memory, index) => `${index + 1}. ${memory}`),
    ].join("\n");
  }
}
