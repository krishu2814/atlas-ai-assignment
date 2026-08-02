import { AIService } from "../ai/ai.service.js";
import { UserService } from "../user/user.service.js";
import { MemoryService } from "../memory/memory.service.js";
import { buildUserContext } from "../../ai/context/context.builder.js";
import { buildConversationHistory } from "../../ai/context/history.builder.js";

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
    // get history of the conversation for the user
    const history = await this.memoryService.getConversationHistory(user.id);
    // format the history
    const formattedHistory = buildConversationHistory(history);
    // 2. save the message to memory
    await this.memoryService.saveMessage(user.id, "user", data.message);
    // 3. Generate AI response
    const context = buildUserContext(user);

    const aiResponse = await this.aiService.generateResponse(
      formattedHistory,
      context,
      data.message,
    );
    // 4. Save AI response
    await this.memoryService.saveMessage(user.id, "assistant", aiResponse);
    // 5. Return response
    return aiResponse;
  }
}
