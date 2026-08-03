import { AIService } from "../ai/ai.service.js";
import { UserService } from "../user/user.service.js";
import { MemoryService } from "../memory/memory.service.js";
import { buildUserContext } from "../../ai/context/context.builder.js";
import { buildConversationHistory } from "../../ai/context/history.builder.js";
import { OnboardingService } from "../onboarding/onboarding.service.js";
import { SemanticMemoryService } from "../semantic-memory/semantic-memory.service.js";

// this class calls the AIService to generate a response based on the input message
export class ConversationService {
  private readonly aiService: AIService;
  private readonly userService: UserService;
  private readonly memoryService: MemoryService;
  private readonly onboardingService: OnboardingService;
  private readonly semanticMemoryService: SemanticMemoryService;

  constructor() {
    this.aiService = new AIService();
    this.userService = new UserService();
    this.memoryService = new MemoryService();
    this.onboardingService = new OnboardingService();
    this.semanticMemoryService = new SemanticMemoryService();
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
    if (!user.onboardingCompleted) {
      const result = await this.onboardingService.saveAnswer(
        user,
        data.message,
      );
      if (result.completed) {
        return "✅ Your profile has been updated successfully.";
      }

      return result.nextQuestion!;
    }
    const updatedUser = await this.userService.getById(user.id);
    if (!updatedUser) {
      throw new Error("User not found.");
    }
    // get history of the conversation for the user
    // 2. save the message to memory
    await this.memoryService.saveMessage(user.id, "user", data.message);
    // extract facts from the message and save them to semantic memory
    const facts = await this.aiService.extractFacts(data.message);
    for (const fact of facts) {
      await this.semanticMemoryService.saveFact(user.id, fact);
    }

    const history = await this.memoryService.getConversationHistory(user.id);
    // format the history
    const formattedHistory = buildConversationHistory(history);
    const memories = await this.semanticMemoryService.getFacts(user.id);

    const semanticContext =
      memories.length > 0
        ? `
        Long-term Memory:
        ${memories.map((m) => `- ${m}`).join("\n")}
        `
        : "";
    const context = buildUserContext(updatedUser, semanticContext);
    // 3. Generate AI response
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
