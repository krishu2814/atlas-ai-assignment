import { ConversationRepository } from "../../repositories/conversation.repository.js";

export class MemoryService {
  private readonly repository: ConversationRepository;

  constructor() {
    this.repository = new ConversationRepository();
  }

  async saveMessage(userId: string, role: string, content: string) {
    return this.repository.create({
      userId,

      role,

      content,
    });
  }

  async getConversationHistory(userId: string) {
    const messages = await this.repository.findRecentMessages(userId, 10);
    // in reverse order to have the oldest message first
    return messages.reverse();
  }

  async clear(userId: string): Promise<void> {
    await this.repository.deleteAll(userId);
  }
}
