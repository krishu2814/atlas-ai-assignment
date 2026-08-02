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
}
