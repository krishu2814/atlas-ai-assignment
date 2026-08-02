import { ConversationService } from "../services/conversation/conversation.service.js";

// this class acts as a controller for the conversation service
export class ConversationController {
  private readonly conversationService: ConversationService;

  constructor() {
    this.conversationService = new ConversationService();
  }

  async handleMessage(message: string) {
    return this.conversationService.processMessage(message);
  }
}
