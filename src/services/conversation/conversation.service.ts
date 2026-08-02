import { AIService } from "../ai/ai.service.js";

// this class calls the AIService to generate a response based on the input message
export class ConversationService {
  private readonly aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  async processMessage(message: string): Promise<string> {
    const response = await this.aiService.generateResponse(message);
    return response;
  }
}
