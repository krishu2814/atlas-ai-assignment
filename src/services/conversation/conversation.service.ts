import { AIService } from "../ai/ai.service.js";
import { UserService } from "../user/user.service.js";
import { MemoryService } from "../memory/memory.service.js";

// this class calls the AIService to generate a response based on the input message
export class ConversationService {
  private readonly aiService: AIService;
  private readonly userService: UserService;
  private readonly memoryService: MemoryService;

  constructor() {
    this.aiService = new AIService();
    this.userService = new UserService();
    this.memoryService = new MemoryService();
  }

  async processMessage(data: {
    telegramId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    message: string;
  }): Promise<string> {
    // 1. get or create user based on the message
    const user = await this.userService.getOrCreateUser({
      telegramId: data.telegramId,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    // 2. save the message to memory
    await this.memoryService.saveMessage(user.id, "user", data.message);
    // 3. Generate AI response
    const aiResponse = await this.aiService.generateResponse(data.message);
    // 4. Save AI response
    await this.memoryService.saveMessage(user.id, "assistant", aiResponse);
    // 5. Return response
    return aiResponse;
  }
}
